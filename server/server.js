const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const logger = require("morgan");
const { hash, compare } = require("../utils/bc");
const { serverUpload } = require("../utils/multer_upload");
const { s3Upload } = require("../utils/aws");
// const db = require("./database/db");

//middleware

app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    next();
}); // middleware to prevent your site from being used in clickjacking

app.get("/user/id.json", function (req, res) {
    res.status("200");
    res.json({ userId: "cookie session shit" });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("SLP listening \nhttp://localhost:3000");
});
