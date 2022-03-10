const express = require("express");
const cookieSession = require("cookie-session");
const app = express();
const compression = require("compression");
const path = require("path");
const logger = require("morgan");
const { hash, compare } = require("./utils/bc");
const { serverUpload } = require("./utils/multer_upload");
const { s3Upload } = require("./utils/aws");
const db = require("./sql/db");

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

app.use(
    cookieSession({
        secret:
            process.env.SESSION_SECRET ||
            require("../secrets.json").cookieSessionSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
        // from vulnerability encounter
        secure: true,
        httpsOnly: true,
    })
);

// Routes

app.get("/user/id.json", (req, res) => {
    if (req.session.userId > 0) {
        res.status("200");
        res.json({ isUserLoggedIn: true });
    } else {
        res.status("200");
        res.json({ isUserLoggedIn: false });
    }
});

app.post("/user/addProfile.json", function (req, res) {
    console.log("req.body :>> ", req.body);
    let { first, second, email, pass } = req.body;
    hash(pass)
        .then((hashedPass) => {
            db.addUser(first, second, email, hashedPass)
                .then(({ rows }) => {
                    console.log(`user: ${email} has been added`);
                    req.session.userId = rows[0].id;
                    res.status("200");
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log(`addUser failed with: ${err}`);
                    return res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log(`hashing failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("SLP listening \nhttp://localhost:3000");
});
