-- -- CREATE tables:

-- DROP TABLE IF EXISTS users;

-- CREATE TABLE users (
--     id              SERIAL PRIMARY KEY,
--     first           VARCHAR(255) NOT NULL CHECK (first != ''),
--     last            VARCHAR(255) NOT NULL CHECK (last != ''),
--     bio             VARCHAR,
--     email           VARCHAR(255) NOT NULL CHECK (email != '') UNIQUE,
--     password        VARCHAR(255) NOT NULL,
--     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS organisations;
-- CREATE TABLE organisations (
--     id                  SERIAL PRIMARY KEY,
--     organisation        VARCHAR(255),
--     registration_number VARCHAR(255) NOT NULL UNIQUE,
--     county              VARCHAR(255) NOT NULL,
--     street              VARCHAR(255),
--     house_number        VARCHAR(255) NOT NULL,
--     created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS profile_pics;
-- CREATE TABLE profile_pics (
--     id          SERIAL PRIMARY KEY,
--     user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     url         VARCHAR(255) NOT NULL
--     created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS friendship_requests;
-- CREATE TABLE friendship_requests (
--     id              SERIAL PRIMARY KEY,
--     sender_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     recepient_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     accepted        BOOLEAN NOT NULL
-- );

-- -- INSERT DATA

-- INSERT INTO profile_pics (user_id, url) VALUES (
--     10,
--     'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg'
-- );

-- INSERT INTO users (first, last, bio, email, password)
-- VALUES ('George', 'Alexe', 'iubesc pisicile', 'gal@dcb.de', 'oaisengaösoiengö')

-- INSERT INTO friendship_requests (sender_id, recepient_id,accepted) VALUES (
--     3,
--     4,
--     'false'
-- );
-- INSERT INTO friendship_requests (sender_id, recepient_id,accepted) VALUES (
--     4,
--     3,
--     'false'
-- );

-- -- GET DATA

-- SELECT * FROM profile_pics
-- WHERE user_id = 20
-- ORDER BY id DESC

-- SELECT first, last, bio, email FROM users WHERE id = 20444;
SELECT first, last, bio, email FROM users;


-- CHECK WHETHER THERE ARE ANY OUTGOING REQUESTS - display cancel
-- SELECT * FROM friendship_requests
-- WHERE sender_id = 1
-- ORDER BY id DESC

-- CHECK WHETHER THERE ARE ANY INCOMING REQUESTS - display accept
-- SELECT * FROM friendship_requests
-- WHERE recepient_id = 2
-- ORDER BY id DESC

-- -- UPDATE DATA

-- UPDATE users
-- SET first = 'Alin'
-- WHERE id = 1
-- RETURNING email

-- -- DELETE DATA

-- DELETE FROM friendship_requests
-- WHERE (sender_id = 1 AND recepient_id = 2) or (recepient_id = 1 AND sender_id = 2);