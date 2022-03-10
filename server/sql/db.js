const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${
            require("/home/spiced/constantin/rue-socialnetwork/secrets.json")
                .psqlUser
        }:${
            require("/home/spiced/constantin/rue-socialnetwork/secrets.json")
                .psqlPassword
        }@localhost:5432/slp`
);

// exports.getSignatures = (userId) => {
//     if (userId) {
//         return db.query("SELECT * FROM signatures WHERE user_id = ($1)", [
//             userId,
//         ]);
//     } else {
//         return db.query("SELECT * FROM signatures");
//     }
// };

exports.getUsers = (id) => {
    if (id) {
        return db.query("SELECT * FROM users WHERE id = $1", [id]);
    } else {
        return db.query("SELECT * FROM users");
    }
};

// exports.getSigners = (city) => {
//     if (city) {
//         return db.query(
//             `
//                 SELECT users.id, first, last, age, city, url FROM users
//                 JOIN signatures
//                 ON users.id = signatures.user_id
//                 LEFT OUTER JOIN user_profiles
//                 ON users.id = user_profiles.user_id
//                 WHERE city = $1`,
//             [city]
//         );
//     } else {
//         return db.query(`
//                 SELECT users.id, first, last, age, city, url FROM users
//                 JOIN signatures
//                 ON users.id = signatures.user_id
//                 LEFT OUTER JOIN user_profiles
//                 ON users.id = user_profiles.user_id`);
//     }
// };

// exports.getCities = (city) => {
//     if (city) {
//         return db.query("SELECT city FROM cities WHERE city = $1", [city]);
//     } else {
//         return db.query("SELECT city FROM cities ORDER BY city");
//     }
// };

// exports.getDetails = (id) => {
//     if (id) {
//         return db.query(
//             `
//                 SELECT users.id, first, last, email, age, city, url, signature FROM users
//                 LEFT OUTER JOIN signatures
//                 ON users.id = signatures.user_id
//                 LEFT OUTER JOIN user_profiles
//                 ON users.id = user_profiles.user_id
//                 WHERE users.id = $1`,
//             [id]
//         );
//     } else {
//         return db.query(`
//                 SELECT users.id, first, last, email, age, city, url, signature FROM users
//                 LEFT OUTER JOIN signatures
//                 ON users.id = signatures.user_id
//                 LEFT OUTER JOIN user_profiles
//                 ON users.id = user_profiles.user_id`);
//     }
// };

exports.addUser = (first, last, email, password) =>
    db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );

// exports.addSignature = (user_id, signature) =>
//     db.query(
//         "INSERT INTO signatures (user_id, signature) VALUES ($1, $2) RETURNING id",
//         [user_id, signature]
//     );

// exports.addDetails = (age, city, url, user_id) =>
//     db.query(
//         "INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id",
//         [age, city, url, user_id]
//     );

// exports.insertCity = (city) =>
//     db.query("INSERT INTO cities (city) VALUES ($1)", [city]);

// exports.updateUser = (id, first, last, email, password) => {
//     if (password) {
//         return db.query(
//             `
//             UPDATE users
//             SET first = $1,
//                 last = $2,
//                 email = $3,
//                 password = $4
//             WHERE id = $5`,
//             [first, last, email, password, id]
//         );
//     } else {
//         return db.query(
//             `
//             UPDATE users
//             SET first = $1,
//                 last = $2,
//                 email = $3
//             WHERE id = $4`,
//             [first, last, email, id]
//         );
//     }
// };

// exports.updateDetails = (age, city, url, user_id) =>
//     db.query(
//         `
//         INSERT INTO user_profiles (age, city, url, user_id)
//         VALUES ($1, $2, $3, $4)
//         ON CONFLICT (user_id)
//         DO UPDATE
//         SET age = $1,
//             city = $2,
//             url = $3`,
//         [age, city, url, user_id]
//     );

// exports.removeDuplicateCities = () =>
//     db.query(`
//             DELETE FROM cities
//             WHERE id IN(SELECT id FROM(SELECT  id,ROW_NUMBER() OVER(PARTITION BY city ORDER BY id)
//             AS row_num FROM cities) t WHERE t.row_num > 1);`);

// exports.removeSignature = (user_id) =>
//     db.query(
//         `
//         DELETE FROM signatures
//         WHERE user_id = $1`,
//         [user_id]
//     );

// exports.removeUser = (id) =>
//     db.query(
//         `
//         DELETE FROM users
//         WHERE id = $1
//         RETURNING email`,
//         [id]
//     );

// exports.getPics = (picId, offsetId) => {
//     if (picId) {
//         return db.query(`SELECT * FROM images WHERE id = ($1)`, [picId]);
//     } else if (offsetId) {
//         return db.query(
//             `SELECT id, url, username, title, description, created_at,
//             (SELECT id FROM images
//             ORDER BY id ASC
//             LIMIT 1) AS "lowestId"
//             FROM images
//             WHERE id < ($1)
//             ORDER BY id DESC
//             LIMIT 6`,
//             [offsetId]
//         );
//     } else {
//         return db.query(
//             `SELECT id, url, username, title, description, created_at,
//             (SELECT id FROM images
//             ORDER BY id ASC
//             LIMIT 1) AS "lowestId"
//             FROM images ORDER BY id DESC LIMIT 6`
//         );
//     }
// };

// exports.addPic = (url, username, title, description) =>
//     db.query(
//         "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
//         [url, username, title, description]
//     );

// exports.removePic = (picId) =>
//     db.query(
//         `
//         DELETE FROM images
//         WHERE id = $1`,
//         [picId]
//     );

// exports.getComments = (picId, limit) => {
//     if (limit) {
//         return db.query(
//             `
//         SELECT * FROM comments
//         WHERE pic_id = $1
//         ORDER BY id DESC
//         LIMIT $2`,
//             [picId, limit]
//         );
//     } else {
//         return db.query(
//             `
//         SELECT * FROM comments
//         WHERE pic_id = $1
//         ORDER BY id DESC`,
//             [picId]
//         );
//     }
// };

// exports.addComment = (commenter, comment, picId) =>
//     db.query(
//         "INSERT INTO comments (commenter, comment, pic_id) VALUES ($1, $2, $3) RETURNING *",
//         [commenter, comment, picId]
//     );

// exports.removeComment = (commentId) =>
//     db.query(
//         `
//         DELETE FROM comments
//         WHERE id = $1
//         RETURNING *`,
//         [commentId]
//     );
