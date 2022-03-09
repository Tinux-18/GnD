const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "/home/tinux/projects/rue-imageboard/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(uid => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

exports.serverUpload = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
