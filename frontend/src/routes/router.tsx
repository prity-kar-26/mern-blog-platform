import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { RegisterPage } from '../pages/RegisterPage';

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'oauth/callback', element: <OAuthCallbackPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);