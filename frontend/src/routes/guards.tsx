import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageSpinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === 'loading') return <FullPageSpinner />;
    if (status === 'unauthenticated') {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <Outlet />;
}

// The API enforces roles independently; this only keeps non-admins out of the admin UI
export function AdminRoute() {
    const { status, isAdmin } = useAuth();
    const location = useLocation();

    if (status === 'loading') return <FullPageSpinner />;
    if (status === 'unauthenticated') {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    if (!isAdmin) return <Navigate to="/" replace />;
    return <Outlet />;
}