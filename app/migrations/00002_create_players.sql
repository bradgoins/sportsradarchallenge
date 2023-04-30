CREATE TABLE IF NOT EXISTS players (
    id serial PRIMARY KEY,
    player_id INT,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(255) NOT NULL,
    age INT
)