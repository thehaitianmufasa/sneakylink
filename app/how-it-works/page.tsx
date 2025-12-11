"use client";

import { useState } from 'react';
import Link from 'next/link';
import { QuoteModal } from '@frontend/components/forms/QuoteModal';

export default function HowItWorksPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  const scrollToStep1 = () => {
    const element = document.getElementById('step1');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --navy-900: #0f172a;
          --navy-800: #1e293b;
          --navy-700: #334155;
          --navy-600: #475569;
          --white: #ffffff;
          --gray-50: #f8fafc;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-400: #94a3b8;
          --gray-500: #64748b;
          --cta-primary: #f97316;
          --cta-hover: #ea580c;
          --success: #10b981;
          --success-light: #d1fae5;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { border-color: var(--gray-200); }
          50% { border-color: var(--cta-primary); }
        }

        @keyframes highlight {
          0%, 100% { border-color: var(--success); }
          50% { border-color: var(--cta-primary); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <path d="M20 4 L20 18 L14 14 L11 20 L9 19 L12 13 L6 13 L20 4 Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-2xl font-extrabold text-[#0f172a]">
                  Never<span className="text-[#f97316]">Miss</span>Lead
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-[#f8fafc] to-white text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0f172a] mb-6 leading-tight">
              From Missed Call to <span className="bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">Booked Job</span><br/>
              in Under 30 Seconds
            </h1>
            <p className="text-xl text-[#475569] mb-10 max-w-3xl mx-auto">
              See exactly how NeverMissLead captures leads while you&apos;re on the job—no missed opportunities, no complicated setup.
            </p>
            <div
              onClick={scrollToStep1}
              className="inline-flex items-center gap-2 text-[#f97316] font-semibold text-lg cursor-pointer"
              style={{animation: 'bounce 2s infinite'}}
            >
              👇 See How It Works
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto space-y-20">

            {/* Step 1: Lead Comes In */}
            <div id="step1" className="py-20 border-b border-gray-200">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="w-14 h-14 bg-[#f97316] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6">
                    1
                  </div>
                  <h2 className="text-4xl font-extrabold text-[#0f172a] mb-4">Customer Finds You Online</h2>
                  <p className="text-lg text-[#475569] mb-4 leading-relaxed">
                    A potential customer searches for your services at 2 PM on Tuesday. They find your website and fill out the contact form while you&apos;re mid-job at a client site.
                  </p>
                  <p className="text-base text-[#f97316] font-semibold">
                    Without NeverMissLead: They call 3 other businesses who answer immediately.
                  </p>
                </div>
                <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-8 shadow-lg">
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200" style={{animation: 'pulse 2s infinite'}}>
                    <h3 className="text-xl font-bold text-[#0f172a] mb-5">Your Contact Form</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#334155] mb-2">Full Name</label>
                        <input type="text" placeholder="John Martinez" disabled className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#334155] mb-2">Phone Number</label>
                        <input type="text" placeholder="(555) 234-5678" disabled className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#334155] mb-2">Service Needed</label>
                        <input type="text" placeholder="Service request details" disabled className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#334155] mb-2">When do you need service?</label>
                        <input type="text" placeholder="ASAP - Today if possible" disabled className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <button className="w-full bg-[#f97316] text-white px-4 py-3 rounded-lg font-semibold">
                        Submit Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Instant SMS Response */}
            <div className="py-20 border-b border-gray-200">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl max-w-sm mx-auto">
                    <div className="bg-[#0f172a] rounded-[40px] p-4">
                      <div className="bg-white rounded-[32px] overflow-hidden">
                        <div className="bg-[#f8fafc] py-4 text-center border-b border-gray-200">
                          <div className="text-sm font-semibold text-[#0f172a]">2:03 PM</div>
                        </div>
                        <div className="p-6">
                          <div className="text-center text-xs text-[#64748b] mb-5">Messages</div>
                          <div className="bg-[#d1fae5] border border-[#10b981] rounded-3xl rounded-bl-sm p-4 mb-4" style={{animation: 'slideIn 0.5s ease-out'}}>
                            <div className="text-sm text-[#0f172a] leading-relaxed">
                              Hi <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">John</span>! 👋<br/><br/>
                              Thanks for reaching out to <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">Your Business Name</span>.<br/><br/>
                              We received your request for <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">your service</span> and we&apos;ll call you within <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">2 hours</span> to discuss details.<br/><br/>
                              For urgent matters, call: <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">(555) 123-4567</span><br/><br/>
                              - <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">Your Name & Team</span>
                            </div>
                            <div className="text-xs text-[#64748b] mt-3">Delivered 2:03 PM</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="w-14 h-14 bg-[#f97316] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6">
                    2
                  </div>
                  <h2 className="text-4xl font-extrabold text-[#0f172a] mb-4">Instant Professional Response</h2>
                  <p className="text-lg text-[#475569] mb-4 leading-relaxed">
                    Within 30 seconds, your AI assistant sends a personalized SMS confirmation. The customer knows you received their request and feels taken care of.
                  </p>
                  <p className="text-base text-[#10b981] font-semibold mb-4">
                    ✓ You captured the lead while your competitors are still checking voicemail.
                  </p>
                  <p className="text-sm text-[#64748b]">
                    <strong>Note:</strong> SMS templates are fully customizable to match your business tone and services.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2.5: Missed Call Flow */}
            <div className="py-20 border-b border-gray-200">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="w-14 h-14 bg-[#334155] text-white rounded-2xl flex items-center justify-center text-2xl mb-6">
                    📞
                  </div>
                  <h2 className="text-4xl font-extrabold text-[#0f172a] mb-4">Even Missed Calls Get Instant Follow-Up</h2>
                  <p className="text-lg text-[#475569] mb-4 leading-relaxed">
                    Customer calls while you&apos;re on a ladder? No problem. When they leave a voicemail, our system automatically sends them a professional SMS response confirming you&apos;ll call back.
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="text-base text-[#10b981] font-semibold">
                      ✓ You get instant email and SMS notification with caller details
                    </p>
                    <p className="text-base text-[#10b981] font-semibold">
                      ✓ Customer gets immediate response instead of wondering if you got their message
                    </p>
                  </div>
                  <p className="text-sm text-[#64748b]">
                    <strong>How it works:</strong> Call tracking detects voicemail → Auto-SMS to customer → You get email + SMS with caller info and voicemail transcription.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl max-w-sm mx-auto">
                  <div className="bg-[#0f172a] rounded-[40px] p-4">
                    <div className="bg-white rounded-[32px] overflow-hidden">
                      <div className="bg-[#f8fafc] py-4 text-center border-b border-gray-200">
                        <div className="text-sm font-semibold text-[#0f172a]">3:47 PM</div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="text-center text-xs text-[#64748b] mb-4">Messages</div>

                        <div className="bg-[#f1f5f9] rounded-xl p-3 text-center text-xs text-[#475569]">
                          📞 Missed Call Detected<br/>
                          Voicemail left at 3:45 PM
                        </div>

                        <div className="bg-[#d1fae5] border border-[#10b981] rounded-3xl rounded-bl-sm p-4">
                          <div className="text-sm text-[#0f172a] leading-relaxed">
                            Hi there! 👋<br/><br/>
                            Thanks for calling <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">Your Business Name</span>. We&apos;re currently with another client but got your message.<br/><br/>
                            We&apos;ll call you back within <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">1-2 hours</span>.<br/><br/>
                            - <span className="bg-[#f1f5f9] border-2 border-dashed border-[#f97316] px-2 py-1 rounded font-semibold text-[#f97316] text-xs">Your Name & Team</span>
                          </div>
                          <div className="text-xs text-[#64748b] mt-3">Auto-sent 3:47 PM</div>
                        </div>

                        <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4">
                          <div className="text-xs font-semibold text-[#334155] mb-2">📧 You Also Receive:</div>
                          <div className="text-xs text-[#475569] leading-relaxed space-y-1">
                            <div>• Email with caller info</div>
                            <div>• SMS notification to your phone</div>
                            <div>• Voicemail transcription</div>
                            <div>• Lead added to dashboard</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Dashboard Notification */}
            <div className="py-20 border-b border-gray-200">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="w-14 h-14 bg-[#f97316] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6">
                    3
                  </div>
                  <h2 className="text-4xl font-extrabold text-[#0f172a] mb-4">You Get Notified Instantly</h2>
                  <p className="text-lg text-[#475569] mb-6 leading-relaxed">
                    The lead appears in your dashboard with every detail organized—name, service needed, urgency level, and contact info. Access it from your phone during your lunch break or review all leads at the end of the day.
                  </p>
                  <button
                    onClick={() => alert('Dashboard demo requires login. Contact us for a personalized walkthrough!')}
                    className="bg-[#f97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition shadow-lg"
                  >
                    View Example Dashboard →
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="bg-[#0f172a] px-6 py-4 flex justify-between items-center">
                    <div className="text-lg font-bold text-white">Lead Dashboard</div>
                    <div className="bg-[#f97316] text-white px-3 py-1 rounded-full text-xs font-bold" style={{animation: 'pulse 2s infinite'}}>
                      🔔 New Lead
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-[#f8fafc] border-2 border-[#10b981] rounded-xl p-6" style={{animation: 'highlight 2s infinite'}}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-xl font-bold text-[#0f172a]">John Martinez</div>
                          <div className="text-xs text-[#64748b] mt-1">2 minutes ago</div>
                        </div>
                        <div className="bg-[#d1fae5] text-[#10b981] px-3 py-1 rounded-full text-xs font-semibold">
                          Auto-SMS Sent
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-[#475569]">
                          <span className="text-[#f97316]">📞</span>
                          (555) 234-5678
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#475569]">
                          <span className="text-[#f97316]">🔧</span>
                          Service request details
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#475569]">
                          <span className="text-[#f97316]">⏰</span>
                          ASAP - Today if possible
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#475569]">
                          <span className="text-[#f97316]">📍</span>
                          Atlanta, GA 30308
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-5 text-sm text-[#64748b]">
                      + 12 more leads captured this week
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Professional Website */}
            <div className="py-20">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                    <div className="bg-[#e2e8f0] px-4 py-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1 bg-white px-3 py-1.5 rounded-md text-xs text-[#64748b] ml-3">
                        yourwebsite.com
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-[#f8fafc] to-white p-12 text-center min-h-[400px] flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Your Professional Website</h3>
                      <p className="text-base text-[#475569] mb-6">
                        Mobile-optimized, service pages, contact forms, and call tracking—all set up in under 24 hours.
                      </p>
                      <div className="text-sm text-[#64748b] space-y-2">
                        <div>✓ Custom branding</div>
                        <div>✓ Lead capture forms</div>
                        <div>✓ Call tracking built-in</div>
                        <div>✓ SMS automation connected</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="w-14 h-14 bg-[#f97316] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6">
                    4
                  </div>
                  <h2 className="text-4xl font-extrabold text-[#0f172a] mb-4">Professional Website Included</h2>
                  <p className="text-lg text-[#475569] mb-6 leading-relaxed">
                    We build your mobile-optimized website with service pages, contact forms, call tracking, and SMS automation—all connected and ready to capture leads 24/7.
                  </p>
                  <a
                    href="https://www.nevermisslead.com/hvac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#f97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition shadow-lg mb-4"
                  >
                    See Live Demo Website →
                  </a>
                  <p className="text-sm text-[#64748b]">
                    <strong>What&apos;s included:</strong> Custom domain, SSL security, mobile-responsive design, service pages, contact forms with SMS automation, call tracking, and monthly updates.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 px-4 bg-[#0f172a] text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-extrabold mb-4">Go Live in Under 24 Hours</h2>
              <p className="text-xl text-[#94a3b8]">From signup to your first captured lead—here&apos;s the complete timeline</p>
            </div>

            <div className="max-w-4xl mx-auto relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#334155] hidden lg:block"></div>

              <div className="space-y-16">
                {[
                  { time: 'Hour 1', title: 'You Submit Contact Form', desc: 'Receive instant email and SMS confirmation. We begin setup immediately.' },
                  { time: 'Hours 2-12', title: 'We Build Your System', desc: 'Custom website creation, SMS automation setup, call tracking integration, and lead dashboard configuration.' },
                  { time: 'Hours 13-24', title: 'Final Testing & Go Live', desc: 'Quality assurance, test lead capture, verify SMS responses, and send you login credentials.' },
                  { time: 'Hour 24+', title: 'You\'re Capturing Leads 24/7', desc: 'Your virtual receptionist is live, responding to every inquiry while you focus on the work you do best.' }
                ].map((item, idx) => (
                  <div key={idx} className="grid lg:grid-cols-2 gap-16 relative">
                    <div className="absolute left-1/2 top-6 w-6 h-6 bg-[#f97316] border-4 border-[#0f172a] rounded-full -ml-3 hidden lg:block z-10"></div>
                    <div className={`bg-[#1e293b] border border-[#334155] rounded-xl p-8 ${idx % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-2'}`}>
                      <div className="text-sm font-bold text-[#f97316] mb-3">{item.time}</div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-[#94a3b8]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 bg-gradient-to-b from-white to-[#f8fafc] text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-extrabold text-[#0f172a] mb-10">Want this set up for your business?</h2>
            <button
              onClick={openQuoteModal}
              className="bg-[#f97316] text-white px-10 py-5 rounded-lg font-bold text-xl hover:bg-[#ea580c] transition shadow-2xl hover:shadow-3xl"
            >
              Yes, Set Me Up!
            </button>
          </div>
        </section>
      </main>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
        businessName="NeverMissLead"
        theme="landing"
        variant="quote"
      />
    </>
  );
}
