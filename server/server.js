const express = require("express");
const cookieSession = require("cookie-session");
const app = express();
exports.app = app;
const compression = require("compression");
const path = require("path");
const logger = require("morgan");
const { hash, compare } = require("./utils/bc");
const { serverUpload } = require("./utils/multer_upload");
const { s3Upload } = require("./utils/aws");
const db = require("./sql/db");

//middleware

app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cookieSession({
        secret:
            process.env.SESSION_SECRET ||
            require("../secrets.json").cookieSessionSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
        // from vulnerability encounter
        // secure: true,
        // httpsOnly: true,
    })
);
app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    next();
}); // middleware to prevent your site from being used in clickjacking
app.use(express.static(path.join(__dirname, "..", "client", "public")));
// Routes

app.get("/user/id.json", (req, res) => {
    if (req.session.userId > 0) {
        res.status("200");
        res.json({ isUserLoggedIn: true });
    } else {
        res.status("200");
        res.json({ isUserLoggedIn: false });
    }
});

app.post("/user/addProfile.json", function (req, res) {
    console.log("req.body :>> ", req.body);
    let { first, second, email, pass } = req.body;
    hash(pass)
        .then((hashedPass) => {
            db.addUser(first, second, email, hashedPass)
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

app.post("/user/login", (req, res) => {
    let { email, pass } = req.body;
    console.log(`login attempted by ${email}`);

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

app.get("/user/profile.json", (req, res) => {
    db.getUsers(req.session.userId)
        .then(({ rows: profile }) => {
            res.status("200");
            res.json(profile[0]);
        })
        .catch((err) => {
            console.log(`getProfile failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.get("/last_users.json", (req, res) => {
    db.getLatestUsers(3, req.query.pattern)
        .then(({ rows: users }) => {
            users.filter((user) => user.id != req.session.userId);
            res.status("200");
            res.json(users);
        })
        .catch((err) => {
            console.log(`getProfile failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.get("/user/profile_pic.json", (req, res) => {
    db.getProfilePics(req.session.userId)
        .then(({ rows: profilePics }) => {
            // console.log("rows :>> ", profilePics);
            res.status("200");
            res.json(profilePics[0]);
        })
        .catch((err) => {
            console.log(`getProfile failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.post(
    "/upload/profile_pic.json",
    serverUpload.single("file"),
    s3Upload,
    (req, res) => {
        console.log("/upload hit");
        db.addProfilePic(
            req.session.userId,
            `https://s3.amazonaws.com/spicedling/${req.file.filename}`
        )
            .then(({ rows }) => {
                res.status("200");
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log(`addPic failed with: ${err}`);
                return res.sendStatus(500);
            });
    }
);

app.post("/user/updateBio.json", function (req, res) {
    console.log("req.body :>> ", req.body.bio);
    db.updateBio(req.session.userId, req.body.bio)
        .then(() => {
            res.status("200");
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(`updateBio failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("SLP listening \nhttp://localhost:3000");
});
