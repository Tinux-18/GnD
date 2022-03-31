const express = require("express");
const uploadRouter = express.Router();
const db = require("../sql/db");
const { serverUpload } = require("../middleware/multer_upload");
const { s3Upload } = require("../middleware/aws");

uploadRouter.get("/user/profile_pic.json", (req, res) => {
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

uploadRouter.post(
    "/upload/profile_pic.json",
    serverUpload.single("file"),
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

uploadRouter.post(
    "/upload/documents.json",
    serverUpload.fields([
        { name: "statute", maxCount: 1 },
        { name: "representativeId", maxCount: 1 },
        { name: "logo", maxCount: 1 },
    ]),
    s3Upload,
    (req, res) => {
        let fileUrls = { statute: null, representativeId: null, logo: null };
        for (const file in req.files) {
            if (file && Object.hasOwnProperty.call(req.files, file)) {
                const { fieldname, filename } = req.files[file][0];
                fileUrls[
                    fieldname
                ] = `https://s3.amazonaws.com/constantin-portofolio/${filename}`;
            }
        }

        db.updateNgoDocuments(
            req.session.userId,
            fileUrls.statute,
            fileUrls.representativeId,
            fileUrls.logo
        )
            .then(() => {
                res.status("200");
                res.json({ success: true });
            })
            .catch((err) => {
                console.log(`/upload/documents.json failed with: ${err}`);
                return res.sendStatus(500);
            });
    }
);

module.exports = uploadRouter;
