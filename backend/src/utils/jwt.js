import jwt from 'jsonwebtoken';
const { sign } = jwt;

export const generateToken = (payload) => {
  return sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

