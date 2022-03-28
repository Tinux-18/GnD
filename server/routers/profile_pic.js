const express = require("express");
const profilePicRouter = express.Router();
const db = require("../sql/db");
const { serverUpload } = require("../middleware/multer_upload");
const { s3Upload } = require("../middleware/aws");

profilePicRouter.get("/user/profile_pic.json", (req, res) => {
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

profilePicRouter.post(
    "/upload/profile_pic.json",
    serverUpload.single("file"),
    s3Upload,
    (req, res) => {
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

module.exports = profilePicRouter;
