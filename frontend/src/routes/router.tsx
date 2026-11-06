import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyPostsPage } from '../pages/MyPostsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { PostDetailPage } from '../pages/PostDetailPage';
import { PostEditorPage } from '../pages/PostEditorPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AdminCommentsPage } from '../pages/admin/AdminCommentsPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminPostsPage } from '../pages/admin/AdminPostsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminRoute, ProtectedRoute } from './guards';

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'posts/:slug', element: <PostDetailPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'oauth/callback', element: <OAuthCallbackPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'posts/new', element: <PostEditorPage /> },
                    { path: 'posts/:slug/edit', element: <PostEditorPage /> },
                    { path: 'my-posts', element: <MyPostsPage /> },
                ],
            },
            {
                element: <AdminRoute />,
                children: [
                    {
                        path: 'admin',
                        element: <AdminLayout />,
                        children: [
                            { index: true, element: <AdminDashboardPage /> },
                            { path: 'users', element: <AdminUsersPage /> },
                            { path: 'posts', element: <AdminPostsPage /> },
                            { path: 'comments', element: <AdminCommentsPage /> },
                        ],
                    },
                ],
            },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);