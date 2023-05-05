CREATE TABLE IF NOT EXISTS players (
    id serial PRIMARY KEY,
    player_id INT,
    name VARCHAR(255),
    number VARCHAR(255),
    age INT
);
CREATE INDEX player_id ON players(player_id)