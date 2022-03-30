-- -- UPDATE DATA

UPDATE ngos
SET legal_name = 'code4',
    registration_number = 'code4',
    county = 'code4',
    street = 'code4',
    extra_address = 'code4',
    founding_date = '02/20/1995',
    funds = 40000
WHERE representative_user_id = 3

-- -- DELETE DATA

-- DELETE FROM friendship_requests
-- WHERE (sender_id = 1 AND recepient_id = 2) or (recepient_id = 1 AND sender_id = 2);

-- DELETE FROM users
-- WHERE id > 198;