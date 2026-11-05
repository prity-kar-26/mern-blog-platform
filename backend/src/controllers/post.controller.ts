import { Request, Response } from 'express';
import { postService } from '../services/post.service';
import { sendSuccess } from '../utils/apiResponse';
import { ListPostsQuery } from '../validators/post.validator';

export const postController = {
    async list(req: Request, res: Response) {
        const { items, meta } = await postService.list(req.query as unknown as ListPostsQuery);
        sendSuccess(res, items, 200, meta);
    },

    async getBySlug(req: Request, res: Response) {
        sendSuccess(res, await postService.getBySlug(req.params.slug as string));
    },

    async create(req: Request, res: Response) {
        sendSuccess(res, await postService.create(req.user!.id, req.body), 201);
    },

    async update(req: Request, res: Response) {
        sendSuccess(res, await postService.update(req.params.id as string, req.user!, req.body));
    },

    async remove(req: Request, res: Response) {
        await postService.remove(req.params.id as string, req.user!);
        sendSuccess(res, { message: 'Post deleted successfully' });
    },
};