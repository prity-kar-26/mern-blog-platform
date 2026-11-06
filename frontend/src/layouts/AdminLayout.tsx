import { NavLink, Outlet } from 'react-router-dom';

const LINKS = [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/users', label: 'Users', icon: '👥', end: false },
    { to: '/admin/posts', label: 'Posts', icon: '📝', end: false },
    { to: '/admin/comments', label: 'Comments', icon: '💬', end: false },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
        ? 'bg-indigo-600 text-white shadow'
        : 'text-slate-600 hover:bg-white hover:text-slate-900'
    }`;

export function AdminLayout() {
    return (
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
                <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:block">
                    Admin panel
                </p>
                <nav aria-label="Admin" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
                    {LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                            <span aria-hidden="true">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <section className="min-w-0">
                <Outlet />
            </section>
        </div>
    );
}