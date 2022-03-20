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

app.get("/friend-request/status.json/:otherUserId", async (req, res) => {
    let otherUserId = parseInt(req.params.otherUserId.replace(":", ""));
    let currentUserId = req.session.userId;
    db.getFriendRequests(currentUserId, otherUserId)
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
                console.log("No condition for friend request action was met");
            }

            res.status("200");
            res.json({ friendRequestStatus: buttonAction });
        })
        .catch((err) => {
            console.log(`getFriendRequests failed with: ${err}`);
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

app.listen(process.env.PORT || 3001, function () {
    console.log("SLP listening \nhttp://localhost:3000");
});
