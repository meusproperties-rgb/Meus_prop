import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-20">
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl font-display">Contact Us</h1>
          <p className="mx-auto max-w-xl text-primary-foreground/60">
            We&apos;d love to hear from you. Reach out for a private consultation.
          </p>
        </div>
      </section>
      <section className="py-20 md:py-24">
        <div className="container mx-auto grid gap-16 px-6 md:grid-cols-2">
          <form className="space-y-6">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Name *</label>
              <input className="w-full border border-border bg-background px-4 py-3 text-sm font-body transition-colors focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email *</label>
              <input className="w-full border border-border bg-background px-4 py-3 text-sm font-body transition-colors focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
              <input className="w-full border border-border bg-background px-4 py-3 text-sm font-body transition-colors focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Message *</label>
              <textarea rows={5} className="w-full resize-none border border-border bg-background px-4 py-3 text-sm font-body transition-colors focus:border-accent focus:outline-none" />
            </div>
            <Button variant="cta" size="lg" type="submit" className="w-full">
              Send Message
            </Button>
          </form>

          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-semibold font-display">Get in Touch</h2>
              <p className="leading-relaxed text-muted-foreground">
                Whether you&apos;re a first-time buyer or a seasoned investor, our team is ready to guide you through Dubai&apos;s luxury real estate landscape.
              </p>
            </div>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: 'Visit Us', value: 'Downtown Dubai, UAE' },
                { icon: Phone, label: 'Call Us', value: '+971 4 XXX XXXX' },
                { icon: Mail, label: 'Email Us', value: 'info@luxedubai.ae' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <item.icon className="mt-1 h-5 w-5 text-accent" />
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">{item.label}</p>
                    <p className="font-body">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
