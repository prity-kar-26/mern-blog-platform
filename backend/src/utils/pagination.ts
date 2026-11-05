export const buildPageMeta = (total: number, page: number, limit: number) => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
});