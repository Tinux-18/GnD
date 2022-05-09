const express = require("express");
const ngoRouter = express.Router();
const db = require("../sql/db");

ngoRouter.get("/ngo/all-names.json", async (req, res) => {
    db.getNgos()
        .then(({ rows }) => {
            res.status("200");
            res.json(rows);
        })
        .catch((err) => {
            console.log(`getNgos failed with: ${err}`);
        });
});

ngoRouter.get("/ngo/profile.json", async (req, res) => {
    db.getNgoProfileByUser(req.session.userId)
        .then(({ rows }) => {
            res.status("200");
            res.json({ ...rows[0] });
        })
        .catch((err) => {
            console.log(`getFriendRequestsForUser failed with: ${err}`);
        });
});

ngoRouter.post("/ngo/upsert-profile.json", (req, res) => {
    for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
            if (req.body[key] === "") {
                req.body[key] = null;
            }
        }
    }
    let dbQueryInput = {
        display_name: null,
        website: null,
        contact_email: null,
        facebook: null,
        instagram: null,
        tiktok: null,
        description: null,
        ...req.body,
    };

    db.addNgoProfileBasic(
        false,
        false,
        req.session.userId,
        ...Object.values(dbQueryInput)
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
    for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
            if (req.body[key] === "") {
                req.body[key] = null;
            }
        }
    }

    let dbQueryInput = {
        legal_name: null,
        registration_number: null,
        county: null,
        street: null,
        extra_address: null,
        founding_date: null,
        funds: null,
        bank: null,
        iban: null,
        bic: null,
        ...req.body,
    };

    db.updateNgoProfileLegal(req.session.userId, ...Object.values(dbQueryInput))
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

ngoRouter.post("/ngo/store-registration-part.json", async (req, res) => {
    const { registrationPart } = req.body;
    req.session.registrationPart = registrationPart;
    res.status("200");
    res.json({ success: true });
});

ngoRouter.get("/ngo/registration-part.json", async (req, res) => {
    if (req.session.registrationPart) {
        res.status("200");
        res.json({ registrationPart: req.session.registrationPart });
    } else {
        res.status("200");
        res.json({ registrationPart: 1 });
    }
});

module.exports = ngoRouter;
