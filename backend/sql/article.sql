DROP TABLE IF EXISTS Articles;

CREATE TABLE Articles (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(512) NOT NULL,
    authors VARCHAR(512) NOT NULL,
    doi VARCHAR(64) NOT NULL,
    url VARCHAR(64),
    published_year YEAR NOT NULL,
    published_date VARCHAR(16) NOT NULL,
    abstract TEXT(4096),
    reference TEXT(4096)
);