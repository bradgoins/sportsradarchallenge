CREATE TABLE IF NOT EXISTS player_game_stats (
    id serial PRIMARY KEY,
    game_pk INT NOT NULL,
    team_id INT,
    player_id INT,
    position VARCHAR(255) NOT NULL,
    assists INT,
    goals INT,
    hits INT,
    points INT,
    penalty_minutes VARCHAR(255)
)