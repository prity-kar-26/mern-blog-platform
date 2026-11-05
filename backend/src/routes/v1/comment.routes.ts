import { Router } from 'express';
import { commentController } from '../../controllers/comment.controller';
import { activityLogger } from '../../middlewares/activityLogger';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
    commentIdParamSchema,
    createCommentSchema,
    listCommentsSchema,
    updateCommentSchema,
} from '../../validators/comment.validator';

const router = Router();

router.get('/posts/:postId/comments', validate(listCommentsSchema), commentController.listByPost);
router.post(
    '/posts/:postId/comments',
    authenticate,
    validate(createCommentSchema),
    activityLogger('COMMENT_CREATED'),
    commentController.create,
);
router.patch(
    '/comments/:id',
    authenticate,
    validate(updateCommentSchema),
    activityLogger('COMMENT_UPDATED'),
    commentController.update,
);
router.delete(
    '/comments/:id',
    authenticate,
    validate(commentIdParamSchema),
    activityLogger('COMMENT_DELETED'),
    commentController.remove,
);

export default router;