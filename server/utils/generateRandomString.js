const cryptoRandomString = require("crypto-random-string");

exports.generateRandomString = () => {
    return cryptoRandomString({
        length: 6,
    });
};
