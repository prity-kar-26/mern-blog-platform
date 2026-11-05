import { Router } from 'express';
import { postController } from '../../controllers/post.controller';
import { activityLogger } from '../../middlewares/activityLogger';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
    createPostSchema,
    listPostsSchema,
    postIdParamSchema,
    slugParamSchema,
    updatePostSchema,
} from '../../validators/post.validator';

const router = Router();

router.get('/', validate(listPostsSchema), postController.list);
router.get('/:slug', validate(slugParamSchema), postController.getBySlug);

router.post(
    '/',
    authenticate,
    validate(createPostSchema),
    activityLogger('POST_CREATED'),
    postController.create,
);
router.patch(
    '/:id',
    authenticate,
    validate(updatePostSchema),
    activityLogger('POST_UPDATED'),
    postController.update,
);
router.delete(
    '/:id',
    authenticate,
    validate(postIdParamSchema),
    activityLogger('POST_DELETED'),
    postController.remove,
);

export default router;