import { query } from '../../config/db.js';
import cloudinary from '../../config/cloudinary.js';

export const createPost = async (userId, content, file) => {
  let image = null;

  if (file) {
    const result = await cloudinary.uploader.upload(file.path);
    image = result.secure_url;
  }

  const { rows } = await query(
    `
    INSERT INTO posts (content, image, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, content, image, user_id, created_at
    `,
    [content, image, userId]
  );

  return rows[0];
};
export const getFeed = async (userId) => {
  const { rows } = await query(
    `
    SELECT
      p.id,
      p.content,
      p.image,
      p.created_at,
      u.username,
      COUNT(DISTINCT l.id)::int AS likes_count,
      COUNT(DISTINCT c.id)::int AS comments_count
    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN follows f ON f.following_id = p.user_id
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id
    WHERE p.user_id = $1 OR f.follower_id = $1
    GROUP BY p.id, u.username
    ORDER BY p.created_at DESC
    `,
    [userId]
  );

  return rows;
};

export const getPost = async (id) => {
  const { rows } = await query(
    `
    SELECT
      p.id,
      p.content,
      p.image,
      p.created_at,
      u.id AS user_id,
      u.username
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.id = $1
    `,
    [parseInt(id)]
  );

  if (!rows.length) return null;

  const post = rows[0];

  const { rows: comments } = await query(
    `
    SELECT
      c.id,
      c.content,
      c.created_at,
      u.id AS user_id,
      u.username
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = $1
    ORDER BY c.created_at DESC
    `,
    [parseInt(id)]
  );

  const { rows: likes } = await query(
    `SELECT user_id FROM likes WHERE post_id = $1`,
    [parseInt(id)]
  );

  return {
    ...post,
    comments,
    likesCount: likes.length,
  };
};

export const deletePost = async (id, userId) => {
  const { rows } = await query(
    `SELECT user_id FROM posts WHERE id = $1`,
    [parseInt(id)]
  );

  if (!rows.length || rows[0].user_id !== userId) {
    throw new Error('Unauthorized or post not found');
  }

  await query(
    `DELETE FROM posts WHERE id = $1`,
    [parseInt(id)]
  );
};




