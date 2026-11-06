CREATE DATABASE IF NOT EXISTS music;
USE music;

DROP TABLE IF EXISTS user_album_moods;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS moods;

CREATE TABLE moods (
  mood_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  role ENUM('admin','customer') NOT NULL DEFAULT 'customer'
);

CREATE TABLE albums (
  album_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  artist VARCHAR(100) NOT NULL,
  year INT NULL,
  default_mood_id INT NULL,
  FOREIGN KEY (default_mood_id) REFERENCES moods(mood_id) ON DELETE SET NULL
);

CREATE TABLE user_album_moods (
  user_id INT NOT NULL,
  album_id INT NOT NULL,
  mood_id INT NOT NULL,
  PRIMARY KEY (user_id, album_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE,
  FOREIGN KEY (mood_id) REFERENCES moods(mood_id)
);

INSERT INTO moods (name) VALUES ('Happy'),('Sad'),('Relaxed'),('Angry'),('Hopeful');
INSERT INTO users (username, role) VALUES ('admin','admin'),('hugo','customer'),('maria','customer');
INSERT INTO albums (title, artist, year, default_mood_id) VALUES
  ('Abbey Road','The Beatles',1969,1),
  ('Nevermind','Nirvana',1991,4),
  ('Kind of Blue','Miles Davis',1959,3);
