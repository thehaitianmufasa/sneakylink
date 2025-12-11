"use client";

import { Check, X } from 'lucide-react';

export function ValueStackVisualization() {
  const features = [
    { name: 'Custom Website Design', included: true },
    { name: 'Dedicated Phone Number', included: true },
    { name: 'Call Tracking & Recording', included: true },
    { name: 'SMS Auto-Reply (24/7)', included: true },
    { name: 'Email Lead Notifications', included: true },
    { name: 'Lead Dashboard', included: true },
    { name: 'Google Maps Integration', included: true },
    { name: 'Monthly Updates (1 hour)', included: true },
    { name: 'Mobile-Optimized Design', included: true },
    { name: 'SEO Optimization', included: true },
    { name: 'Form Submissions Tracking', included: true },
    { name: 'Professional Hosting', included: true },
  ];

  return (
    <section className="pt-[60px] pb-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            The True Cost of <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Doing It Yourself</span>
          </h2>
          <p className="text-xl text-gray-600">
            Stop paying for services you get for free with NeverMissLead
          </p>
        </div>

        {/* Comparison Table */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Hiring an Admin - The Anchor */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full">
                MOST EXPENSIVE
              </span>
            </div>
            <div className="text-center mb-6 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hiring a Receptionist</h3>
              <p className="text-sm text-gray-600 mb-4">The traditional approach</p>
              <div className="text-5xl font-black text-red-600 mb-2">$3,500</div>
              <div className="text-sm text-gray-600">/month + benefits</div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Answers calls during business hours</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500 line-through">24/7 availability</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500 line-through">Website included</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500 line-through">Call tracking & analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500 line-through">SMS automation</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-red-200">
              <p className="text-center text-sm font-semibold text-red-600">
                + Sick days, vacation, training, benefits
              </p>
            </div>
          </div>

          {/* DIY Website + Services */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">DIY Website + Tools</h3>
              <p className="text-sm text-gray-600 mb-4">Piecemeal approach</p>
              <div className="text-5xl font-black text-gray-700 mb-2">$643</div>
              <div className="text-sm text-gray-600">/month</div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-sm text-gray-700">Website builder: <span className="font-semibold">$29/mo</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm text-gray-700">Call tracking: <span className="font-semibold">$50/mo</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm text-gray-700">SMS platform: <span className="font-semibold">$45/mo</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm text-gray-700">Email service: <span className="font-semibold">$20/mo</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm text-gray-700">Analytics: <span className="font-semibold">$99/mo</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm text-gray-700">Your time (10 hrs): <span className="font-semibold">$400/mo</span></span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm font-semibold text-orange-600">
                + Hours of setup & maintenance
              </p>
            </div>
          </div>

          {/* NeverMissLead - The Winner */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-4 border-purple-500 rounded-2xl p-8 relative shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                BEST VALUE
              </span>
            </div>
            <div className="text-center mb-6 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">NeverMissLead</h3>
              <p className="text-sm text-gray-600 mb-4">All-in-one solution</p>
              <div className="mb-2">
                <span className="text-2xl text-gray-400 line-through">$643</span>
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">$297</div>
              <div className="text-sm text-gray-600">/month</div>
            </div>
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">{feature.name}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-purple-200">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-center text-lg font-bold text-green-600 mb-1">
                  Save $346/month
                </p>
                <p className="text-center text-sm text-gray-600">
                  = $4,152 saved per year
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Breakdown */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Everything Included. One Price.</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-semibold mb-2">💎 Total Value</p>
              <p className="text-3xl font-black">$643/month</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-semibold mb-2">💰 Your Price</p>
              <p className="text-3xl font-black">$297/month</p>
            </div>
          </div>
          <p className="mt-6 text-purple-100 text-lg">
            Custom Features • 24 Hour setup • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
