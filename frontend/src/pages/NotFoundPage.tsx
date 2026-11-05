import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <section className="py-16 text-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="mt-2 text-slate-600">This page does not exist.</p>
            <Link to="/" className="mt-4 inline-block font-medium text-indigo-600 hover:underline">
                Back to home
            </Link>
        </section>
    );
}