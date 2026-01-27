import { hashPassword, comparePassword } from "../../utils/hash.js";
import { generateToken } from "../../utils/jwt.js";
import { query } from "../../config/db.js";

export const register = async ({ username, email, password }) => {
  const hashed = await hashPassword(password);

  const { rows } = await query(
    `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email
    `,
    [username, email, hashed]
  );

  return rows[0];
};

export const login = async ({ email, password }) => {
  const { rows } = await query(
    `
    SELECT id, username, email, password
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (!rows.length) {
    throw new Error("Invalid credentials");
  }

  const user = rows[0];

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ id: user.id });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
};
