import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  'Buying & Selling of Residential and Commercial Properties',
  'Leasing & Rental Brokerage Services',
  'Off-Plan & Ready Property Marketing',
  'Real Estate Investment Advisory',
  'Transaction Management & Legal Coordination',
  'After-Sales Client Support',
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h1 className="mb-5 text-4xl md:text-5xl lg:text-6xl font-display">About MEUS Real Estate</h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-primary-foreground/60">
            Dubai-based real estate brokerage delivering comprehensive solutions for investors and homeowners since 2023.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto grid items-center gap-20 px-6 md:grid-cols-2">
          <img src="/lovable-assets/about-interior.jpg" alt="MEUS Real Estate office" className="h-[320px] w-full object-cover sm:h-[420px] md:h-[520px]" />
          <div>
            <h2 className="mb-8 text-3xl md:text-4xl font-display">About the Company</h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              MEUS Real Estate Brokerage is a Dubai-based real estate brokerage company established in 2023 under local Emirati management. The company is backed by more than 8 years of hands-on experience in the UAE real estate market.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              We specialize in delivering comprehensive real estate solutions for both residential and investment purposes. Our services cater to local and international clients across Dubai, Ras Al Khaimah, and Abu Dhabi.
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Our operations are supported by strong partnerships with leading real estate developers and key industry stakeholders, enabling us to provide exclusive opportunities and seamless transactions.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { num: '8+', label: 'Years Experience' },
                { num: '3', label: 'Emirates Covered' },
                { num: '2023', label: 'Established' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-2xl font-extrabold text-accent">{item.num}</p>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl font-display">Our Services</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Comprehensive real estate solutions tailored for every stage of your property journey.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
            {services.map((service) => (
              <div key={service} className="flex items-start gap-3 bg-card p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm font-medium text-foreground">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-8 text-3xl md:text-4xl font-display">Our Philosophy</h2>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            At MEUS, we believe real estate is more than a transaction - it is a long-term decision.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We are committed to professionalism, transparency, and a client-centric approach, delivering tailored solutions aligned with each client&apos;s financial goals and lifestyle needs.
          </p>
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground md:py-28">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-8 text-3xl md:text-4xl font-display">Our Vision</h2>
          <p className="text-lg leading-relaxed text-primary-foreground/70">
            To be the trusted real estate partner for individuals and investors seeking secure investments, sustainable growth, and real value in the UAE real estate market.
          </p>
        </div>
      </section>

      <section className="py-20 text-center md:py-28">
        <div className="container mx-auto max-w-2xl px-6">
          <h2 className="mb-6 text-3xl md:text-4xl font-display">Let&apos;s Build Your Portfolio</h2>
          <p className="mb-10 text-muted-foreground">
            Connect with our advisory team to explore tailored investment strategies.
          </p>
          <Button variant="cta" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
