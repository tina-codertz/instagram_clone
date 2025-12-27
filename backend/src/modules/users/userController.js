import { getUsers as _getUsers, getProfile as _getProfile, follow as _follow, unfollow as _unfollow, getAccountInfo as _getAccountInfo } from './usersServices.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await _getUsers(req.query.search);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await _getProfile(req.params.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const follow = async (req, res, next) => {
  try {
    await _follow(req.user.id, req.params.id);
    res.json({ message: 'Followed' });
  } catch (err) {
    next(err);
  }
};

export const unfollow = async (req, res, next) => {
  try {
    await _unfollow(req.user.id, req.params.id);
    res.json({ message: 'Unfollowed' });
  } catch (err) {
    next(err);
  }
};

export const getAccountInfo = async (req, res, next) => {
  try {
    const info = await _getAccountInfo(req.user.id);
    res.json(info);
  } catch (err) {
    next(err);
  }
};

