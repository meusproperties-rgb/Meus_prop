'use client';

import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="mb-12 h-0.5 w-16 bg-accent" />
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="mb-5 max-w-[260px]">
              <Logo className="h-auto w-full" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Dubai&apos;s strategic luxury &amp; off-plan property advisors. Delivering premium real estate solutions for discerning investors.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Navigation</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Listings', href: '/listings' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Services</h4>
            <div className="flex flex-col gap-3">
              {['Property Sales', 'Off-Plan Investments', 'Rental & Leasing', 'Portfolio Advisory'].map((item) => (
                <span key={item} className="text-sm text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>UAE, business bay, Marasi drive St, bayview tower, 13th floor, office 1309D</p>
              <p>+971 50 900 9028</p>
              <p>info@meus.ae</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Meus Real Estate - All rights reserved.
        </div>
      </div>
    </footer>
  );
}
