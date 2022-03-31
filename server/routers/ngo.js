const express = require("express");
const ngoRouter = express.Router();
const db = require("../sql/db");

ngoRouter.get("/ngo/profile.json", async (req, res) => {
    db.getNgoProfileByUser(req.session.userId)
        .then(({ rows }) => {
            res.status("200");
            res.json({ rows });
        })
        .catch((err) => {
            console.log(`getFriendRequestsForUser failed with: ${err}`);
        });
});

ngoRouter.post("/ngo/store-registration-part.json", async (req, res) => {
    const { registrationPart } = req.body;
    req.session.registrationPart = registrationPart;
    res.status("200");
    res.json({ success: true });
});

ngoRouter.get("/ngo/registration-part.json", async (req, res) => {
    res.status("200");
    res.json({ registrationPart: req.session.registrationPart });
});

ngoRouter.post("/ngo/upsert-profile.json", (req, res) => {
    db.addNgoProfileBasic(
        false,
        false,
        req.session.userId,
        ...Object.values(req.body)
    )
        .then(() => {
            res.status("200");
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(`/ngo/upsert-profile.json failed with: ${err}`);
            return res.sendStatus(500);
        });
});

ngoRouter.post("/ngo/update-legal-profile.json", (req, res) => {
    db.updateNgoProfileLegal(req.session.userId, ...Object.values(req.body))
        .then(() => {
            res.status("200");
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(`/ngo/update-legal-profile.json failed with: ${err}`);
            return res.sendStatus(500);
        });
});

ngoRouter.delete("/ngo/delete-profile.json", (req, res) => {
    db.removeNgo(req.session.userId)
        .then(() => {
            res.status("200");
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(`delete ngo failed with: ${err}`);
            return res.sendStatus(500);
        });
});

module.exports = ngoRouter;
