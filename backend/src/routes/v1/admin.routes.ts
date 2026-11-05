import { Router } from 'express';
import { adminController } from '../../controllers/admin.controller';
import { ROLES } from '../../constants/roles';
import { activityLogger } from '../../middlewares/activityLogger';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import {
    listAdminCommentsSchema,
    listAdminPostsSchema,
    listUsersSchema,
    updateUserSchema,
    userIdParamSchema,
} from '../../validators/admin.validator';
import { postIdParamSchema } from '../../validators/post.validator';

const router = Router();

// Applied at router level so every current and future admin route is protected by default
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/stats', adminController.stats);

router.get('/users', validate(listUsersSchema), adminController.listUsers);
router.patch(
    '/users/:id',
    validate(updateUserSchema),
    activityLogger('ADMIN_USER_UPDATED'),
    adminController.updateUser,
);
router.delete(
    '/users/:id',
    validate(userIdParamSchema),
    activityLogger('ADMIN_USER_DELETED'),
    adminController.deleteUser,
);

router.get('/posts', validate(listAdminPostsSchema), adminController.listPosts);
router.post(
    '/posts/:id/restore',
    validate(postIdParamSchema),
    activityLogger('ADMIN_POST_RESTORED'),
    adminController.restorePost,
);

router.get('/comments', validate(listAdminCommentsSchema), adminController.listComments);

export default router;