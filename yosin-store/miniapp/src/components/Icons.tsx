// Inline SVG icons — stroke-based, inherit currentColor. Keeps the bundle tiny.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, ...p,
});

export const IcHome = (p: P) => (
  <svg {...base(p)}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
export const IcGrid = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
);
export const IcBag = (p: P) => (
  <svg {...base(p)}><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const IcUser = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" /></svg>
);
export const IcSearch = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>
);
export const IcHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.6C19 15.4 12 20 12 20Z" />
  </svg>
);
export const IcStar = ({ filled, half, ...p }: P & { filled?: boolean; half?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    {half && (
      <defs>
        <linearGradient id="halfstar"><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="transparent" /></linearGradient>
      </defs>
    )}
    <path fill={half ? 'url(#halfstar)' : undefined}
      d="M12 3.5l2.5 5 5.5.8-4 3.9.95 5.5L12 16.9 7.1 18.7 8 13.2l-4-3.9 5.5-.8z" />
  </svg>
);
export const IcPlus = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const IcMinus = (p: P) => (<svg {...base(p)}><path d="M5 12h14" /></svg>);
export const IcChevronLeft = (p: P) => (<svg {...base(p)}><path d="m15 5-7 7 7 7" /></svg>);
export const IcChevronRight = (p: P) => (<svg {...base(p)}><path d="m9 5 7 7-7 7" /></svg>);
export const IcCheck = (p: P) => (<svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7" /></svg>);
export const IcTrash = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" /></svg>
);
export const IcTruck = (p: P) => (
  <svg {...base(p)}><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7" /><circle cx="6" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>
);
export const IcShield = (p: P) => (
  <svg {...base(p)}><path d="M12 3l7 2.5v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V5.5L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const IcSpark = (p: P) => (
  <svg {...base(p)}><path d="M12 3v4M12 17v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" /></svg>
);
export const IcFilter = (p: P) => (
  <svg {...base(p)}><path d="M3 5h18M6 12h12M10 19h4" /></svg>
);
export const IcChart = (p: P) => (
  <svg {...base(p)}><path d="M4 20V4M4 20h16" /><rect x="8" y="11" width="3" height="6" rx="0.5" /><rect x="14" y="7" width="3" height="10" rx="0.5" /></svg>
);
export const IcChat = (p: P) => (
  <svg {...base(p)}><path d="M4 5h16v11H9l-4 4V5Z" /><path d="M8 9h8M8 12h5" /></svg>
);
export const IcMega = (p: P) => (
  <svg {...base(p)}><path d="M4 9v6h3l9 4V5L7 9H4Z" /><path d="M19 9a4 4 0 0 1 0 6" /></svg>
);
export const IcSettings = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></svg>
);
export const IcTag = (p: P) => (
  <svg {...base(p)}><path d="M4 4h7l9 9-7 7-9-9V4Z" /><circle cx="8.5" cy="8.5" r="1.3" /></svg>
);
export const IcLogout = (p: P) => (
  <svg {...base(p)}><path d="M15 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h9" /><path d="M18 8l4 4-4 4M22 12H10" /></svg>
);
export const IcEdit = (p: P) => (
  <svg {...base(p)}><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="M14 6l4 4" /></svg>
);
export const IcLock = (p: P) => (
  <svg {...base(p)}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
);
