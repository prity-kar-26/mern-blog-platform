import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { oauthUrl, type OAuthProvider } from '../api/auth.api';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { inputClass } from '../components/ui/styles';
import { useAuth } from '../hooks/useAuth';
import type { LoginInput } from '../types';
import { getErrorMessage } from '../utils/error';

// Remove 'facebook' here until its credentials are configured on the backend
const OAUTH_PROVIDERS: { id: OAuthProvider; label: string }[] = [
    { id: 'google', label: 'Continue with Google' },
    { id: 'facebook', label: 'Continue with Facebook' },
];

export function LoginPage() {
    const { login, status } = useAuth();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const oauthError = searchParams.get('error');
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>();

    const onSubmit = handleSubmit(async (values) => {
        try {
            await login(values);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    });

    if (status === 'authenticated') return <Navigate to={from} replace />;

    return (
        <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-2xl font-bold">Log in</h1>

            {oauthError && (
                <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {oauthError}
                </p>
            )}

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <Field label="Email" htmlFor="email" error={errors.email?.message}>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={inputClass}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
                        })}
                    />
                </Field>

                <Field label="Password" htmlFor="password" error={errors.password?.message}>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        className={inputClass}
                        {...register('password', { required: 'Password is required' })}
                    />
                </Field>

                <Button type="submit" loading={isSubmitting} className="w-full">
                    Log in
                </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or
                <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-2">
                {OAUTH_PROVIDERS.map((provider) => (
                    <a
                        key={provider.id}
                        href={oauthUrl(provider.id)}
                        className="block rounded-md border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        {provider.label}
                    </a>
                ))}
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
                New here?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:underline">
                    Create an account
                </Link>
            </p>
        </div>
    );
}