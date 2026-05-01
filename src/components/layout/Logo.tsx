import Link from 'next/link';

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <Link href="/" className="flex items-center">
      <img
        src="/lovable-assets/logo-nav.png"
        alt="Meus Real Estate"
        className={className || (compact ? 'h-10 w-auto sm:h-12' : 'h-14 w-auto sm:h-16')}
      />
    </Link>
  );
}
