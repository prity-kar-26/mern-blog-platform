import { Router } from 'express';
import authRoutes from './auth.routes';
import commentRoutes from './comment.routes';
import healthRoutes from './health.routes';
import postRoutes from './post.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/admin', adminRoutes);
router.use('/', commentRoutes);

export default router; 