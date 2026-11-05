import { useAuth } from '../hooks/useAuth';

export function HomePage() {
    const { user } = useAuth();

    return (
        <section>
            <h1 className="text-3xl font-bold">Welcome{user ? `, ${user.name}` : ''}</h1>
            <p className="mt-2 text-slate-600">Blog posts will appear here in the next step.</p>
        </section>
    );
}