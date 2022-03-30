// Import libraries
const cookieSession = require("cookie-session");
const compression = require("compression");
const path = require("path");
const logger = require("morgan");

// Import local modules

const userProfileRouter = require("./routers/user_profile");
const otherProfileRouter = require("./routers/other_profile");
const profilePicRouter = require("./routers/profile_pic");
const ngoRouter = require("./routers/ngo");
const authRouter = require("./routers/auth");
const { xFrameHeader } = require("./middleware/x_frame");
const cookieSessionConfig = require("./utils/cookieSession");
// Server set-up
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith(
                "http://localhost:3000" || process.env.PORT
            )
        ),
});

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

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

//Socket connections

// io.on("connection", async function (socket) {
//     const userId = socket.request.session.userId;

//     if (!userId) {
//         return socket.disconnect(true);
//     }

//     console.log(`socket with the id ${socket.id} is now connected`);

//     socket.on("disconnect", function () {
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//     });

//     const { rows: messages } = await db.getMessages(10);

//     socket.emit("latestMessages", messages);

//     socket.on("newMessage", async function (msg) {
//         let { rows: newMsg } = await db.addMessage(userId, msg);
//         let { rows: newMsgObj } = await db.getMessages(1, newMsg.id);
//         io.emit("newMessage", newMsgObj[0]);
//     });
// });

// Routes

app.use([
    userProfileRouter,
    otherProfileRouter,
    profilePicRouter,
    ngoRouter,
    authRouter,
]);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("SLP listening \nhttp://localhost:3000");
});
