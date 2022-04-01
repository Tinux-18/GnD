const cookieSessionSecret = require("../../secrets.json").cookieSessionSecret;
const cookieSession = {
    secret: process.env.SESSION_SECRET || cookieSessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
    // from vulnerability encounter

    // secure: true,
    // httpsOnly: true,
};

module.exports = cookieSession;
