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
