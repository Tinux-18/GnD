const express = require("express");
const uploadRouter = express.Router();
const db = require("../sql/db");
const { serverUpload } = require("../middleware/multer_upload");
const { s3Upload } = require("../middleware/aws");

uploadRouter.post(
    "/upload/documents.json",
    serverUpload.fields([
        { name: "statute", maxCount: 1 },
        { name: "representativeId", maxCount: 1 },
        { name: "logo", maxCount: 1 },
    ]),
    s3Upload,
    async (req, res) => {
        const data = await db.getNgoProfileByUser(req.session.userId);
        let fileUrls = {
            statute: data.rows[0].statute,
            representativeId: data.rows[0].representative_id,
            logo: data.rows[0].logo,
        };
        for (const file in req.files) {
            if (file && Object.hasOwnProperty.call(req.files, file)) {
                const { fieldname, filename } = req.files[file][0];
                fileUrls[
                    fieldname
                ] = `https://s3.amazonaws.com/constantin-portofolio/${filename}`;
            }
        }

        let documentsUrl = await db
            .updateNgoDocuments(
                req.session.userId,
                fileUrls.statute,
                fileUrls.representativeId,
                fileUrls.logo
            )
            .catch((err) => {
                console.log(`updateNgoDocuments failed with: ${err}`);
                return res.sendStatus(500);
            });

        await db
            .updateRegistrationStatus(
                req.session.userId,
                !Object.values(documentsUrl.rows[0]).includes(null)
            )
            .catch((err) => {
                console.log(`updateRegistrationStatus failed with: ${err}`);
                return res.sendStatus(500);
            });

        res.status("200");
        res.json({ success: true });
    }
);

uploadRouter.post("/upload/rempove-document.json", async (req, res) => {
    await db
        .deleteDocument(req.session.userId, req.body.documentType)
        .catch((err) => {
            console.log(`deleteDocument failed with: ${err}`);
            return res.sendStatus(500);
        });

    await db
        .updateRegistrationStatus(req.session.userId, false)
        .catch((err) => {
            console.log(`updateRegistrationStatus failed with: ${err}`);
            return res.sendStatus(500);
        });
    res.status("200");
    res.json({ success: true });
});

module.exports = uploadRouter;
