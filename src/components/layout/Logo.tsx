import Link from 'next/link';

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <img
        src={compact ? '/lovable-assets/logo-nav.png' : '/lovable-assets/logo-nav.png'}
        alt="Meus Real Estate"
        className="h-12 w-auto"
      />
    </Link>
  );
}
