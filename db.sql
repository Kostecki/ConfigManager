CREATE TABLE Config (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  label VARCHAR(255) NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `enabled` BOOLEAN NOT NULL DEFAULT true,
  projectId INTEGER NOT NULL,
  FOREIGN KEY (projectId) REFERENCES Project(id)
);

CREATE TABLE Project (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  githubLink VARCHAR(255),
  lastSeen DATETIME
)