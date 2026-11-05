import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/apiResponse';
import {
    ListAdminCommentsQuery,
    ListAdminPostsQuery,
    ListUsersQuery,
} from '../validators/admin.validator';

export const adminController = {
    async stats(_req: Request, res: Response) {
        sendSuccess(res, await adminService.getStats());
    },

    async listUsers(req: Request, res: Response) {
        const { items, meta } = await adminService.listUsers(req.query as unknown as ListUsersQuery);
        sendSuccess(res, items, 200, meta);
    },

    async updateUser(req: Request, res: Response) {
        sendSuccess(res, await adminService.updateUser(req.params.id as string, req.user!, req.body));
    },

    async deleteUser(req: Request, res: Response) {
        await adminService.deleteUser(req.params.id as string, req.user!);
        sendSuccess(res, { message: 'User deleted successfully' });
    },

    async listPosts(req: Request, res: Response) {
        const { items, meta } = await adminService.listPosts(req.query as unknown as ListAdminPostsQuery);
        sendSuccess(res, items, 200, meta);
    },

    async restorePost(req: Request, res: Response) {
        sendSuccess(res, await adminService.restorePost(req.params.id as string));
    },

    async listComments(req: Request, res: Response) {
        const { items, meta } = await adminService.listComments(
            req.query as unknown as ListAdminCommentsQuery,
        );
        sendSuccess(res, items, 200, meta);
    },
};