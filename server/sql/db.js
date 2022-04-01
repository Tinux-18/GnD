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
        SELECT id, role, first, last, email, password, image FROM users
        WHERE id = $1`,
            [input]
        );
    } else if (typeof input === "string") {
        // input is text, expecting email
        return db.query(
            `
        SELECT id, role, first, last, email, password, image FROM users
        WHERE email = $1`,
            [input]
        );
    } else {
        // input is undefined, returning all users
        return db.query(`
        SELECT id, role, first, last, email, password, image FROM users`);
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

exports.getDonationsForNgo = (ngo_id, limit) =>
    db.query(
        `
        SELECT 
                donations.id,  
                amount, 
                accepted,
                donations.created_at, 
                sender_id,
                first, 
                last, 
                email 
        FROM donations
        LEFT OUTER JOIN users
        ON sender_id = users.id
        WHERE ngo_id = $1
        ORDER BY id DESC 
        LIMIT $2
        `,
        [ngo_id, limit]
    );

exports.getNgoProfileByUser = (user_id) =>
    db.query(
        `
        SELECT *
        FROM ngos
        WHERE representative_user_id = $1
        `,
        [user_id]
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

exports.addUser = (role, first, last, email, password) =>
    db.query(
        "INSERT INTO users (role, first, last, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [role, first, last, email, password]
    );

exports.addNgoProfileBasic = (
    registration_complete,
    verified,
    representative_user_id,
    display_name,
    website,
    contact_email,
    facebook,
    instagram,
    tiktok,
    description
) =>
    db.query(
        `INSERT INTO ngos (
            registration_complete, 
            verified,
            representative_user_id, 
            display_name, 
            description, 
            facebook,  
            instagram, 
            tiktok,
            website, 
            contact_email
            )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (representative_user_id)
        DO UPDATE 
        SET display_name = $4,
            description = $5,
            facebook = $6,
            instagram = $7,
            tiktok = $8,
            website = $9,
            contact_email = $10`,
        [
            registration_complete,
            verified,
            representative_user_id,
            display_name,
            description,
            facebook,
            instagram,
            tiktok,
            website,
            contact_email,
        ]
    );

exports.addDonation = (
    sender_id,
    ngo_id,
    amount,
    accepted,
    receiver_name,
    receiver_email,
    card_id,
    card_message
) =>
    db.query(
        `
        INSERT INTO donations (
            sender_id, 
            ngo_id, 
            amount, 
            accepted, 
            receiver_name, 
            receiver_email, 
            card_id, 
            card_message
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
            sender_id,
            ngo_id,
            amount,
            accepted,
            receiver_name,
            receiver_email,
            card_id,
            card_message,
        ]
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

exports.updateNgoProfileLegal = (
    representative_user_id,
    legal_name,
    registration_number,
    county,
    street,
    extra_address,
    founding_date,
    funds,
    bank,
    iban,
    bic
) =>
    db.query(
        `
        UPDATE ngos
        SET legal_name = $2,
            registration_number = $3,
            county = $4,
            street = $5,
            extra_address = $6,
            founding_date = $7,
            funds = $8,
            bank = $9,
            iban = $10,
            bic = $11
        WHERE representative_user_id = $1`,
        [
            representative_user_id,
            legal_name,
            registration_number,
            county,
            street,
            extra_address,
            founding_date,
            funds,
            bank,
            iban,
            bic,
        ]
    );

exports.updateNgoDocuments = (
    representative_user_id,
    statute,
    representative_id,
    logo
) =>
    db.query(
        `
        UPDATE ngos
        SET logo = $2,
            statute = $3,
            representative_id = $4
        WHERE representative_user_id = $1
        RETURNING statute, representative_id, logo`,
        [representative_user_id, logo, statute, representative_id]
    );

exports.updateRegistrationStatus = (
    representative_user_id,
    registration_complete
) =>
    db.query(
        `
        UPDATE ngos
        SET registration_complete = $2
        WHERE representative_user_id = $1`,
        [representative_user_id, registration_complete]
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

exports.acceptDonation = (id) =>
    db.query(
        `
        UPDATE donations
        SET accepted = true
        WHERE id = $1
        RETURNING accepted;`,
        [id]
    );

//Delete Rows

exports.removeDonationById = (id) =>
    db.query(
        `
        DELETE FROM donations
        WHERE id = $1`,
        [id]
    );

exports.removeDonationByNgoId = (id) =>
    db.query(
        `
        DELETE FROM donations
        WHERE ngo_id = $1`,
        [id]
    );

exports.removeDonationByUserId = (sender_id) =>
    db.query(
        `
        DELETE FROM donations
        WHERE sender_id = $1`,
        [sender_id]
    );

exports.removeNgo = (representative_user_id) =>
    db.query(
        `
        DELETE FROM ngos
        WHERE representative_user_id = $1`,
        [representative_user_id]
    );

exports.deleteDocument = (representative_user_id, documentType) => {
    if (documentType == "statute") {
        return db.query(
            `
        UPDATE ngos
        SET statute = null
        WHERE representative_user_id = $1`,
            [representative_user_id]
        );
    }

    if (documentType == "representativeId") {
        return db.query(
            `
        UPDATE ngos
        SET representative_id = null
        WHERE representative_user_id = $1`,
            [representative_user_id]
        );
    }

    if (documentType == "logo") {
        return db.query(
            `
        UPDATE ngos
        SET logo = null
        WHERE representative_user_id = $1`,
            [representative_user_id]
        );
    }
};
