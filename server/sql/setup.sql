-- -- CREATE tables:


-- DROP TABLE IF EXISTS donations;
-- DROP TABLE IF EXISTS ngos;
-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--     id              SERIAL PRIMARY KEY,
--     role            VARCHAR(255) NOT NULL,
--     first           VARCHAR(255) NOT NULL CHECK (first != ''),
--     last            VARCHAR(255) NOT NULL CHECK (last != ''),
--     image           VARCHAR(255),
--     email           VARCHAR(255) NOT NULL CHECK (email != '') UNIQUE,
--     password        VARCHAR(255) NOT NULL,
--     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS donations;
-- DROP TABLE IF EXISTS ngos;
-- CREATE TABLE ngos (
--     id                      SERIAL PRIMARY KEY,
--     representative_user_id  INTEGER NOT NULL UNIQUE REFERENCES users(id),
--     display_name            VARCHAR(255),
--     description             VARCHAR,
--     website                 VARCHAR(255),
--     contact_email           VARCHAR(255),
--     instagram               VARCHAR(255),
--     facebook                VARCHAR(255),
--     tiktok                  VARCHAR(255),
--     legal_name              VARCHAR(255),
--     registration_number     VARCHAR(255) UNIQUE,
--     county                  VARCHAR(255),
--     street                  VARCHAR(255),
--     house_number            VARCHAR(255),
--     extra_address           VARCHAR(255),
--     founding_date           DATE,
--     funds                   INTEGER,
--     logo                    VARCHAR(255),
--     statute                 VARCHAR(255),
--     representative_id       VARCHAR(255),
--     bank                    VARCHAR(255),
--     iban                    VARCHAR(255),
--     bic                     VARCHAR(255),
--     registration_complete   BOOLEAN NOT NULL,
--     verified                BOOLEAN NOT NULL,
--     created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS donations;
-- CREATE TABLE donations (
--     id              SERIAL PRIMARY KEY,
--     sender_id       INTEGER NOT NULL REFERENCES users(id),
--     ngo_id          INTEGER NOT NULL REFERENCES ngos(id),
--     amount          INTEGER,
--     accepted        BOOLEAN NOT NULL,
--     receiver_name   VARCHAR(255),
--     receiver_email  VARCHAR(255),
--     card_message    VARCHAR,
--     card_id         VARCHAR(255),
--     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- ALTER TABLE


-- ALTER TABLE friendship_requests 
-- RENAME COLUMN recepient_id TO recipient_id;

-- CREATE UNIQUE INDEX ON friendship_requests (least(sender_id, recipient_id), greatest(sender_id, recipient_id));