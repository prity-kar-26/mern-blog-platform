import toast from 'react-hot-toast';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

export function Navbar() {
    const { user, status, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out');
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link to="/" className="flex items-center gap-2 pr-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-fuchsia-600 text-lg font-bold text-white shadow">
                            B
                        </span>
                        <span className="hidden text-lg font-bold tracking-tight sm:inline">MERN Blog</span>
                    </Link>
                    <NavLink to="/" end className={navLinkClass}>
                        Home
                    </NavLink>
                    {user && (
                        <>
                            <NavLink to="/posts/new" className={navLinkClass}>
                                Write
                            </NavLink>
                            <NavLink to="/my-posts" className={navLinkClass}>
                                My posts
                            </NavLink>
                        </>
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
                            <div className="hidden items-center gap-2 sm:flex">
                                <Avatar name={user.name} size="sm" />
                                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                            </div>
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
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
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