import toast from 'react-hot-toast';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`;

export function Navbar() {
    const { user, status, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out');
        navigate('/');
    };

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-lg font-bold text-indigo-600">
                        MERN Blog
                    </Link>
                    <NavLink to="/" end className={navLinkClass}>
                        Home
                    </NavLink>
                    {user && (
                        <NavLink to="/posts/new" className={navLinkClass}>
                            Write
                        </NavLink>
                    )}
                    {isAdmin && (
                        <NavLink to="/admin" className={navLinkClass}>
                            Admin
                        </NavLink>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {status === 'authenticated' && user ? (
                        <>
                            <span className="text-sm text-slate-600">{user.name}</span>
                            <Button variant="secondary" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        status === 'unauthenticated' && (
                            <>
                                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Sign up
                                </Link>
                            </>
                        )
                    )}
                </div>
            </nav>
        </header>
    );
}