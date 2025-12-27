import { Router } from 'express';
import { getUsers, getProfile, follow, unfollow, getAccountInfo } from './userController.js';
import authMiddleware from '../../middleware/auth.js';

const router = Router();

router.get('/', getUsers); // Discover users
router.get('/:id', getProfile);
router.post('/:id/follow', authMiddleware, follow);
router.post('/:id/unfollow', authMiddleware, unfollow);
router.get('/account', authMiddleware, getAccountInfo);

export default router;