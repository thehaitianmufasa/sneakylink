"use client";

import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import Image from 'next/image';

export function EnhancedSocialProof() {
  const caseStudies = [
    {
      business: "Rodriguez & Sons Plumbing",
      owner: "Marcus R.",
      industry: "Plumbing",
      icon: "🔧",
      image: "/images/testimonials/marcus-plumbing.png",
      beforeLeads: 0,
      afterLeads: 47,
      monthlyRevenue: 14100,
      highlight: "Added Monthly Revenue",
      color: "blue",
      quote: "We went from missing every after-hours call to capturing 100% of leads. The ROI was immediate."
    },
    {
      business: "Summit Heating & Air",
      owner: "David K.",
      industry: "HVAC",
      icon: "❄️",
      image: "/images/testimonials/david-hvac.png",
      savedMoney: 4200,
      paybackDays: 8,
      highlight: "Paid for the service in 8 days",
      color: "green",
      quote: "I was skeptical until I saw the dashboard. We were losing $4,200/month in missed calls. Now we capture every single one."
    },
    {
      business: "Precision Electric Co.",
      owner: "James T.",
      industry: "Electrical",
      icon: "⚡",
      image: "/images/testimonials/james-electrical.png",
      responseRate: "3X",
      bookingIncrease: "2X",
      highlight: "Doubled Estimate Bookings",
      color: "purple",
      quote: "The SMS auto-reply alone is worth the price. Customers love getting instant responses, even at 2 AM."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
            ✓ Verified Results
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Proof That <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">100% Lead Capture</span> is Possible
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real contractors. Real results. Real revenue growth.
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${
                study.color === 'blue' ? 'from-blue-500 to-blue-600' :
                study.color === 'green' ? 'from-green-500 to-green-600' :
                'from-purple-500 to-purple-600'
              } p-6 text-white`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={study.image}
                      alt={`${study.owner} - ${study.business}`}
                      width={64}
                      height={64}
                      className="rounded-full object-cover border-2 border-white shadow-lg"
                    />
                  </div>
                  <div className="text-4xl">{study.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{study.business}</h3>
                <p className="text-sm opacity-90">{study.owner}, Owner</p>
              </div>

              {/* Stats */}
              <div className="p-6">
                {study.beforeLeads !== undefined && (
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-3 mb-2">
                      <span className="text-gray-400 text-2xl font-bold line-through">{study.beforeLeads}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-5xl font-black text-green-600">{study.afterLeads}</span>
                    </div>
                    <p className="text-center text-gray-600 font-medium">captured leads/month</p>
                  </div>
                )}

                {study.monthlyRevenue && (
                  <div className="bg-green-50 rounded-xl p-4 mb-6 border-2 border-green-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-3xl font-black text-green-600">
                        ${study.monthlyRevenue.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-center text-sm font-semibold text-green-700">
                      {study.highlight}
                    </p>
                  </div>
                )}

                {study.savedMoney && (
                  <div className="bg-green-50 rounded-xl p-4 mb-6 border-2 border-green-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-3xl font-black text-green-600">
                        ${study.savedMoney.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700">
                        {study.highlight}
                      </span>
                    </div>
                  </div>
                )}

                {study.responseRate && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="text-2xl font-black text-purple-600 mb-1">
                        {study.responseRate}
                      </div>
                      <div className="text-xs text-purple-700 font-medium">
                        Response Rate
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="text-2xl font-black text-purple-600 mb-1">
                        {study.bookingIncrease}
                      </div>
                      <div className="text-xs text-purple-700 font-medium">
                        More Bookings
                      </div>
                    </div>
                  </div>
                )}

                {/* Quote */}
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    &quot;{study.quote}&quot;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Logos Placeholder */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 font-medium mb-6">Trusted by contractors in:</p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
            <span>Atlanta</span>
            <span>•</span>
            <span>Phoenix</span>
            <span>•</span>
            <span>Dallas</span>
            <span>•</span>
            <span>Miami</span>
            <span>•</span>
            <span>Chicago</span>
            <span>•</span>
            <span>Denver</span>
          </div>
        </div>
      </div>
    </section>
  );
}
