import { query } from '../../config/db.js';
export const getUsers = async (search) => {
  if (search) {
    const { rows } = await query(
      `
      SELECT id, username, bio, profile_pic
      FROM users
      WHERE username ILIKE $1
      `,
      [`%${search}%`]
    );
    return rows;
  }

  const { rows } = await query(
    `SELECT id, username, bio, profile_pic FROM users`
  );
  return rows;
};

export const getProfile = async (id) => {
  const userId = parseInt(id);
  if (isNaN(userId)) throw new Error('Invalid user ID');

  const { rows: users } = await query(
    `
    SELECT id, username, bio, profile_pic
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  if (!users.length) throw new Error('User not found');

  const user = users[0];

  const [
    { rows: postCount },
    { rows: followerCount },
    { rows: followingCount },
    { rows: posts },
  ] = await Promise.all([
    query(`SELECT COUNT(*)::int AS count FROM posts WHERE user_id = $1`, [userId]),
    query(`SELECT COUNT(*)::int AS count FROM follows WHERE following_id = $1`, [userId]),
    query(`SELECT COUNT(*)::int AS count FROM follows WHERE follower_id = $1`, [userId]),
    query(
      `
      SELECT id, image, content, created_at
      FROM posts
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [userId]
    ),
  ]);

  return {
    ...user,
    postCount: postCount[0].count,
    followerCount: followerCount[0].count,
    followingCount: followingCount[0].count,
    posts,
  };
};

export const follow = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error('Cannot follow self');
  }

  try {
    await query(
      `
      INSERT INTO follows (follower_id, following_id)
      VALUES ($1, $2)
      `,
      [followerId, followingId]
    );
  } catch (err) {
    if (err.code === '23505') {
      throw new Error('Already following');
    }
    throw err;
  }
};

export const unfollow = async (followerId, followingId) => {
  await query(
    `
    DELETE FROM follows
    WHERE follower_id = $1 AND following_id = $2
    `,
    [followerId, followingId]
  );
};
export const getAccountInfo = async (id) => {
  const userId = parseInt(id);
  if (isNaN(userId)) throw new Error('User ID is required');

  const { rows } = await query(
    `
    SELECT
      id,
      username,
      email,
      bio,
      profile_pic,
      created_at
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  if (!rows.length) throw new Error('User not found');

  return rows[0];
};



