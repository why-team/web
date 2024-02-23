DROP TABLE IF EXISTS Operation_History;
DROP VIEW IF EXISTS View_History;
DROP VIEW IF EXISTS Search_History;

CREATE TABLE Operation_History (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    op_type INT NOT NULL,               -- 操作的主类型
    op_type2 INT NOT NULL,              -- 操作的次类型
    op_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,               -- 进行操作的用户id（匿名用户记作-1）
    ip VARCHAR(40) NOT NULL,            -- 请求操作的IP
    user_agent VARCHAR(255) NOT NULL,   -- 请求操作的浏览器UA
    article_id INT,                     -- 操作文章的id（若有）
    dest_user INT,                      -- 对方用户的id（若有）
    details VARCHAR(255)                -- 附加的字符串（如搜索关键词）
);

CREATE INDEX index_op_types ON Operation_History (op_type, op_type2);
CREATE INDEX index_op_time ON Operation_History (op_time);

CREATE VIEW View_History AS
SELECT id, op_time, user_id, ip, user_agent, article_id
FROM Operation_History
WHERE op_type = 1 AND op_type2 = 0
ORDER BY op_time DESC;

CREATE VIEW Search_History AS
SELECT id, op_time, user_id, ip, user_agent, string
FROM Operation_History
WHERE op_type = 1 AND op_type2 = 1
ORDER BY op_time DESC;
