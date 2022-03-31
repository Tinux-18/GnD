const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { format } = require("date-fns");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "..", "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(
                null,
                format(new Date(), "yyyyMMddHHmmss") +
                    "_" +
                    file.fieldname.toUpperCase() +
                    "_" +
                    uid +
                    path.extname(file.originalname)
            );
        });
    },
});

exports.serverUpload = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
