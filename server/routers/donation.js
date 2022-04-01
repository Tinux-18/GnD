const express = require("express");
const donationRouter = express.Router();
const db = require("../sql/db");
const { prepareTableInput } = require("../utils/table_input_formatter");

donationRouter.get("/donation/current-donations.json", (req, res) => {
    db.getDonationsForNgo(req.query.ngo_id, req.query.limit)
        .then(({ rows }) => {
            res.status("200");
            prepareTableInput(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log(`getDonationsForNgo failed with: ${err}`);
            return res.sendStatus(500);
        });
});

donationRouter.post("/donation/update-donation-status.json", (req, res) => {
    const { id } = req.body;

    db.acceptDonation(id)
        .then(() => {
            res.status("200");
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(`acceptDonation failed with: ${err}`);
            return res.sendStatus(500);
        });
});

module.exports = donationRouter;
