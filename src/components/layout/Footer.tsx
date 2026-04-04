import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';

const footerLinks = {
  Navigation: [
    { label: 'Home', href: '/#home' },
    { label: 'Listings', href: '/properties' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#consultation' },
  ],
  Services: [
    { label: 'Property Sales', href: '/#services' },
    { label: 'Off-Plan Investments', href: '/#services' },
    { label: 'Rental & Leasing', href: '/#services' },
    { label: 'Portfolio Advisory', href: '/#services' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="bg-[#c62835] py-14 text-center text-white">
        <Link href="/#consultation" className="text-[16px] font-medium">
          Book Your Consultation
        </Link>
      </div>

      <div className="mx-auto max-w-[1700px] px-8 py-20 lg:px-14">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="max-w-sm">
            <div className="mb-10 h-[2px] w-20 bg-[#d12d3a]" />
            <div className="mb-8">
              <Logo />
            </div>
            <p className="text-[17px] leading-[1.7] text-[#8e9198]">
              Dubai&apos;s strategic luxury &amp; off-plan property advisors. Delivering premium real estate solutions for discerning investors.
            </p>
          </div>

          <div>
            <h4 className="mb-8 text-[16px] uppercase tracking-[0.08em] text-[#7d8086]">Navigation</h4>
            <div className="space-y-4">
              {footerLinks.Navigation.map((item) => (
                <Link key={item.label} href={item.href} className="block text-[17px] text-[#a3a5aa] transition-colors hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-8 text-[16px] uppercase tracking-[0.08em] text-[#7d8086]">Services</h4>
            <div className="space-y-4">
              {footerLinks.Services.map((item) => (
                <Link key={item.label} href={item.href} className="block text-[17px] text-[#a3a5aa] transition-colors hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-8 text-[16px] uppercase tracking-[0.08em] text-[#7d8086]">Contact</h4>
            <div className="space-y-4 text-[17px] text-[#a3a5aa]">
              <p>Downtown Dubai, UAE</p>
              <p>+971 4 XXX XXXX</p>
              <p>info@luxedubai.ae</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 text-center">
          <p className="text-[15px] text-[#6f7278]">&copy; 2026 Meus Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
