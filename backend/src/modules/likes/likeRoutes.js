import { Router } from 'express';
import { likePost, unlikePost } from './likeController.js';
import authMiddleware from '../../middleware/auth.js';

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, likePost);
router.delete('/', authMiddleware, unlikePost);

export default router;