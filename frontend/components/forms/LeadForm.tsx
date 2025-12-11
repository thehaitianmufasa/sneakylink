'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '../ui/button';
import { TextInput, TextArea } from '../ui/form-input';
import SMSOptInCheckbox from '../SMSOptInCheckbox';

// Validation schema
const leadFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?1?\d{10,14}$/, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Please provide at least 10 characters about your needs'),
  smsOptedIn: z.boolean().refine((val) => val === true, {
    message: 'Please opt in to SMS to receive lead notifications',
  }),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  businessName?: string;
  logoSrc?: string;
}

export function LeadForm({ businessName = 'us', logoSrc }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      smsOptedIn: false,
    },
  });

  const smsOptedIn = watch('smsOptedIn');

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          phone: data.phone,
          message: data.message,
          source: 'hero_form',
          smsOptedIn: data.smsOptedIn,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-form" className="relative rounded-2xl bg-primary p-8 shadow-lg">
      {/* Logo in top right */}
      {logoSrc && (
        <div className="absolute right-6 top-6">
          <div className="rounded-lg bg-white p-2 shadow-lg">
            <Image
              src={logoSrc}
              alt={`${businessName} logo`}
              width={80}
              height={80}
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
      )}

      <h3 className="mb-6 text-xl font-bold text-white">
        Get Service Now
      </h3>

      {submitStatus === 'success' ? (
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <div className="mb-2 text-4xl">✓</div>
          <h4 className="mb-2 text-lg font-semibold text-green-800">
            Thank You!
          </h4>
          <p className="text-green-700">
            We&apos;ll call you back within 5 minutes.
          </p>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="mt-4 text-sm text-green-600 hover:text-green-800 underline"
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="[&_label]:text-white [&_label]:font-semibold">
            <TextInput
              label="Your Name"
              {...register('fullName')}
              error={errors.fullName?.message}
              placeholder="John Smith"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="[&_label]:text-white [&_label]:font-semibold">
            <TextInput
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="(404) 555-0123"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <SMSOptInCheckbox
              checked={smsOptedIn}
              onChange={(checked) => setValue('smsOptedIn', checked, { shouldValidate: true })}
              error={errors.smsOptedIn?.message}
              disabled={isSubmitting}
            />
          </div>

          <div className="[&_label]:text-white [&_label]:font-semibold">
            <TextArea
              label="Tell Us About Your Needs"
              {...register('message')}
              error={errors.message?.message}
              placeholder="Your message are received instantly, we'll get back to you as soon as we are available"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          {submitStatus === 'error' && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full border-2 border-white font-bold shadow-lg hover:scale-105 transition-transform"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Request a Free Estimate'}
          </Button>

          <p className="text-center text-xs text-white/90">
            Your message are received instantly, we&apos;ll get back to you as soon as we are available
          </p>
        </form>
      )}
    </div>
  );
}

export default LeadForm;
