const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});
const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
];

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));

export const timeAgo = (iso: string) => {
    const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
    for (const [unit, size] of UNITS) {
        if (Math.abs(seconds) >= size) return relativeFormatter.format(Math.round(seconds / size), unit);
    }
    return 'just now';
};

export const readingTime = (content: string) =>
    Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

export const excerpt = (content: string, max = 160) => {
    const text = content.replace(/\s+/g, ' ').trim();
    return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
};

export const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || '?';