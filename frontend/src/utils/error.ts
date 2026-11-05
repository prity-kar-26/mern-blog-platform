import { isAxiosError } from 'axios';
import type { ApiErrorBody } from '../types';

export const getErrorMessage = (error: unknown): string => {
    if (isAxiosError<ApiErrorBody>(error)) {
        const body = error.response?.data?.error;
        if (body?.details?.length) return body.details.map((d) => d.message).join('. ');
        if (body?.message) return body.message;
        if (!error.response) return 'Cannot reach the server. Please check your connection.';
    }
    return 'Something went wrong. Please try again.';
};