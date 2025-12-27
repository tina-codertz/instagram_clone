import { register as _register, login as _login } from './authServices.js';

export const register = async (req, res, next) => {
  try {
    const user = await _register(req.body);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { token, user } = await _login(req.body);
    res.json({ message: 'Logged in', token, user });
  } catch (err) {
    next(err);
  }
};

