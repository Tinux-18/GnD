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

-- -- GET DATA

-- SELECT * FROM profile_pics
-- WHERE user_id = 20
-- ORDER BY id DESC

-- -- INSERT DATA

UPDATE users
SET first = 'Alin'
WHERE id = 1
RETURNING email

-- INSERT INTO user_profiles (age, city, url, user_id)
-- VALUES ($1, $2, $3, $4)
-- ON CONFLICT (user_id)
-- DO UPDATE
-- SET first = 'Alin'
-- WHERE id = 1
-- RETURNING email