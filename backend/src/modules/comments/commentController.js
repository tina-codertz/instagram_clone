// Create similar structure for comments
import { createComment as _createComment, getComments as _getComments } from './commentServices.js';

export const createComment = async (req, res, next) => {
  try {
    const comment = await _createComment(req.user.id, req.params.postId, req.body.content);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await _getComments(req.params.postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

