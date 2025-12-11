"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Phone, Mail } from 'lucide-react';
import { QuoteModal } from '@frontend/components/forms/QuoteModal';

export default function PricingPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  const features = [
    { name: 'Custom Professional Website', included: true },
    { name: 'Mobile-Responsive Design', included: true },
    { name: 'Dedicated Phone Number', included: true },
    { name: 'Call Tracking & Forwarding', included: true },
    { name: 'Voicemail Recording', included: true },
    { name: 'SMS Auto-Response', included: true },
    { name: 'Email Notifications', included: true },
    { name: 'Lead Dashboard', included: true },
    { name: 'Google Maps Integration', included: true },
    { name: 'Contact Forms', included: true },
    { name: 'Custom Branding (Logo & Colors)', included: true },
    { name: 'Service Area Pages', included: true },
    { name: 'Business Hours Display', included: true },
    { name: 'Testimonials Section', included: true },
    { name: 'FAQ Section', included: true },
    { name: 'SSL Certificate (Secure)', included: true },
    { name: 'Fast Hosting on Vercel', included: true },
    { name: 'SEO Optimized', included: true },
    { name: '24/7 Uptime Monitoring', included: true },
    { name: '1 Hour/Month of Updates', included: true }
  ];

  const addOns = [
    { name: 'Additional Hours', price: '$60/hour', desc: 'Beyond the included 1 hour/month' },
    { name: 'Custom Domain Setup', price: '$15 one-time', desc: 'If you need us to purchase a domain' },
    { name: 'Logo Design', price: '$100 one-time', desc: 'If you don\'t have a logo yet' }
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-lg mr-3"></div>
                <span className="text-2xl font-bold text-[#0f172a]">NeverMissLead</span>
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-orange-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] mb-6">
              Simple, <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent">Transparent</span> Pricing
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Everything you need to capture leads 24/7. No hidden fees. No upsells.
            </p>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border-2 border-[#f97316] rounded-2xl shadow-2xl overflow-hidden">
              {/* Badge */}
              <div className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-center py-3 px-4">
                <span className="font-semibold">⚡ Most Popular Plan</span>
              </div>

              {/* Pricing Header */}
              <div className="p-8 md:p-12 text-center border-b border-gray-200">
                <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Complete Lead Capture System</h2>
                <div className="mb-6">
                  <span className="text-6xl font-extrabold text-transparent bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text">
                    $297
                  </span>
                  <span className="text-2xl text-gray-600">/month</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-lg font-semibold text-green-800">
                    Setup Fee: <span className="line-through text-gray-500">$497</span> <span className="text-2xl">FREE</span>
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    with 6-month commitment
                  </p>
                </div>
                <div className="text-gray-600">
                  <p className="mb-2">✅ No contracts after 6 months</p>
                  <p>✅ Cancel anytime (after initial commitment)</p>
                </div>
              </div>

              {/* Features List */}
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Everything Included:</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-gray-700">{feature.name}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={openQuoteModal}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 text-base md:px-8 md:py-4 rounded-lg md:text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Get Access Now <ArrowRight className="w-5 h-5" />
                  </button>
                  <a
                    href="tel:+16787887281"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#f97316] px-6 py-3 text-base md:px-8 md:py-4 rounded-lg md:text-lg font-semibold border-2 border-[#f97316] hover:bg-orange-50 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call (678) 788-7281
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add-Ons */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Optional Add-Ons
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {addOns.map((addon, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{addon.name}</h3>
                  <div className="text-2xl font-bold text-[#f97316] mb-3">{addon.price}</div>
                  <p className="text-gray-600 text-sm">{addon.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Comparison */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Compare the Value
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* DIY Approach */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-red-900 mb-6">❌ DIY Approach</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Website builder: $30-50/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Phone tracking service: $40-80/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Email service: $15-30/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>SMS service: $20-40/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Your time to set up: 20-40 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Your time to maintain: 2-4 hours/month</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t-2 border-red-300">
                  <div className="text-3xl font-bold text-red-900">$105-200/mo</div>
                  <div className="text-sm text-red-700 mt-1">Plus your valuable time</div>
                </div>
              </div>

              {/* NeverMissLead */}
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-6">✅ NeverMissLead</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Professional website included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Phone tracking & forwarding included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Email notifications included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>SMS auto-response included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Setup time: 0 hours (we do it)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Maintenance: 0 hours (we handle it)</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t-2 border-green-300">
                  <div className="text-3xl font-bold text-green-900">$297/mo</div>
                  <div className="text-sm text-green-700 mt-1">Everything handled for you</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-xl text-gray-600 mb-6">
                💰 Save time, money, and headaches. Focus on your business, not tech.
              </p>
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-16 md:py-20 bg-[#0f172a] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Return on Investment
            </h2>
            <p className="text-xl mb-12 text-[#94a3b8]">
              If NeverMissLead captures just <span className="font-bold text-[#f97316]">ONE extra lead per month</span>, it pays for itself.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">1</div>
                <div className="text-sm text-[#94a3b8]">Extra Lead/Month</div>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">$500+</div>
                <div className="text-sm text-[#94a3b8]">Average Job Value</div>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">$203+</div>
                <div className="text-sm text-[#94a3b8]">Net Profit After $297</div>
              </div>
            </div>
            <p className="text-lg mt-12 text-[#94a3b8]">
              Most customers capture <span className="font-bold text-[#f97316]">5-10+ extra leads/month</span>. Do the math. 🚀
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Is there a contract?',
                  a: 'Yes, we require a 6-month commitment to waive the $497 setup fee. After 6 months, you can cancel anytime with 30 days notice.'
                },
                {
                  q: 'What happens after the first hour of updates each month?',
                  a: 'Additional hours are billed at $60/hour. Most clients never need extra hours.'
                },
                {
                  q: 'Can I use my own domain name?',
                  a: 'Absolutely! If you already have a domain, we\'ll help you connect it for free. If you need a new domain, we can purchase one for $15.'
                },
                {
                  q: 'Do I own the website?',
                  a: 'The website is hosted and maintained by us as long as you\'re a subscriber. If you cancel, we can export your content for a fee.'
                },
                {
                  q: 'How fast is the setup?',
                  a: 'Most websites are live within 24-48 hours. We just need your business info, logo, and photos.'
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'All Sales are final once work begins.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Capture Every Lead?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 200+ local businesses that never miss an opportunity
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openQuoteModal}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 text-base md:px-8 md:py-4 rounded-lg md:text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Get Access Now <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/#solutions"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 text-base md:px-8 md:py-4 rounded-lg md:text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
              >
                View Live Demos
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1e293b] text-white py-8 border-t border-[#334155]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#94a3b8] text-sm">
              © 2025 NeverMissLead. All rights reserved. | Powered by <a href="https://cherysolutions.com" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:text-[#fb923c] transition">Chery Solutions</a>
            </p>
          </div>
        </footer>
      </div>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
        businessName="NeverMissLead"
        theme="landing"
        variant="access"
      />
    </>
  );
}
