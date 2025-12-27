import { likePost as _likePost, unlikePost as _unlikePost } from './likeServices.js';

export const likePost = async (req, res, next) => {
  try {
    await _likePost(req.user.id, req.params.postId);
    res.json({ message: 'Liked' });
  } catch (err) {
    next(err);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    await _unlikePost(req.user.id, req.params.postId);
    res.json({ message: 'Unliked' });
  } catch (err) {
    next(err);
  }
};

