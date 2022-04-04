-- INSERT INTO ngos (registration_complete, verified,representative_user_id, display_name, description, facebook, website, contact_email, instagram, tiktok) VALUES (
--     false, false, 3, 'dcb', 'lovely folks', 'q@p', null, null, null, null
-- )
-- ON CONFLICT (representative_user_id)
-- DO UPDATE 
-- SET display_name = 'code4',
--     description = 'code4',
--     facebook = 'code4',
--     website = 'code4',
--     contact_email = 'code4',
--     instagram = 'code4',
--     tiktok = 'code4'
-- ;

-- INSERT INTO users (role, first, last, email, password)
-- VALUES ('donor', 'Francoise', 'Bettencourt Meyers', 'gal@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam')
-- ;

-- INSERT INTO users (role, first, last, email, password)
-- VALUES ('donor', 'Zhong', 'Huijuan', 'huijuan@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'Alice', 'Walton', 'wal@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'MacKenzie', 'Scott', 'scott@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'Julia', 'Koch', 'koch@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'Yang', 'Huiyan', 'yang@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'Jacqueline', 'Mars', 'mars@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'Susanne', 'Klatten', 'klatten@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'Fan', 'Hongwei', 'fan@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'Iris', 'Fontbona', 'iris@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam'),
-- ('donor', 'Laurene', 'Powell Jobs', 'laurene@aol.com', '$2a$10$vQsxSXNsFvZpwDIywJ1gxu28InQofhf65C2jiKK.JqG7Lz.dkBqam')
-- ;


INSERT INTO donations (sender_id, ngo_id, amount, accepted)
VALUES  (7, 29, 306, 'false'),
        (9, 29, 288, 'true'),
        (10, 29, 219, 'true'),
        (11, 29, 270, 'true'),
        (12, 29, 200, 'true'),
        (13, 29, 21, 'true'),
        (14, 29, 119, 'true'),
        (15, 29, 317, 'false'),
        (16, 29, 276, 'true'),
        (17, 29, 372, 'false'),
        (18, 29, 353, 'false'),
        (7, 29, 128, 'true')
;
