import crypto from 'node:crypto';

export const generateSlug = (title: string): string => {
    const base = title
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60)
        .replace(/-+$/g, '');

    // Non-Latin titles (e.g. Bengali) produce an empty base, hence the fallback
    return `${base || 'post'}-${crypto.randomBytes(3).toString('hex')}`;
};