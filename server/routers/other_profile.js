const express = require("express");
const otherProfileRouter = express.Router();
const db = require("../sql/db");

otherProfileRouter.get("/last_users.json", (req, res) => {
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

otherProfileRouter.get("/other-user.json/:otherUserId", (req, res) => {
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

module.exports = otherProfileRouter;
