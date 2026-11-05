import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { inputClass } from '../components/ui/styles';
import { useAuth } from '../hooks/useAuth';
import type { RegisterInput } from '../types';
import { getErrorMessage } from '../utils/error';

export function RegisterPage() {
    const { register: registerUser, status } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>();

    const onSubmit = handleSubmit(async (values) => {
        try {
            await registerUser(values);
            toast.success('Account created');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    });

    if (status === 'authenticated') return <Navigate to="/" replace />;

    return (
        <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-2xl font-bold">Create your account</h1>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <Field label="Name" htmlFor="name" error={errors.name?.message}>
                    <input
                        id="name"
                        autoComplete="name"
                        className={inputClass}
                        {...register('name', {
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' },
                            maxLength: { value: 50, message: 'Name must be at most 50 characters' },
                        })}
                    />
                </Field>

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
                        autoComplete="new-password"
                        className={inputClass}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            maxLength: { value: 72, message: 'Password must be at most 72 characters' },
                            validate: (value) =>
                                (/[A-Za-z]/.test(value) && /\d/.test(value)) ||
                                'Password must contain at least one letter and one number',
                        })}
                    />
                </Field>

                <Button type="submit" loading={isSubmitting} className="w-full">
                    Sign up
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}