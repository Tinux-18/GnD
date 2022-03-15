const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${require("../../secrets.json").psqlUser}:${
            require("../../secrets.json").psqlPassword
        }@localhost:5432/slp`
);

exports.getUsers = (input) => {
    if (!isNaN(input)) {
        return db.query("SELECT * FROM users WHERE id = $1", [input]);
    } else if (typeof input === "string") {
        return db.query("SELECT * FROM users WHERE email = $1", [input]);
    } else {
        return db.query("SELECT * FROM users");
    }
};

exports.addUser = (first, last, email, password) =>
    db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );

exports.addProfilePic = (user_id, url) =>
    db.query(
        "INSERT INTO profile_pics (user_id, url) VALUES ($1, $2) RETURNING *",
        [user_id, url]
    );

exports.getProfilePics = (userId) => {
    if (userId) {
        return db.query(
            "SELECT * FROM profile_pics WHERE user_id = ($1) ORDER BY id DESC",
            [userId]
        );
    } else {
        return db.query("SELECT * FROM profile_pics");
    }
};

exports.updateBio = (user_id, bio) =>
    db.query(
        `
        UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING email`,
        [bio, user_id]
    );