// Import libraries
const cookieSession = require("cookie-session");
const compression = require("compression");
const path = require("path");
const logger = require("morgan");
// Import local modules
const donationRouter = require("./routers/donation");
const uploadRouter = require("./routers/upload");
const ngoRouter = require("./routers/ngo");
const authRouter = require("./routers/auth");
const { xFrameHeader } = require("./middleware/x_frame");
const cookieSessionConfig = require("./utils/cookie_session_configurator");
// Server set-up
const express = require("express");
const app = express();
const server = require("http").Server(app);

//middleware
const cookieSessionMiddleware = cookieSession(cookieSessionConfig);
const publicDir = path.join(__dirname, "..", "client", "public");
app.use([
    express.json(),
    express.urlencoded({ extended: false }),
    compression(),
    logger("dev"),
    cookieSessionMiddleware,
    xFrameHeader,
    express.static(publicDir),
]);

app.use([donationRouter, uploadRouter, ngoRouter, authRouter]);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("GTKOG listening \nhttp://localhost:3000");
});
