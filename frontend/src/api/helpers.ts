import type { AxiosResponse } from 'axios';
import type { ApiSuccess, PageMeta, Paginated } from '../types';

export const unwrap = <T>(res: AxiosResponse<ApiSuccess<T>>): T => res.data.data;

export const toPage = <T>(res: AxiosResponse<ApiSuccess<T[]>>): Paginated<T> => ({
    items: res.data.data,
    meta: res.data.meta as PageMeta,
});