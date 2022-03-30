INSERT INTO ngos (registration_complete, verified,representative_user_id, display_name, description, facebook, website, contact_email, instagram, tiktok) VALUES (
    false, false, 3, 'dcb', 'lovely folks', 'q@p', null, null, null, null
)
ON CONFLICT (representative_user_id)
DO UPDATE 
SET display_name = 'code4',
    description = 'code4',
    facebook = 'code4',
    website = 'code4',
    contact_email = 'code4',
    instagram = 'code4',
    tiktok = 'code4'
;

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

-- Not accepted requests by 201

-- INSERT INTO friendship_requests (sender_id, recipient_id,accepted)
-- VALUES  (211, 197, 'false'),
--         (211, 196, 'false'),
--         (211, 195, 'false')
-- ;

-- Not accepted requests to 201

-- INSERT INTO friendship_requests (sender_id, recipient_id,accepted)
-- VALUES  (188, 211, 'false'),
--         (187, 211, 'false'),
--         (186, 211, 'false'),
--         (185, 211, 'false'),
--         (184, 211, 'false'),
--         (183, 211, 'false')
        
-- ;

-- Accepted requests send by 201 (Alin)

-- INSERT INTO friendship_requests (sender_id, recipient_id,accepted)
-- VALUES  (211, 194, 'true'),
--         (211, 193, 'true'),
--         (211, 192, 'true')
-- ;

-- -- Accepted requests send to 201 (Alin)

-- INSERT INTO friendship_requests (sender_id, recipient_id,accepted)
-- VALUES  (191, 211, 'true'),
--         (190, 211, 'true'),
--         (189, 211, 'true')
-- ;

-- INSERT INTO chat_messages (user_id, message) VALUES 
-- ('211', 'You have got two empty halves of coconut and you are bangin them together.'),
-- ('210', 'So? We have ridden since the snows of winter covered this land, through the kingdom of Mercea, through--'),
-- ('211', 'Where did you get the coconut?'),
-- ('210', 'We found them.'),
-- ('211', 'Found them? In Mercea? The coconut is tropical!'),
-- ('210', 'What do you mean?'),
-- ('211', 'Well, this is a temperate zone.'),
-- ('210', 'The swallow may fly south with the sun or the house martin or the plumber may seek warmer climes in winter yet these are not strangers to our land.');