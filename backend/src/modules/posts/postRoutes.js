import { Router } from 'express';
import { createPost, getFeed, getPost, deletePost } from './postController.js';
import authMiddleware from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = Router();

router.post('/', authMiddleware, upload.single('image'), createPost);
router.get('/feed', authMiddleware, getFeed);
router.get('/:id', getPost);
router.delete('/:id', authMiddleware, deletePost);

export default router;