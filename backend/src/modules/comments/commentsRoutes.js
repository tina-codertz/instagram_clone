import { Router } from 'express';
import { createComment, getComments } from './commentController.js';
import authMiddleware from '../../middleware/auth.js';

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, createComment);
router.get('/', getComments);

export default router;