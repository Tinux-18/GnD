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
-- );

-- -- INSERT DATA

-- INSERT INTO profile_pics (user_id, url) VALUES (
--     10,
--     'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg'
    
-- );

-- INSERT INTO users (first, last, bio, email, password)
-- VALUES ('George', 'Alexe', 'iubesc pisicile', 'gal@dcb.de', 'oaisengaösoiengö')

-- -- GET DATA

-- SELECT * FROM profile_pics
-- WHERE user_id = 20
-- ORDER BY id DESC

-- -- UPDATE DATA

-- UPDATE users
-- SET first = 'Alin'
-- WHERE id = 1
-- RETURNING email

SELECT first, last, bio, email FROM users LIMIT 3