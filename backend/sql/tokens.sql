DROP TABLE IF EXISTS tokens;

CREATE TABLE tokens (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    userid INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL
);