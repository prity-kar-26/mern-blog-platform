import { Navigate } from 'react-router-dom';
import { FullPageSpinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';

// The backend already set the refresh cookie before redirecting here; AuthProvider's
// startup refresh turns it into a session, so this page only waits for the outcome
export function OAuthCallbackPage() {
    const { status } = useAuth();

    if (status === 'loading') return <FullPageSpinner />;
    if (status === 'authenticated') return <Navigate to="/" replace />;

    return <Navigate to={`/login?error=${encodeURIComponent('Sign-in failed, please try again')}`} replace />;
}