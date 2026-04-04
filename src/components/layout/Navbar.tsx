'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/index';
import { Logo } from '@/components/layout/Logo';

const navLinks = [
  { href: '/#home', label: 'Home' },
  { href: '/properties', label: 'Listings' },
  { href: '/#about', label: 'About' },
  { href: '/#consultation', label: 'Contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/5 bg-[#121212]/96 backdrop-blur-xl'
          : 'bg-[#121212]'
      )}
    >
      <div className="mx-auto max-w-[1900px] px-10 lg:px-[72px]">
        <div className="flex h-20 items-center justify-between">
          <Logo />

          <div className="hidden items-center gap-12 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[15px] font-semibold uppercase tracking-[0.06em] transition-colors duration-200 hover:text-white',
                  link.label === 'Home' ? 'text-[#d12d3a]' : 'text-[#a9adb3]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block" />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-1 border-t border-white/10 bg-black/95 px-4 py-4 backdrop-blur-md lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.24em] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
            <Link href="/properties" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
                View Listings
              </Button>
            </Link>
            <Link href="/#consultation" onClick={() => setIsOpen(false)}>
              <Button variant="gold" className="w-full">Book Consultation</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
