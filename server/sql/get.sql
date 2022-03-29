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
-- WHERE id > 198;