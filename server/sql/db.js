const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${require("../../secrets.json").psqlUser}:${
            require("../../secrets.json").psqlPassword
        }@localhost:5432/dar`
);

//Get Rows

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

exports.getFriendshipBetweenTwoUsers = (sender_id, recipient_id) =>
    db.query(
        `
        SELECT * FROM friendship_requests
        WHERE (sender_id = $1 AND recipient_id = $2) or (sender_id = $2 AND recipient_id = $1)`,
        [sender_id, recipient_id]
    );

exports.getFriendRequestsForUser = (sender_id) =>
    db.query(
        `
        SELECT users.id, first, last, image, accepted
        FROM friendship_requests
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
        `,
        [sender_id]
    );

exports.getAllFriendRequestsForUser = (sender_id) =>
    db.query(
        `
        SELECT users.id, sender_id, recipient_id, first, last, image, accepted
        FROM friendship_requests
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
        OR (accepted = false AND sender_id = $1 AND recipient_id = users.id)
        `,
        [sender_id]
    );

exports.getMessages = (limit, id) => {
    if (id) {
        return db.query(
            `
        SELECT chat_messages.id, message, chat_messages.created_at, user_id, first, last, image FROM chat_messages 
        LEFT OUTER JOIN users
        ON user_id = users.id
        WHERE chat_messages.id = $2
        ORDER BY chat_messages.id DESC
        LIMIT $1`,
            [limit, id]
        );
    } else {
        return db.query(
            `
        SELECT chat_messages.id, message, chat_messages.created_at, user_id, first, last, image FROM chat_messages 
        LEFT OUTER JOIN users
        ON user_id = users.id
        ORDER BY chat_messages.id DESC
        LIMIT $1`,
            [limit]
        );
    }
};

//Insert Rows

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

exports.addFriendship = (sender_id, recipient_id, acceptance_status) =>
    db.query(
        `
        INSERT INTO friendship_requests (sender_id, recipient_id, accepted)
        VALUES ($1, $2, $3)
        RETURNING accepted`,
        [sender_id, recipient_id, acceptance_status]
    );

exports.addMessage = (user_id, message) =>
    db.query(
        "INSERT INTO chat_messages (user_id, message) VALUES ($1, $2) RETURNING *",
        [user_id, message]
    );

//Update Rows

exports.updateProfilePic = (user_id, url) =>
    db.query(
        `
        UPDATE users
        SET image = $1
        WHERE id = $2
        RETURNING image`,
        [url, user_id]
    );

exports.updateBio = (user_id, bio) =>
    db.query(
        `
        UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING email`,
        [bio, user_id]
    );

exports.updatePassword = (user_id, password) =>
    db.query(
        `
        UPDATE users
        SET password = $1
        WHERE id = $2
        RETURNING email`,
        [password, user_id]
    );

exports.confirmFriendRequest = (sender_id, recipient_id) =>
    db.query(
        `
        UPDATE friendship_requests
        SET accepted = true
        WHERE (sender_id = $1 AND recipient_id = $2) or (recipient_id = $1 AND sender_id = $2)
        RETURNING accepted;`,
        [sender_id, recipient_id]
    );

//Delete Rows

exports.cancelFriendRequest = (sender_id, recipient_id) =>
    db.query(
        `
        DELETE FROM friendship_requests
        WHERE (sender_id = $1 AND recipient_id = $2) or (recipient_id = $1 AND sender_id = $2)`,
        [sender_id, recipient_id]
    );
