-- USERS TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bio TEXT,
  profile_pic TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POSTS TABLE
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  image TEXT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_posts_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- COMMENTS TABLE
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_comments_post
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- LIKES TABLE
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,

  CONSTRAINT fk_likes_post
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_likes_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_post_user_like
    UNIQUE (post_id, user_id)
);

-- FOLLOWS TABLE
CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  follower_id INT NOT NULL,
  following_id INT NOT NULL,

  CONSTRAINT fk_follower
    FOREIGN KEY (follower_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_following
    FOREIGN KEY (following_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_follow
    UNIQUE (follower_id, following_id)
);
