import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { activityLogger } from '../../middlewares/activityLogger';
import { authenticate } from '../../middlewares/authenticate';
import { authLimiter, loginLimiter } from '../../middlewares/rateLimiter';
import { validate } from '../../middlewares/validate';
import { loginSchema, registerSchema } from '../../validators/auth.validator';
import { oauthController } from '../../controllers/oauth.controller';

const router = Router();

router.post(
    '/register',
    authLimiter,
    validate(registerSchema),
    activityLogger('USER_REGISTERED'),
    authController.register,
);
router.post(
    '/login',
    loginLimiter,
    validate(loginSchema),
    activityLogger('USER_LOGIN'),
    authController.login,
);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authLimiter, activityLogger('USER_LOGOUT'), authController.logout);
router.get('/me', authenticate, authController.me);

router.get('/google', authLimiter, oauthController.start('google'));
router.get('/google/callback', authLimiter, oauthController.callback('google'));
router.get('/facebook', authLimiter, oauthController.start('facebook'));
router.get('/facebook/callback', authLimiter, oauthController.callback('facebook'));

export default router;