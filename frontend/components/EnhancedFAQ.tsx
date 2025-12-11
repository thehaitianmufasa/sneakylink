"use client";

import { useState } from 'react';
import { ChevronDown, CheckCircle2, DollarSign, Link as LinkIcon, Phone } from 'lucide-react';

export function EnhancedFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First question open by default

  const faqs = [
    {
      question: "What's the ROI? Is it really worth $297/month?",
      icon: <DollarSign className="w-6 h-6" />,
      color: "green",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-green-600">Short answer: One extra lead pays for the entire service.</strong>
          </p>
          <p className="text-gray-700 leading-relaxed">
            If your average job is worth $300, you only need to capture 1 additional lead per month to break even. Most contractors miss 47% of their calls, which means you&apos;re likely losing 15-20 leads per month right now.
          </p>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Real Example:</p>
            <p className="text-green-800 text-sm">
              Mike&apos;s Plumbing was missing 18 calls/month × $300 avg job = <strong>$5,400/month lost</strong>.
              After NeverMissLead: <strong>$5,400 captured - $297 service = $5,103 profit</strong>.
            </p>
          </div>
          <p className="text-gray-700">
            The service pays for itself with less than one job per month. Everything beyond that is pure profit.
          </p>
        </div>
      )
    },
    {
      question: "I already have a website. Can I still use this?",
      icon: <LinkIcon className="w-6 h-6" />,
      color: "blue",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-blue-600">Yes! We can integrate with your existing website OR give you a better one.</strong>
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Option 1: Keep Your Site
              </h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Add our call tracking number</li>
                <li>• Embed our SMS system</li>
                <li>• Connect our lead forms</li>
                <li>• Get the dashboard & notifications</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Option 2: Use Our Site
              </h4>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>• Faster loading (better SEO)</li>
                <li>• 100% mobile optimized</li>
                <li>• Conversion-focused design</li>
                <li>• We handle all updates</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700">
            Most clients switch to our sites because they convert better, but the choice is yours.
          </p>
        </div>
      )
    },
    {
      question: "I don't miss many calls. Do I still need this?",
      icon: <Phone className="w-6 h-6" />,
      color: "orange",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-orange-600">Most contractors think they don&apos;t miss many calls — until they see the data.</strong>
          </p>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="font-semibold text-orange-900 mb-2">Common Blind Spots:</p>
            <ul className="text-orange-800 text-sm space-y-2">
              <li>✗ Calls while you&apos;re on another job</li>
              <li>✗ After-hours calls (5pm - 8am)</li>
              <li>✗ Weekend calls when you&apos;re with family</li>
              <li>✗ Voicemails that never get returned</li>
              <li>✗ Web forms that go to spam</li>
              <li>✗ Text messages you forget to respond to</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-900 mb-3">Try Our Calculator:</p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openCalculatorModal'))}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition"
            >
              Calculate Your Actual Missed Calls →
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Industry average is 47% missed. Find out your real number.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "How fast can I get set up?",
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "purple",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-purple-600">24 hours for most clients. 48-72 hours if you need custom design work.</strong>
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
            <h4 className="font-bold text-purple-900 mb-3">Setup Timeline:</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold text-purple-900">15-Minute Setup Call</p>
                  <p className="text-sm text-purple-700">We gather your business info, logo, and preferences</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold text-purple-900">24 Hours: Site Built</p>
                  <p className="text-sm text-purple-700">We create your site, set up call tracking & SMS</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold text-purple-900">Your Review & Launch</p>
                  <p className="text-sm text-purple-700">You approve, we launch. Leads start coming in immediately.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      question: "What if I want to cancel?",
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "gray",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-gray-900">To ensure a seamless start, we move quickly once approved.</strong>
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Important Note:</p>
            <p className="text-blue-800 text-sm">
              Please note that all fees become final once development begins, as our team has already dedicated significant time to your custom solution.
            </p>
          </div>
          <p className="text-gray-700">
            We prioritize quality and speed to get your site live and capturing leads as quickly as possible.
          </p>
        </div>
      )
    },
    {
      question: "Do you offer custom features or integrations?",
      icon: <LinkIcon className="w-6 h-6" />,
      color: "blue",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-blue-600">Yes! We can integrate with most CRMs, scheduling tools, and payment systems.</strong>
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="font-semibold text-blue-900 text-sm">ServiceTitan</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="font-semibold text-blue-900 text-sm">Jobber</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="font-semibold text-blue-900 text-sm">Housecall Pro</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm">
            Custom integrations are available for an additional fee. Contact us to discuss your specific needs.
          </p>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
            ❓ Common Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-xl text-gray-600">
            Honest answers to the questions contractors ask most
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const colorClasses = {
              green: 'border-green-500 bg-green-50',
              blue: 'border-blue-500 bg-blue-50',
              orange: 'border-orange-500 bg-orange-50',
              purple: 'border-purple-500 bg-purple-50',
              gray: 'border-gray-500 bg-gray-50'
            };

            return (
              <div
                key={index}
                className={`border-2 rounded-xl overflow-hidden transition-all ${
                  isOpen ? colorClasses[faq.color as keyof typeof colorClasses] : 'border-gray-200 bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex-shrink-0 ${
                      isOpen ? 'text-' + faq.color + '-600' : 'text-gray-400'
                    }`}>
                      {faq.icon}
                    </div>
                    <span className="font-bold text-lg text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t-2 border-gray-200">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Below FAQ */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <p className="text-lg text-gray-700 mb-4">
            Still have questions? Let&apos;s talk.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openQuoteModal'))}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-600 transition shadow-lg hover:shadow-xl"
          >
            Book Your Free 15-Minute Setup Call
          </button>
          <p className="text-sm text-gray-500 mt-4">
            No pressure. No sales pitch. Just honest answers.
          </p>
        </div>
      </div>
    </section>
  );
}
