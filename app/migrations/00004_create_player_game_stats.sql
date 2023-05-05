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
);
CREATE INDEX game_pk ON player_game_stats(game_pk);
CREATE INDEX player_game_stats_team_id ON player_game_stats(team_id);
CREATE INDEX player_game_stats_player_id ON player_game_stats(player_id)