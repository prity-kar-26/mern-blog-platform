export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} MERN Blog · Built with MongoDB, Express, React and Node.js
            </div>
        </footer>
    );
}