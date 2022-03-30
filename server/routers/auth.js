const express = require("express");
const authRouter = express.Router();
const db = require("../sql/db");
const { generateRandomString } = require("../utils/generateRandomString");
const { sendEmail } = require("../middleware/aws");
const { hash, compare } = require("../utils/bc");
const redis = require("redis");

// Redis set-up
const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
});
async function connectClient() {
    await redisClient.connect();
}

connectClient();

const redisKeyTimeout = 60 * 10; // in seconds

// Routes

authRouter.post("/user/addProfile.json", function (req, res) {
    console.log("req.body :>> ", req.body);
    let { first, second, email, pass1, role } = req.body;
    hash(pass1)
        .then((hashedPass) => {
            db.addUser(role, first, second, email, hashedPass)
                .then(({ rows }) => {
                    console.log(`user: ${email} has been added`);
                    req.session.userId = rows[0].id;
                    res.status("200");
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log(`addUser failed with: ${err}`);
                    return res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log(`hashing failed with: ${err}`);
            return res.sendStatus(500);
        });
});

authRouter.post("/user/login", (req, res) => {
    let { email, pass } = req.body;
    console.log(`login attempted by ${email}`);
    if (!email) {
        return res.sendStatus(500);
    }
    db.getUsers(email)
        .then(({ rows }) => {
            compare(pass, rows[0].password)
                .then((match) => {
                    if (match) {
                        req.session.userId = rows[0].id;
                        res.status("200");
                        res.json({ success: true });
                    } else {
                        return res.sendStatus(500);
                    }
                })
                .catch((err) => {
                    console.log(`compare failed with: ${err}`);
                    return res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log(`getUsers failed with: ${err}`);
            return res.sendStatus(500);
        });
});

authRouter.get("/logout", (req, res) => {
    delete req.session.userId;
    return res.redirect("/");
});

authRouter.get("/user/roles.json", async (req, res) => {
    if (req.session.userId > 0) {
        db.getUsers(req.session.userId)
            .then(({ rows: profile }) => {
                res.status("200");
                res.json({ ...profile[0], isUserLoggedIn: true });
            })
            .catch((err) => {
                console.log(`getProfile failed with: ${err}`);
                return res.sendStatus(500);
            });
    } else {
        res.status("200");
        res.json({ isUserLoggedIn: false });
    }
});

authRouter.post("/user/reset-password.json", async (req, res) => {
    let { email } = req.body;
    let code = generateRandomString();
    console.log(`password reset attempted by ${email}`);
    if (!email) {
        return res.sendStatus(500);
    }

    let { rows: user } = await db.getUsers(email).catch((err) => {
        console.log(`getUsers failed with: ${err}`);
        return res.sendStatus(500);
    });
    if (user.length == 0) {
        return res.sendStatus(500);
    }

    await redisClient.setEx(email, redisKeyTimeout, code).catch((err) => {
        console.log(`setting value in redis failed with: ${err}`);
        return res.sendStatus(500);
    });
    console.log("code :>> ", code);

    sendEmail(
        `tin_metal2000@yahoo.com`,
        `Please copy the code below into the required field:\n\n${code}`,
        "Social Leaders Platform password reset"
    );
    res.status("200");
    res.json({ success: true, userId: user[0].id });
});

authRouter.post("/user/update-password.json", async (req, res) => {
    let { userId, email, password, code } = req.body;

    let redisCode = await redisClient.get(email).catch((err) => {
        console.log(`getting value from redis failed with: ${err}`);
        return res.sendStatus(500);
    });

    if (code === redisCode) {
        let newPass = await hash(password).catch((err) => {
            console.log(`hashing failed with: ${err}`);
            return res.sendStatus(500);
        });
        await db.updatePassword(userId, newPass).catch((err) => {
            console.log(`updating password failed with: ${err}`);
            return res.sendStatus(500);
        });
        res.status("200");
        res.json({ success: true });
    } else {
        res.status("304");
        res.json({ success: false });
    }
});

module.exports = authRouter;
