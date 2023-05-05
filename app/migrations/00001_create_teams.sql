CREATE TABLE IF NOT EXISTS teams (
    id serial PRIMARY KEY,
    team_id INT,
    team_name VARCHAR(255) NOT NULL
);
CREATE INDEX team_id ON teams(team_id)