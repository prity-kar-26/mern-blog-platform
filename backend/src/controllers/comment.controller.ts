import { Request, Response } from 'express';
import { commentService } from '../services/comment.service';
import { sendSuccess } from '../utils/apiResponse';
import { ListCommentsQuery } from '../validators/comment.validator';

export const commentController = {
    async listByPost(req: Request, res: Response) {
        const { items, meta } = await commentService.listByPost(
            req.params.postId as string,
            req.query as unknown as ListCommentsQuery,
        );
        sendSuccess(res, items, 200, meta);
    },

    async create(req: Request, res: Response) {
        const comment = await commentService.create(
            req.params.postId as string,
            req.user!.id,
            req.body.content,
        );
        sendSuccess(res, comment, 201);
    },

    async update(req: Request, res: Response) {
        sendSuccess(res, await commentService.update(req.params.id as string, req.user!, req.body.content));
    },

    async remove(req: Request, res: Response) {
        await commentService.remove(req.params.id as string, req.user!);
        sendSuccess(res, { message: 'Comment deleted successfully' });
    },
};