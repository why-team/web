DROP TABLE IF EXISTS Favorites;

CREATE TABLE Favorites (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    comments VARCHAR(256)
);
