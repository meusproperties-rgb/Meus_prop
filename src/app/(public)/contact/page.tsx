'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: 'Please fill in all required fields.', variant: 'destructive' } as Parameters<typeof toast>[0]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to send message');
      }

      toast({ title: "Thank you! We'll be in touch shortly.", variant: 'success' } as Parameters<typeof toast>[0]);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({
        title: 'Unable to send message',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      } as Parameters<typeof toast>[0]);
    } finally {
      setLoading(false);
    }
  };

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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Name *</label>
              <input
                className="w-full border border-border bg-background px-4 py-3 text-sm font-body transition-colors focus:border-accent focus:outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email *</label>
              <input
                type="email"
                className="w-full border border-border bg-background px-4 py-3 text-sm font-body transition-colors focus:border-accent focus:outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
              <input
                type="tel"
                className="w-full border border-border bg-background px-4 py-3 text-sm font-body transition-colors focus:border-accent focus:outline-none"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Message *</label>
              <textarea
                rows={5}
                className="w-full resize-none border border-border bg-background px-4 py-3 text-sm font-body transition-colors focus:border-accent focus:outline-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
              />
            </div>
            <Button variant="cta" size="lg" type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
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
                { icon: MapPin, label: 'Visit Us', value: 'UAE, business bay, Marasi drive St, bayview tower, 13th floor, office 1309D' },
                { icon: Phone, label: 'Call Us', value: '+971 50 900 9028' },
                { icon: Mail, label: 'Email Us', value: 'info@meus.ae' },
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
