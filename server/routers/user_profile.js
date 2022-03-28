const express = require("express");
const userProfileRouter = express.Router();
const db = require("../sql/db");
const { hash } = require("../utils/bc");

userProfileRouter.get("/user/profile.json", (req, res) => {
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

userProfileRouter.post("/user/addProfile.json", function (req, res) {
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

userProfileRouter.post("/user/updateBio.json", function (req, res) {
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

module.exports = userProfileRouter;
