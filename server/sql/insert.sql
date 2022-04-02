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

-- INSERT INTO users (first, last, bio, email, password)
-- VALUES ('George', 'Alexe', 'iubesc pisicile', 'gal@dcb.de', 'oaisengaösoiengö')

-- INSERT INTO friendship_requests (sender_id, recipient_id, accepted) VALUES (
--     201,
--     196,
--     'FALSE')
-- ON CONFLICT (sender_id)
-- DO UPDATE 
-- SET accepted = 'TRUE'
-- ;


INSERT INTO donations (user_id, ngo_id, amount, accepted)
VALUES  (2, 37, 5, 'true'),
        (2, 37, 10, 'true'),
        (2, 37, 20, 'true'),
        (2, 37, 30, 'true'),
        (2, 37, 10, 'true'),
        (2, 37, 100, 'true'),
        (2, 37, 110, 'false')
;
