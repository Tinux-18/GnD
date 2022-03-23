-- -- CREATE tables:


-- DROP TABLE IF EXISTS friendship_requests;
-- DROP TABLE IF EXISTS profile_pics;
-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--     id              SERIAL PRIMARY KEY,
--     first           VARCHAR(255) NOT NULL CHECK (first != ''),
--     last            VARCHAR(255) NOT NULL CHECK (last != ''),
--     bio             VARCHAR(255),
--     image           VARCHAR(255),
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
--     url         VARCHAR(255) NOT NULL,
--     created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS friendship_requests;
-- CREATE TABLE friendship_requests (
--     id              SERIAL PRIMARY KEY,
--     sender_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     recipient_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     accepted        BOOLEAN NOT NULL
-- );

DROP TABLE IF EXISTS chat_messages;
CREATE TABLE chat_messages (
    id               SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT     NOT NULL CHECK (message != ''),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- -- ALTER TABLE


-- ALTER TABLE friendship_requests 
-- RENAME COLUMN recepient_id TO recipient_id;

-- CREATE UNIQUE INDEX ON friendship_requests (least(sender_id, recipient_id), greatest(sender_id, recipient_id));



-- -- INSERT DATA


-- INSERT INTO profile_pics (user_id, url) VALUES (
--     10,
--     'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg'
-- );

-- INSERT INTO users (first, last, bio, email, password)
-- VALUES ('George', 'Alexe', 'iubesc pisicile', 'gal@dcb.de', 'oaisengaösoiengö')

-- INSERT INTO friendship_requests (sender_id, recepient_id, accepted) VALUES (
--     201,
--     196,
--     'FALSE')
-- ON CONFLICT (sender_id)
-- DO UPDATE 
-- SET accepted = 'TRUE'
-- ;

-- Not accepted requests by 201

-- INSERT INTO friendship_requests (sender_id, recepient_id,accepted)
-- VALUES  (201, 197, 'false'),
--         (201, 196, 'false'),
--         (201, 195, 'false')
-- ;

-- Not accepted requests to 201

-- INSERT INTO friendship_requests (sender_id, recipient_id,accepted)
-- VALUES  (188, 201, 'false'),
--         (187, 201, 'false'),
--         (186, 201, 'false'),
--         (185, 201, 'false'),
--         (184, 201, 'false'),
--         (183, 201, 'false')
        
-- ;

-- Accepted requests send by 201 (Alin)

-- INSERT INTO friendship_requests (sender_id, recipient_id,accepted)
-- VALUES  (201, 194, 'true'),
--         (201, 193, 'true'),
--         (201, 192, 'true')
-- ;

-- -- Accepted requests send to 201 (Alin)

-- INSERT INTO friendship_requests (sender_id, recipient_id,accepted)
-- VALUES  (191, 201, 'true'),
--         (190, 201, 'true'),
--         (189, 201, 'true')
-- ;

-- INSERT INTO chat_messages (user_id, message) VALUES 
-- ('201', 'Halt! Who goes there?'),
-- ('200', 'It is I, Arthur, son of Uther Pendragon, from the castle of Camelot. King of the Britons, defeator of the Saxons, sovereign of all England!'),
-- ('201', 'Pull the other one!'),
-- ('200', 'I am. And this my trusty servant Patsy. We have ridden the length and breadth of the land in search of knights who will join me in my court of Camelot. I must speak with your lord and master.'),
-- ('201', 'What, ridden on a horse?'),
-- ('200', 'Yes!'),
-- ('201', 'You are using coconuts!'),
-- ('200', 'What?'),
-- ('201', 'You have got two empty halves of coconut and you are bangin them together.'),
-- ('200', 'So? We have ridden since the snows of winter covered this land, through the kingdom of Mercea, through--'),
-- ('201', 'Where did you get the coconut?'),
-- ('200', 'We found them.'),
-- ('201', 'Found them? In Mercea? The coconut is tropical!'),
-- ('200', 'What do you mean?'),
-- ('201', 'Well, this is a temperate zone.'),
-- ('200', 'The swallow may fly south with the sun or the house martin or the plumber may seek warmer climes in winter yet these are not strangers to our land.');




-- -- GET DATA

-- SELECT * FROM profile_pics
-- WHERE user_id = 20
-- ORDER BY id DESC

-- SELECT * FROM users WHERE last = 'Radu';
-- SELECT id, first, last, email, bio, password, image FROM users;


-- CHECK WHETHER THERE ARE ANY OUTGOING REQUESTS - display cancel
-- SELECT * FROM friendship_requests
-- WHERE sender_id = 1
-- ORDER BY id DESC

-- CHECK WHETHER THERE ARE ANY INCOMING REQUESTS - display accept
-- SELECT * FROM friendship_requests
-- WHERE recepient_id = 2
-- ORDER BY id DESC

-- SELECT * FROM friendship_requests
-- WHERE (sender_id = 204 AND recepient_id = 205) or (sender_id = 205 AND recepient_id = 204);

-- SELECT chat_messages.id, message, chat_messages.created_at, user_id, first, last, image FROM chat_messages 
-- LEFT OUTER JOIN users
-- ON user_id = users.id
-- ORDER BY chat_messages.id DESC
-- LIMIT 3;



-- -- UPDATE DATA

-- UPDATE users
-- SET first = 'Alin'
-- WHERE id = 1
-- RETURNING email

-- -- DELETE DATA

-- DELETE FROM friendship_requests
-- WHERE (sender_id = 1 AND recepient_id = 2) or (recepient_id = 1 AND sender_id = 2);

-- DELETE FROM users
-- WHERE id= 205;