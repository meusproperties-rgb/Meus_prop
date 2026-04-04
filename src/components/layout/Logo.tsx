import Link from 'next/link';

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-4">
      <div className="relative h-[58px] w-[58px] shrink-0">
        <svg viewBox="0 0 72 72" className="h-full w-full" aria-hidden="true">
          <path d="M8 52V26l13-13 13 13" fill="none" stroke="#8e8f96" strokeWidth="4" strokeLinecap="square" />
          <path d="M20 52V34" fill="none" stroke="#8e8f96" strokeWidth="4" strokeLinecap="square" />
          <path d="M30 52V30" fill="none" stroke="#8e8f96" strokeWidth="4" strokeLinecap="square" />
          <path d="M40 52V20l12 12v20" fill="none" stroke="#8e8f96" strokeWidth="4" strokeLinecap="square" />
          <path d="M10 18 21 7l17 17" fill="none" stroke="#d12d3a" strokeWidth="4" strokeLinecap="square" />
          <rect x="22" y="16" width="8" height="8" fill="#8e8f96" />
          <rect x="22" y="26" width="4" height="4" fill="#8e8f96" />
          <rect x="28" y="26" width="4" height="4" fill="#8e8f96" />
        </svg>
      </div>
      <div className={compact ? 'leading-none' : 'leading-none'}>
        <div className="font-display text-[23px] font-semibold uppercase tracking-[-0.01em] text-[#d3d4d7]">MEUS</div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8f9198]">Real Estate</div>
      </div>
    </Link>
  );
}
