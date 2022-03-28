const express = require("express");
const friendRequestRouter = express.Router();
const db = require("../sql/db");

friendRequestRouter.get(
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

friendRequestRouter.get(
    "/friend-request/status-with-all-users.json",
    async (req, res) => {
        db.getAllFriendRequestsForUser(req.session.userId)
            .then(({ rows }) => {
                res.status("200");
                res.json({ rows });
            })
            .catch((err) => {
                console.log(`getFriendRequestsForUser failed with: ${err}`);
            });
    }
);

friendRequestRouter.post(
    "/friend-request/upsert-friendship.json",
    (req, res) => {
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
    }
);

friendRequestRouter.delete(
    "/friend-request/cancel-friendship.json",
    (req, res) => {
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
    }
);

module.exports = friendRequestRouter;
