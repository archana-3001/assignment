CREATE TABLE IF NOT EXISTS catalog.users
(
    ID UUID PRIMARYKEY,
    First_name text,
    Last_name text,
    Username text,
    Password text,
    Phone_number text,
    email text,
    Is_active boolean,
    Is_admin boolean
);