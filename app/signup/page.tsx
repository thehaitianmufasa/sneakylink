'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@frontend/components/ui/button';
import { TextInput, TextArea } from '@frontend/components/ui/form-input';
import SMSOptInCheckbox from '@frontend/components/SMSOptInCheckbox';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

// Validation schema for signup form (same as QuoteModal)
const signupFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?1?\d{10,14}$/, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Please provide at least 10 characters about your needs'),
  smsOptedIn: z.boolean().refine((val) => val === true, {
    message: 'Please opt in to SMS to receive lead notifications',
  }),
});

type SignupFormData = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
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
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      smsOptedIn: false,
    },
  });

  const smsOptedIn = watch('smsOptedIn');

  const onSubmit = async (data: SignupFormData) => {
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
          source: 'signup_page',
          clientId: '00000000-0000-0000-0000-000000000002',
          smsOptedIn: data.smsOptedIn,
          pageUrl: window.location.href,
          referrer: document.referrer,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              NeverMissLead
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {submitStatus === 'success' ? (
          // Success State
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Interest!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We&apos;ve received your request and will be in touch within 24 hours to discuss your custom website.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="primary" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Form State
          <>
            {/* Page Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                Get Your Custom Lead Management Website
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and we&apos;ll create a personalized demo for your business. Start capturing more leads in 24 hours.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <TextInput
                    id="fullName"
                    {...register('fullName')}
                    placeholder="John Smith"
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <TextInput
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tell Us About Your Business *
                  </label>
                  <TextArea
                    id="message"
                    {...register('message')}
                    placeholder="What type of business do you have? What services do you offer?"
                    rows={4}
                    className={errors.message ? 'border-red-500' : ''}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                {/* SMS Opt-In Checkbox */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <SMSOptInCheckbox
                    checked={smsOptedIn}
                    onChange={(checked) => setValue('smsOptedIn', checked)}
                    error={errors.smsOptedIn?.message}
                  />
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Your Website'}
                </Button>

                {/* Helper Text */}
                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our{' '}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                    Privacy Policy
                  </Link>
                  . We&apos;ll contact you within 24 hours to discuss your custom website.
                </p>
              </form>
            </div>

            {/* Trust Signals */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">24hr</div>
                <div className="text-sm text-gray-600">Quick Response</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">$297</div>
                <div className="text-sm text-gray-600">Monthly (No Setup Fee)</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Lead Capture Guarantee</div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              © 2025 NeverMissLead. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/pricing" className="hover:text-gray-700 transition-colors">
                Pricing
              </Link>
              <span>•</span>
              <Link href="/" className="hover:text-gray-700 transition-colors">
                View Demos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
