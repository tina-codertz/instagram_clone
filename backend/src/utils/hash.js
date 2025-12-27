import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password) => {
  return hash(password, 10);
};

export const comparePassword = async (password, hashed) => {
  return compare(password, hashed);
};

