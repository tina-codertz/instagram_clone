import { createPost as _createPost, getFeed as _getFeed, getPost as _getPost, deletePost as _deletePost } from './postServices.js';

export const createPost = async (req, res, next) => {
  try {
    const post = await _createPost(req.user.id, req.body.content, req.file);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const feed = await _getFeed(req.user.id);
    res.json(feed);
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await _getPost(req.params.id);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await _deletePost(req.params.id, req.user.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

