"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Phone, MessageSquare, Mail, MapPin, Clock, Shield } from 'lucide-react';
import { QuoteModal } from '@frontend/components/forms/QuoteModal';

export default function AboutPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path d="M20 4 L20 18 L14 14 L11 20 L9 19 L12 13 L6 13 L20 4 Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-[#0f172a] ml-3">
                Never<span className="text-[#f97316]">Miss</span>Lead
              </span>
            </Link>
            <Link
              href="/"
              className="text-[#475569] hover:text-[#0f172a] font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] mb-6">
            What is <span className="bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">NeverMissLead</span>?
          </h1>
          <p className="text-xl md:text-2xl text-[#475569] leading-relaxed">
            We build professional websites for local businesses that capture every single customer who contacts you—no matter how they reach out.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The Problem</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Imagine you run a plumbing business. Someone&apos;s pipe bursts at 2 AM. They Google &quot;emergency plumber near me&quot; and find your competitor—not you—because you don&apos;t have a website.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Or worse: You DO have a website, but when customers call, your phone goes to voicemail. When they text you, no response. When they fill out a contact form, it disappears into the void.
            </p>
            <div className="mt-6 text-2xl font-bold text-red-600">
              💸 You just lost $500+ in revenue.
            </div>
          </div>

          {/* The Solution */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The Solution</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              NeverMissLead gives you a beautiful, professional website that works 24/7 to capture every lead:
            </p>
            <ul className="space-y-4">
              {[
                'When someone calls, we forward it to your phone (and record voicemails)',
                'When someone texts, we send an automatic reply and notify you immediately',
                'When someone fills out a form, you get an email AND text alert',
                'Everything is tracked in one simple dashboard—no tech skills needed'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            How It Works (So Simple a 12-Year-Old Can Understand)
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Build Your Site</h3>
              <p className="text-gray-600">
                In 24 hours, we create a professional website with your business name, logo, services, and photos.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customers Find You</h3>
              <p className="text-gray-600">
                Your website shows up on Google. People call, text, or fill out forms to request your services.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You Get Notified</h3>
              <p className="text-gray-600">
                Every lead is captured. You get instant alerts via email and text—never miss another opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] text-center mb-12">
            Everything You Get
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: 'Dedicated Phone Number', desc: 'Get a local number that forwards to your phone with call tracking' },
              { icon: MessageSquare, title: 'SMS Auto-Response', desc: 'Automatic text replies so customers know you got their message' },
              { icon: Mail, title: 'Email Notifications', desc: 'Instant alerts every time someone contacts you' },
              { icon: MapPin, title: 'Google Maps', desc: 'Interactive map showing your service areas' },
              { icon: Clock, title: '24/7 Availability', desc: 'Your website never sleeps—capture leads around the clock' },
              { icon: Shield, title: 'Professional Design', desc: 'Beautiful, mobile-friendly site that builds trust' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow hover:border-[#f97316]">
                <feature.icon className="w-12 h-12 text-[#f97316] mb-4" />
                <h3 className="text-lg font-bold text-[#0f172a] mb-2">{feature.title}</h3>
                <p className="text-[#475569] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-16 md:py-20 bg-[#0f172a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Perfect For Local Service Businesses
          </h2>
          <p className="text-xl mb-8 text-[#94a3b8]">
            If customers call, text, or need to find you online—this is for you:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[
              '🔧 Plumbers & Electricians',
              '❄️ HVAC & Appliance Repair',
              '🏠 Roofing & Construction',
              '🚗 Auto Repair & Towing',
              '💉 Medical & Dental Offices',
              '📋 Insurance Agents',
              '🏊 Pool Service & Landscaping',
              '🐕 Pet Services & Grooming'
            ].map((industry, idx) => (
              <div key={idx} className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 font-medium hover:border-[#f97316] transition-colors">
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-6">
            Simple Pricing, No Surprises
          </h2>
          <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text mb-4">
            $297/month
          </div>
          <p className="text-xl text-[#475569] mb-8">
            Setup Fee: $497 (or FREE with 6-month commitment)
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-[#f97316] text-white px-6 py-3 text-base md:px-8 md:py-4 rounded-lg md:text-lg font-semibold hover:bg-[#ea580c] transition shadow-lg"
          >
            See Full Pricing Details <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-6">
            Ready to Stop Missing Leads?
          </h2>
          <p className="text-xl text-[#475569] mb-8">
            Get started today with our exclusive 30% discount offer
          </p>
          <button
            onClick={openQuoteModal}
            className="inline-flex items-center gap-2 bg-[#f97316] text-white px-6 py-3 text-base md:px-8 md:py-4 rounded-lg md:text-lg font-semibold hover:bg-[#ea580c] transition shadow-lg"
          >
            Get Access Now <ArrowRight className="w-5 h-5" />
          </button>
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

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
        businessName="NeverMissLead"
        theme="landing"
        variant="discount"
      />
    </div>
  );
}
