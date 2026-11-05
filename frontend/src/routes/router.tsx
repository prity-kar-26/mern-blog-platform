import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyPostsPage } from '../pages/MyPostsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { PostDetailPage } from '../pages/PostDetailPage';
import { PostEditorPage } from '../pages/PostEditorPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from './guards';

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
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);