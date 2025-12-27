import { Router } from 'express'
import authRoutes from './modules/auth/authRoutes.js';
import userRoutes from './modules/users/userRoutes.js';
import postRoutes from './modules/posts/postRoutes.js';
import commentRoutes from './modules/comments/commentsRoutes.js';
import likeRoutes from './modules/likes/likeRoutes.js';
import errorMiddleware from './middleware/error.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/posts/:postId/comments', commentRoutes);
router.use('/posts/:postId/likes', likeRoutes);

router.use(errorMiddleware);

export default router;