import prisma from '../../config/db.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { generateToken } from '../../utils/jwt.js';

export const register = async ({ username, email, password }) => {
  const hashed = await hashPassword(password);
  return prisma.user.create({  // ← Changed from _user.create
    data: { username, email, password: hashed },
  });
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });  // ← Changed from _user.findUnique
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = generateToken({ id: user.id });
  return { token, user: { id: user.id, username: user.username, email: user.email } };
};
