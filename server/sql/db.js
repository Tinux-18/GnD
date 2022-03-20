const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${require("../../secrets.json").psqlUser}:${
            require("../../secrets.json").psqlPassword
        }@localhost:5432/slp`
);

exports.getUsers = (input) => {
    if (!isNaN(input)) {
        // input is a number, expecting ID
        return db.query(
            `
        SELECT id, first, last, email, bio, password, image FROM users
        WHERE id = $1`,
            [input]
        );
    } else if (typeof input === "string") {
        // input is text, expecting email
        return db.query(
            `
        SELECT id, first, last, email, bio, password, image FROM users
        WHERE email = $1`,
            [input]
        );
    } else {
        // input is undefined, returning all users
        return db.query(`
        SELECT id, first, last, email, bio, password, image FROM users`);
    }
};

exports.getLatestUsers = (limit, pattern) => {
    if (pattern) {
        return db.query(
            `
    SELECT id, first, last, bio, image FROM users
    WHERE (first ILIKE $2 or last ILIKE $2) 
    ORDER BY id DESC 
    LIMIT $1`,
            [limit, pattern + "%"]
        );
    } else {
        return db.query(
            `
    SELECT id, first, last, bio, image FROM users
    ORDER BY id DESC 
    LIMIT $1`,
            [limit]
        );
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

exports.updateProfilePic = (user_id, url) =>
    db.query(
        `
        UPDATE users
        SET image = $1
        WHERE id = $2
        RETURNING image`,
        [url, user_id]
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

exports.addFriendship = (sender_id, recepient_id, acceptance_status) =>
    db.query(
        `
        INSERT INTO friendship_requests (sender_id, recepient_id, accepted)
        VALUES ($1, $2, $3)
        RETURNING accepted`,
        [sender_id, recepient_id, acceptance_status]
    );

exports.confirmFriendRequest = (sender_id, recepient_id) =>
    db.query(
        `
        UPDATE friendship_requests
        SET accepted = true
        WHERE (sender_id = $1 AND recepient_id = $2) or (recepient_id = $1 AND sender_id = $2)
        RETURNING accepted;`,
        [sender_id, recepient_id]
    );

exports.getFriendRequests = (sender_id, recepient_id) =>
    db.query(
        `
        SELECT * FROM friendship_requests
        WHERE (sender_id = $1 AND recepient_id = $2) or (sender_id = $2 AND recepient_id = $1)`,
        [sender_id, recepient_id]
    );

exports.cancelFriendRequest = (sender_id, recepient_id) =>
    db.query(
        `
        DELETE FROM friendship_requests
        WHERE (sender_id = $1 AND recepient_id = $2) or (recepient_id = $1 AND sender_id = $2)`,
        [sender_id, recepient_id]
    );
