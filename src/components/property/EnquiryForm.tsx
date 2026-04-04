'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/components';
import { toast } from '@/components/ui/toaster';
import { enquirySchema, type EnquiryFormData } from '@/lib/validations/index';

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  ownerPhone?: string | null;
}

export function EnquiryForm({ propertyId, propertyTitle, ownerPhone }: EnquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const defaultMessage = `Hi, I am interested in this property: "${propertyTitle}". Please get in touch with more details.`;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      propertyId,
      name: '',
      email: '',
      phone: '',
      message: defaultMessage,
    },
  });

  const onSubmit = async (_data: EnquiryFormData) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSent(true);
    toast({
      title: 'Enquiry saved locally',
      description: 'This page is in static demo mode. We can connect the backend later.',
      variant: 'success',
    } as Parameters<typeof toast>[0]);
    reset({
      propertyId,
      name: '',
      email: '',
      phone: '',
      message: defaultMessage,
    });
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Send className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="mb-2 font-display text-lg font-semibold">Demo Enquiry Captured</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          The form is working in static mode and ready for backend hookup later.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSent(false)}>Send Another</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold">Enquire About This Property</h3>
      </div>

      {ownerPhone && (
        <a
          href={`tel:${ownerPhone}`}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
        >
          <Phone className="h-4 w-4" />
          Call Agent: {ownerPhone}
        </a>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('propertyId')} />

        <div className="space-y-1.5">
          <Label htmlFor="enq-name">Your Name</Label>
          <Input id="enq-name" placeholder="John Doe" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enq-email">Email Address</Label>
          <Input id="enq-email" type="email" placeholder="john@example.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enq-phone">Phone (optional)</Label>
          <Input id="enq-phone" type="tel" placeholder="+971 50 000 0000" {...register('phone')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enq-msg">Message</Label>
          <Textarea id="enq-msg" rows={4} {...register('message')} />
          {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
        </div>

        <Button type="submit" className="w-full" variant="gold" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Send Enquiry
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Static demo flow for now. Submission is stored only in the UI state.
        </p>
      </form>
    </div>
  );
}
