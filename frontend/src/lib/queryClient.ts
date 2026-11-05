import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            // Client errors (4xx) will not succeed on retry, so only network and server failures are retried
            retry: (failureCount, error) =>
                failureCount < 2 && !(isAxiosError(error) && error.response && error.response.status < 500),
        },
    },
});