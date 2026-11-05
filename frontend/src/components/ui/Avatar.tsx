import { initials } from '../../utils/format';

type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, string> = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
};

const COLORS = [
    'bg-indigo-500',
    'bg-violet-500',
    'bg-fuchsia-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-sky-500',
    'bg-teal-500',
];

// Same name always gets the same colour, so a person is recognisable across the app
const colorFor = (name: string) =>
    COLORS[[...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length];

export function Avatar({ name, size = 'md' }: { name: string; size?: Size }) {
    return (
        <span
            aria-hidden="true"
            className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${SIZES[size]} ${colorFor(name)}`}
        >
            {initials(name)}
        </span>
    );
}