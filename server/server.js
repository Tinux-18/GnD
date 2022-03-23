// Import libraries
const cookieSession = require("cookie-session");
const compression = require("compression");
const path = require("path");
const logger = require("morgan");
const redis = require("redis");

// Import local modules
const { hash, compare } = require("./utils/bc");
const { serverUpload } = require("./utils/multer_upload");
const { s3Upload, sendEmail } = require("./utils/aws");
const { generateRandomString } = require("./utils/generateRandomString");

const db = require("./sql/db");

// Server set-up
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith(
                "http://localhost:3000" || process.env.PORT
            )
        ),
});

// Redis set-up
const client = redis.createClient({
    host: "localhost",
    port: 6379,
});
async function connectClient() {
    await client.connect();
}

connectClient();

const redisKeyTimeout = 60 * 10; // in seconds

//middleware

app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cookie session
const cookieSessionMiddleware = cookieSession({
    secret:
        process.env.SESSION_SECRET ||
        require("../secrets.json").cookieSessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
    // from vulnerability encounter

    // secure: true,
    // httpsOnly: true,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    next();
}); // middleware to prevent your site from being used in clickjacking
app.use(express.static(path.join(__dirname, "..", "client", "public")));

//Socket connections

io.on("connection", async function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    console.log(`socket with the id ${socket.id} is now connected`);
    socket.on("disconnect", function () {
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    const userId = socket.request.session.userId;

    const { rows: messages } = await db.getMessages(10);

    socket.emit("latestMessages", messages);

    socket.on("newMessage", async function (msg) {
        let { rows: newMsg } = await db.addMessage(userId, msg);
        let { rows: newMsgObj } = await db.getMessages(1, newMsg.id);
        io.emit("newMessage", newMsgObj[0]);
    });
});

// Routes

//Get Data
app.get("/user/id.json", (req, res) => {
    if (req.session.userId > 0) {
        res.status("200");
        res.json({ isUserLoggedIn: true });
    } else {
        res.status("200");
        res.json({ isUserLoggedIn: false });
    }
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

app.get("/user/profile_pic.json", (req, res) => {
    db.getProfilePics(req.session.userId)
        .then(({ rows: profilePics }) => {
            res.status("200");
            res.json(profilePics[0]);
        })
        .catch((err) => {
            console.log(`getProfile failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.get("/last_users.json", (req, res) => {
    let limit = req.query.pattern ? undefined : 4;
    db.getLatestUsers(limit, req.query.pattern)
        .then(({ rows: users }) => {
            let latestUsers = users.filter(
                (user) => user.id != req.session.userId
            );
            if (latestUsers.length == 4) {
                latestUsers.pop();
            }
            res.status("200");
            res.json(latestUsers);
        })
        .catch((err) => {
            console.log(`getProfile failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.get("/other-user.json/:otherUserId", (req, res) => {
    let otherUserId = parseInt(req.params.otherUserId.replace(":", ""));

    if (req.session.userId == otherUserId) {
        res.status("200");
        res.json({ sameUser: true });
    } else if (otherUserId) {
        db.getUsers(otherUserId)
            .then(({ rows: profile }) => {
                if (profile.length == 0) {
                    return res.sendStatus(500);
                } else {
                    res.status("200");
                    res.json({
                        first: profile[0].first,
                        last: profile[0].last,
                        bio: profile[0].bio,
                        image: profile[0].image,
                    });
                }
            })
            .catch((err) => {
                console.log(`getProfile failed with: ${err}`);
                return res.sendStatus(500);
            });
    } else {
        return res.sendStatus(403);
    }
});

app.get(
    "/friend-request/status-with-other-user.json/:otherUserId",
    async (req, res) => {
        let otherUserId = parseInt(req.params.otherUserId.replace(":", ""));
        let currentUserId = req.session.userId;

        db.getFriendshipBetweenTwoUsers(currentUserId, otherUserId)
            .then(({ rows }) => {
                let buttonAction;

                if (rows.length == 0) {
                    buttonAction = "Make friend request";
                } else if (
                    rows[0].sender_id == currentUserId &&
                    rows[0].accepted == false
                ) {
                    buttonAction = "Cancel friend request";
                } else if (
                    rows[0].sender_id == otherUserId &&
                    rows[0].accepted == false
                ) {
                    buttonAction = "Accept friend request";
                } else if (rows[0].accepted == true) {
                    buttonAction = "Unfriend";
                } else {
                    console.log(
                        "No condition for friend request action was met"
                    );
                }

                res.status("200");
                res.json({ friendRequestStatus: buttonAction });
            })
            .catch((err) => {
                console.log(`getFriendshipBetweenTwoUsers failed with: ${err}`);
            });
    }
);

app.get("/friend-request/status-with-all-users.json", async (req, res) => {
    db.getAllFriendRequestsForUser(req.session.userId)
        .then(({ rows }) => {
            res.status("200");
            res.json({ rows });
        })
        .catch((err) => {
            console.log(`getFriendRequestsForUser failed with: ${err}`);
        });
});

// Update Cookies

app.post("/user/login", (req, res) => {
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

app.post("/user/reset-password", async (req, res) => {
    let { email } = req.body;
    let code = generateRandomString();
    console.log(`password reset attempted by ${email}`);
    if (!email) {
        return res.sendStatus(500);
    }

    try {
        let { rows: user } = await db.getUsers(email);
        console.log("user :>> ", user);
        if (user.length == 0) {
            return res.sendStatus(500);
        }
    } catch (err) {
        console.log(`getUsers failed with: ${err}`);
        return res.sendStatus(500);
    }

    try {
        await client.setEx(email, redisKeyTimeout, code);
    } catch (err) {
        console.log(`setting value in redis failed with: ${err}`);
        return res.sendStatus(500);
    }

    sendEmail(
        `tin_metal2000@yahoo.com`,
        `Please copy the code below into the required field:\n\n${code}`,
        "Social Leaders Platform password reset"
    );
    res.status("200");
    res.json({ success: true });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.status("200");
    res.json({ success: true });
});

// Update DB

app.post("/user/addProfile.json", function (req, res) {
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

app.post(
    "/upload/profile_pic.json",
    serverUpload.single("file"),
    s3Upload,
    (req, res) => {
        console.log("/upload hit");

        db.updateProfilePic(
            req.session.userId,
            `https://s3.amazonaws.com/constantin-portofolio/${req.file.filename}`
        )
            .then(({ rows }) => {
                res.status("200");
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log(`updateProfilePic failed with: ${err}`);
                return res.sendStatus(500);
            });

        db.addProfilePic(
            req.session.userId,
            `https://s3.amazonaws.com/constantin-portofolio/${req.file.filename}`
        )
            .then(() => {})
            .catch((err) => {
                console.log(`addPic failed with: ${err}`);
            });
    }
);

app.post("/user/updateBio.json", function (req, res) {
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

app.post("/friend-request/upsert-friendship.json", (req, res) => {
    let { requestType, otherUserId } = req.body;
    if (requestType == "Make friend request") {
        db.addFriendship(req.session.userId, otherUserId, "false")
            .then(() => {
                res.status("200");
                res.json({ friendRequestStatus: "Cancel friend request" });
            })
            .catch((err) => {
                console.log(`addFriendship failed with: ${err}`);
                return res.sendStatus(500);
            });
    } else if (requestType == "Accept friend request") {
        db.confirmFriendRequest(req.session.userId, otherUserId)
            .then(() => {
                res.status("200");
                res.json({ friendRequestStatus: "Unfriend" });
            })
            .catch((err) => {
                console.log(`confirmFriendRequest failed with: ${err}`);
                return res.sendStatus(500);
            });
    } else {
        return res.sendStatus(500);
    }
});

app.delete("/friend-request/cancel-friendship.json", (req, res) => {
    let { otherUserId } = req.body;
    db.cancelFriendRequest(req.session.userId, otherUserId)
        .then(() => {
            res.status("200");
            res.json({ friendRequestStatus: "Make friend request" });
        })
        .catch((err) => {
            console.log(`cancelFriendRequest failed with: ${err}`);
            return res.sendStatus(500);
        });
});

// Get index.html

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("SLP listening \nhttp://localhost:3000");
});
