CREATE TABLE IF NOT EXISTS games (
    id serial PRIMARY KEY,
    pk INT,
    season VARCHAR(255) NOT NULL,
    home_team INT,
    away_team INT
);
CREATE INDEX pk ON games(pk)