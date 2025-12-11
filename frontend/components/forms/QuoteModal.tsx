'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '../ui/button';
import { TextInput, TextArea } from '../ui/form-input';
import { X } from 'lucide-react';
import { cn } from '@backend/lib/utils/cn';
import { ClimateGuardLogoIcon, ElectroProLogoIcon, AquaProLogoIcon } from '../ui/logo-icon';
import SMSOptInCheckbox from '../SMSOptInCheckbox';

// Validation schemas - different for different variants
const discountFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?1?\d{10,14}$/, 'Please enter a valid phone number'),
  smsOptedIn: z.boolean().refine((val) => val === true, {
    message: 'Please opt in to SMS to receive your discount',
  }),
});

const quoteFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?1?\d{10,14}$/, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Please provide at least 10 characters about your needs'),
  smsOptedIn: z.boolean().refine((val) => val === true, {
    message: 'Please opt in to SMS to receive lead notifications',
  }),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;
type DiscountFormData = z.infer<typeof discountFormSchema>;

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  theme?: 'brand' | 'landing';
  logoSrc?: string;
  variant?: 'discount' | 'access' | 'quote'; // New prop for different form variants
}

export function QuoteModal({
  isOpen,
  onClose,
  businessName = 'us',
  theme = 'brand',
  logoSrc,
  variant = 'quote', // Default to full quote form
}: QuoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Use different schema based on variant
  const isDiscountForm = variant === 'discount';
  const schema = isDiscountForm ? discountFormSchema : quoteFormSchema;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormData | DiscountFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      smsOptedIn: false,
    },
  });

  const smsOptedIn = watch('smsOptedIn');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Trap focus within modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const onSubmit = async (data: QuoteFormData | DiscountFormData) => {
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
          message: 'message' in data ? data.message : `${variant === 'discount' ? '30% discount request' : 'Access request'}`,
          source: variant === 'discount' ? 'discount_modal' : (variant === 'access' ? 'access_modal' : 'quote_modal'),
          smsOptedIn: data.smsOptedIn,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSubmitStatus('success');
      reset();

      // Redirect to how-it-works page if access variant
      if (variant === 'access') {
        setTimeout(() => {
          window.location.href = '/how-it-works';
        }, 1500); // 1.5 second delay to show success message
      }
    } catch (error) {
      console.error('Quote form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const themeClasses = theme === 'landing'
    ? {
        heading: 'text-[#0f172a]',
        body: 'text-[#475569]',
        primaryButton:
          '!bg-[#f97316] hover:!bg-[#ea580c] focus-visible:!ring-[#f97316]/20 focus-visible:!ring-offset-2',
        outlineButton:
          '!border-[#f97316] !text-[#f97316] hover:!bg-[#f97316]/10 focus-visible:!ring-[#f97316]/20 focus-visible:!ring-offset-2',
      }
    : {
        heading: 'text-dark-gray',
        body: 'text-text',
        primaryButton: '',
        outlineButton: '',
      };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="quote-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl animate-fade-in-up rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        <div className="mb-6 flex items-center gap-4 pr-10">
          {businessName === 'ClimateGuard HVAC' ? (
            <>
              <ClimateGuardLogoIcon className="w-16 h-16 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-r from-[#D32F2F] to-[#1976D2] bg-clip-text text-transparent">
                  CLIMATEGUARD
                </span>
                <span className="text-xs font-semibold text-gray-600 tracking-wide">
                  HVAC SPECIALISTS
                </span>
              </div>
            </>
          ) : businessName === 'ELECTRO PROS' ? (
            <>
              <ElectroProLogoIcon className="w-16 h-16 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900">
                  ELECTRO PROS
                </span>
                <span className="text-xs font-semibold text-gray-600 tracking-wide">
                  RELIABLE POWER SOLUTIONS
                </span>
              </div>
            </>
          ) : businessName === 'AQUAPRO SOLUTIONS' ? (
            <>
              <AquaProLogoIcon className="w-16 h-16 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900">
                  AQUAPRO SOLUTIONS
                </span>
                <span className="text-xs font-semibold text-gray-600 tracking-wide">
                  PLUMBING EXPERTS
                </span>
              </div>
            </>
          ) : logoSrc ? (
            <>
              <div className="rounded-lg bg-white p-2 shadow-sm flex-shrink-0">
                <Image
                  src={logoSrc}
                  alt={`${businessName} logo`}
                  width={64}
                  height={64}
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">{businessName}</p>
              </div>
            </>
          ) : null}
        </div>

        <h2
          id="quote-modal-title"
          className={cn('mb-2 text-2xl font-bold', themeClasses.heading)}
        >
          {variant === 'discount' ? 'Get 30% Off Your First 3 Months' :
           variant === 'access' ? 'Get Access to NeverMissLead' :
           'Get a Free Quote'}
        </h2>
        <p className={cn('mb-6 text-base', themeClasses.body)}>
          {variant === 'discount'
            ? 'Limited time offer! Fill out the form below to claim your discount and get started in 24 hours.'
            : variant === 'access'
            ? 'Fill out the form below to get access to our platform and see how it works for your business.'
            : 'Fill out the form below and we\'ll get back to you within 24 hours with a detailed estimate.'}
        </p>

        {submitStatus === 'success' ? (
          <div className="rounded-lg bg-green-50 p-8 text-center">
            <div className="mb-3 text-5xl">✓</div>
            <h3 className="mb-2 text-xl font-semibold text-green-800">
              Quote Request Received!
            </h3>
            <p className="mb-4 text-green-700">
              Thank you for your interest. We&apos;ll review your request and send you a detailed quote within 24 hours.
            </p>
            <Button
              onClick={handleClose}
              variant="primary"
              className={themeClasses.primaryButton}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput
              label="Your Name"
              {...register('fullName')}
              error={errors.fullName?.message}
              placeholder="John Smith"
              required
              disabled={isSubmitting}
            />

            <TextInput
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="(404) 555-0123"
              required
              disabled={isSubmitting}
            />

            <div className="bg-gray-50 rounded-lg p-4">
              <SMSOptInCheckbox
                checked={smsOptedIn}
                onChange={(checked) => setValue('smsOptedIn', checked, { shouldValidate: true })}
                error={errors.smsOptedIn?.message}
                disabled={isSubmitting}
              />
            </div>

            {!isDiscountForm && (
              <TextArea
                label="Tell Us About Your Needs"
                {...register('message')}
                error={(errors as any).message?.message}
                placeholder="Describe your issue or services you need"
                rows={5}
                required
                disabled={isSubmitting}
              />
            )}

            {submitStatus === 'error' && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                size="lg"
                className={cn('flex-1', themeClasses.outlineButton)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className={cn('flex-1', themeClasses.primaryButton)}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : (
                  variant === 'discount' ? 'Claim 30% Off' :
                  variant === 'access' ? 'Get Access Now' :
                  'Get Free Quote'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default QuoteModal;
