select user, host, plugin from mysql.user;
DROP USER 'root'@'%';

CREATE USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'maulana';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;


CREATE USER 'maulana'@'%' IDENTIFIED WITH mysql_native_password BY 'maulana';
GRANT ALL PRIVILEGES ON *.* TO 'maulana'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE DATABASE maulana;

--it is executed from SQL-Yog
CREATE TABLE maulana.my_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(50),
    age INT
);

INSERT INTO maulana.my_table (NAME, age) VALUES ('John', 30), ('Alice', 25), ('Bob', 35), ('Emily', 28);

SELECT * FROM maulana.my_table;