-- DROP TABLE IF EXISTS users;

-- -- new users table:

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    first           VARCHAR(255) NOT NULL CHECK (first != ''),
    last            VARCHAR(255) NOT NULL CHECK (last != ''),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE organisations (
--     id                  SERIAL PRIMARY KEY,
--     organisation        VARCHAR(255),
--     registration_number VARCHAR(255) NOT NULL UNIQUE,
--     county              VARCHAR(255) NOT NULL,
--     street              VARCHAR(255),
--     house_number        VARCHAR(255) NOT NULL,
--     created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
--     'funkychicken',
--     'Welcome to Spiced and the Future!',
--     'This photo brings back so many great memories.'
-- );

-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
--     'discoduck',
--     'Elvis',
--     'We can''t go on together with suspicious minds.'
-- );

-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
--     'discoduck',
--     'To be or not to be',
--     'That is the question.'
-- );

-- SELECT * FROM images ORDER BY id DESC;

-- SELECT id, url, username, title, description, created_at, (
--   SELECT id FROM images
--   ORDER BY id ASC
--   LIMIT 1
-- ) AS "lowestId" FROM images 
-- ORDER BY id DESC
-- LIMIT 6;

-- SELECT url, title, id, (
--   SELECT id FROM images
--   ORDER BY id ASC
--   LIMIT 1
-- ) AS "lowestId" FROM images
-- WHERE id < 27
-- ORDER BY id DESC
-- LIMIT 6;

-- SELECT * FROM images
-- WHERE id < 27
-- ORDER BY id DESC
-- LIMIT 6;

----------------------------------------------------------------------------------------------


-- DROP TABLE IF EXISTS comments;
-- CREATE TABLE comments (
--     id          SERIAL PRIMARY KEY,
--     commenter   TEXT NOT NULL CHECK (commenter != ''),
--     comment TEXT NOT NULL CHECK (comment != ''),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     pic_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE
-- );

-- INSERT INTO comments (commenter, comment, pic_id) VALUES (
--     'disccocock',
--     'This is a great picture',
--     1
-- )
-- RETURNS TABLE (LIKE comments);

-- DELETE FROM images
-- WHERE id = 10

-- SELECT * FROM comments 
-- WHERE pic_id = 1
-- ORDER BY id DESC
-- LIMIT 1