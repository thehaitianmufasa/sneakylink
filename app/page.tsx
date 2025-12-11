"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QuoteModal } from '@frontend/components/forms/QuoteModal';
import { CountdownTimer } from '@frontend/components/ui/countdown-timer';
import { PricingToggle } from '@frontend/components/ui/pricing-toggle';
import { AnnouncementBanner } from '@frontend/components/ui/announcement-banner';

export default function HomePage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [modalVariant, setModalVariant] = useState<'discount' | 'access' | 'quote'>('quote');
  const [showStickyBar, setShowStickyBar] = useState(false);

  const openQuoteModal = (variant: 'discount' | 'access' | 'quote' = 'discount') => {
    setModalVariant(variant);
    setIsQuoteModalOpen(true);
    setShowStickyBar(false); // Hide sticky bar when modal opens
  };
  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
    // Sticky bar will re-appear based on scroll position
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px'
    });

    document.querySelectorAll('[data-target]').forEach(counter => {
      observer.observe(counter.closest('.result-card, .hero-stats, .dashboard-mockup') as Element);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll trigger for sticky CTA bar
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show sticky bar only after scrolling down 300px and when modal is closed
      if (currentScrollY > 300 && !isQuoteModalOpen) {
        setShowStickyBar(true);
      } else if (currentScrollY <= 300) {
        setShowStickyBar(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isQuoteModalOpen]);

  // Counter animation
  useEffect(() => {
    const animateValue = (element: Element, start: number, end: number, duration: number) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;

        if (end % 1 === 0) {
          element.textContent = Math.floor(value).toString();
        } else {
          element.textContent = value.toFixed(1);
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('[data-target]');
          counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target') || '0');
            animateValue(counter, 0, target, 2000);
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const heroStats = document.querySelector('.hero-stats');
    const resultsSection = document.querySelector('.results-section');
    const dashboard = document.querySelector('.dashboard-mockup');

    if (heroStats) observer.observe(heroStats);
    if (resultsSection) observer.observe(resultsSection);
    if (dashboard) observer.observe(dashboard);

    return () => observer.disconnect();
  }, []);

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
          --cta-glow: rgba(249, 115, 22, 0.3);
          --success: #10b981;
          --success-light: #d1fae5;
          --accent-blue: #3b82f6;
          --accent-blue-light: #dbeafe;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <main className="min-h-screen bg-white">
        {/* Announcement Banner */}
        <AnnouncementBanner onClick={scrollToHowItWorks} />

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#f97316] rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none">
                    <path d="M20 4 L20 18 L14 14 L11 20 L9 19 L12 13 L6 13 L20 4 Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xl md:text-2xl font-extrabold text-[#0f172a]">
                  Never<span className="text-[#f97316]">Miss</span>Lead
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-[#475569] hover:text-[#0f172a] font-medium text-sm transition">Features</a>
                <a href="#how-it-works" className="text-[#475569] hover:text-[#0f172a] font-medium text-sm transition">How It Works</a>
                <a href="#results" className="text-[#475569] hover:text-[#0f172a] font-medium text-sm transition">Results</a>
                <a href="#pricing" className="text-[#475569] hover:text-[#0f172a] font-medium text-sm transition">Pricing</a>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/admin/login" className="text-[#475569] hover:text-[#0f172a] font-semibold text-sm transition">
                  Sign In
                </Link>
                <button
                  onClick={() => openQuoteModal('discount')}
                  className="bg-[#f97316] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-sm hover:bg-[#ea580c] transition shadow-md hover:shadow-lg"
                >
                  Get 30% Off
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-12 md:py-20 px-6 md:px-4 bg-gradient-to-b from-[#f8fafc] to-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Hero Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[#d1fae5] border border-[#10b981] px-4 py-2 rounded-full text-sm font-semibold text-[#10b981] mb-6">
                  <span>✓</span> Trusted by 2,500+ Service Businesses
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f172a] mb-4 md:mb-6 leading-tight tracking-tight">
                  <span className="block mb-2">Stop losing leads.</span>
                  <span className="block bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">
                    Start turning calls
                  </span>
                  <span className="block bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">
                    into revenue.
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-[#475569] mb-6 md:mb-8 leading-relaxed max-w-lg px-4 md:px-0">
                  24/7 lead capture & instant SMS follow-up for service businesses.
                </p>

                <div className="mb-6 md:mb-8 px-4 md:px-0">
                  <button
                    onClick={() => openQuoteModal('access')}
                    className="w-full md:w-auto bg-[#f97316] text-white px-8 py-4 md:py-4 rounded-lg font-bold text-lg hover:bg-[#ea580c] transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    See How It Works →
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 text-sm text-[#64748b] px-4 md:px-0">
                  <span className="flex items-center gap-2">
                    <span className="text-[#10b981] font-bold">✓</span> No credit card required
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-[#10b981] font-bold">✓</span> Setup in 24 hours
                  </span>
                </div>

                {/* Hero Stats */}
                <div className="hero-stats flex gap-10 pt-8 mt-8 border-t border-gray-200">
                  <div>
                    <div className="text-3xl font-extrabold text-[#0f172a]">
                      <span data-target="47">0</span>
                    </div>
                    <div className="text-sm text-[#64748b] mt-1">% More leads captured</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-[#0f172a]">
                      &lt;<span data-target="30">0</span>s
                    </div>
                    <div className="text-sm text-[#64748b] mt-1">Response time</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-[#0f172a]">
                      $<span data-target="8.4">0</span>K
                    </div>
                    <div className="text-sm text-[#64748b] mt-1">Avg. revenue increase</div>
                  </div>
                </div>
              </div>

              {/* Hero Visual - Countdown + Dashboard */}
              <div className="space-y-6">
                <CountdownTimer />

                {/* Dashboard Mockup */}
                <div className="dashboard-mockup bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="bg-[#1e293b] px-4 py-3 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-6 bg-[#f8fafc]">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <div className="text-xs text-[#64748b] uppercase mb-2">New Leads Today</div>
                        <div className="text-4xl font-extrabold text-[#0f172a]" data-target="14">0</div>
                        <div className="text-xs text-[#10b981] bg-[#d1fae5] inline-block px-2 py-1 rounded mt-2">↑ 32% vs last week</div>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <div className="text-xs text-[#64748b] uppercase mb-2">Response Time</div>
                        <div className="text-4xl font-extrabold text-[#0f172a]"><span data-target="28">0</span>s</div>
                        <div className="text-xs text-[#10b981] bg-[#d1fae5] inline-block px-2 py-1 rounded mt-2">↓ 71% faster</div>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <div className="text-xs text-[#64748b] uppercase mb-2">Close Rate</div>
                        <div className="text-4xl font-extrabold text-[#0f172a]"><span data-target="34">0</span>%</div>
                        <div className="text-xs text-[#10b981] bg-[#d1fae5] inline-block px-2 py-1 rounded mt-2">↑ 18% this month</div>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <div className="text-xs text-[#64748b] uppercase mb-2">Revenue</div>
                        <div className="text-4xl font-extrabold text-[#0f172a]">$<span data-target="18.2">0</span>K</div>
                        <div className="text-xs text-[#10b981] bg-[#d1fae5] inline-block px-2 py-1 rounded mt-2">↑ $4.8K vs last month</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification */}
                <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-200 flex items-center gap-3" style={{animation: 'float 3s ease-in-out infinite'}}>
                  <div className="w-10 h-10 bg-[#d1fae5] rounded-lg flex items-center justify-center text-xl">📞</div>
                  <div>
                    <div className="font-bold text-sm text-[#0f172a]">New Lead Captured!</div>
                    <div className="text-xs text-[#64748b]">Auto-text sent in 12 seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Logos */}
        <section className="py-12 md:py-16 px-6 md:px-4 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-12">
              {['CoolAir HVAC', 'Spark Electric', 'Summit Roofing', 'Miller & Associates', 'Precision Medical', 'AutoCare Plus',
                'Crystal Pools', 'GreenScape', 'SecureLife', 'Elite Dental', 'QuickTow', 'ProFlow'].map((logo, idx) => (
                <div key={idx} className="text-xl font-bold text-[#334155] opacity-50 hover:opacity-100 transition-all hover:-translate-y-1 cursor-default">
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section id="results" className="results-section py-12 md:py-24 px-6 md:px-4 bg-[#0f172a] text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-[#f97316]/15 border border-[#f97316]/30 px-4 py-2 rounded-full text-xs text-[#f97316] font-semibold uppercase tracking-wide mb-4">
                Proven Results
              </div>
              <h2 className="text-5xl font-extrabold">Real numbers from real businesses</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: '🚀', value: '2500', label: 'Active Businesses' },
                { icon: '📈', value: '89', label: 'Lead Capture Rate', suffix: '%' },
                { icon: '⚡', value: '28', label: 'Average Response Time', suffix: 's' }
              ].map((stat, idx) => (
                <div key={idx} className="result-card bg-[#1e293b] border border-[#334155] rounded-2xl p-10 text-center hover:-translate-y-1 hover:border-[#f97316] transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#fb923c] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                    {stat.icon}
                  </div>
                  <div className="text-6xl font-extrabold bg-gradient-to-b from-white to-[#94a3b8] bg-clip-text text-transparent mb-2">
                    <span data-target={stat.value}>0</span>{stat.suffix || '+'}
                  </div>
                  <div className="text-base text-[#94a3b8]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 px-6 md:px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-[#f97316]/10 border border-[#f97316]/20 px-4 py-2 rounded-full text-xs text-[#f97316] font-semibold uppercase tracking-wide mb-4">
                Features
              </div>
              <h2 className="text-5xl font-extrabold text-[#0f172a] mb-4">Everything you need to win more jobs</h2>
              <p className="text-xl text-[#475569] max-w-2xl mx-auto">Powerful tools designed for service businesses, simple enough for anyone on your team.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '📞', title: 'Call Tracking', desc: 'Get a dedicated tracking number. See which marketing channels drive calls and never miss an opportunity.' },
                { icon: '💬', title: 'Instant SMS Follow-up', desc: 'Automatic text within 30 seconds of a missed call. Beat competitors while they\'re still checking voicemail.' },
                { icon: '🌐', title: 'Professional Website', desc: 'Mobile-optimized website built for your business with lead capture forms and call tracking built-in.' },
                { icon: '📊', title: 'Lead Dashboard', desc: 'See all leads in one place. Track status, add notes, and never let a hot prospect go cold.' },
                { icon: '📱', title: 'Mobile App', desc: 'Manage leads from your truck. Get instant notifications and close deals on the go.' },
                { icon: '📈', title: 'Analytics & Reports', desc: 'See which ads bring calls, track conversion rates, and make data-driven decisions.' }
              ].map((feature, idx) => (
                <div key={idx} className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-8 hover:bg-white hover:border-[#f97316] hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-2xl mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-3">{feature.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 md:py-24 px-6 md:px-4 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-block bg-[#f97316]/10 border border-[#f97316]/20 px-4 py-2 rounded-full text-xs text-[#f97316] font-semibold uppercase tracking-wide mb-4">
                  How It Works
                </div>
                <h2 className="text-5xl font-extrabold text-[#0f172a] mb-4">Get set up in under 24 hours</h2>
                <p className="text-xl text-[#475569] mb-10">No technical skills needed. We handle everything so you can focus on running your business.</p>

                <div className="space-y-6">
                  {[
                    { num: '1', title: 'Sign up & tell us about your business', desc: 'Answer a few quick questions so we can customize your setup.' },
                    { num: '2', title: 'Get your tracking number & website', desc: 'We set up your dedicated phone number and professional landing page.' },
                    { num: '3', title: 'Automated follow-ups kick in', desc: 'Every lead gets an instant response. No more missed opportunities.' },
                    { num: '4', title: 'Watch your revenue grow', desc: 'Track results in real-time and close more deals than ever.' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="w-12 h-12 bg-[#f97316] text-white rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#0f172a] mb-1">{step.title}</h4>
                        <p className="text-sm text-[#475569]">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 bg-white rounded-xl p-8 text-center">
                  <p className="text-2xl font-bold text-[#0f172a] mb-4">Want this set up for your business?</p>
                  <button
                    onClick={() => openQuoteModal('discount')}
                    className="bg-[#f97316] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#ea580c] transition shadow-lg"
                  >
                    Yes, Set Me Up!
                  </button>
                </div>
              </div>

              {/* Phone Mockup */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl">
                <div className="max-w-xs mx-auto bg-[#0f172a] rounded-[40px] p-4 shadow-2xl">
                  <div className="bg-white rounded-[32px] overflow-hidden min-h-[500px]">
                    <div className="bg-[#f97316] text-white px-5 py-6">
                      <h5 className="text-lg font-bold">NeverMissLead</h5>
                      <p className="text-sm opacity-90">3 new leads today</p>
                    </div>
                    <div className="space-y-px">
                      {[
                        { icon: '🔔', title: 'New Lead: John M.', desc: 'HVAC Repair Request', time: 'Now' },
                        { icon: '✅', title: 'Auto-text sent', desc: 'Response time: 12 seconds', time: 'Just now' },
                        { icon: '💬', title: 'John replied!', desc: '"Yes, I need help today"', time: '2m ago' }
                      ].map((notif, idx) => (
                        <div key={idx} className="px-4 py-4 border-b border-gray-200 flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#d1fae5] rounded-lg flex items-center justify-center text-lg">{notif.icon}</div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-[#0f172a]">{notif.title}</div>
                            <div className="text-xs text-[#64748b]">{notif.desc}</div>
                          </div>
                          <div className="text-xs text-[#94a3b8]">{notif.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 md:py-24 px-6 md:px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-[#f97316]/10 border border-[#f97316]/20 px-4 py-2 rounded-full text-xs text-[#f97316] font-semibold uppercase tracking-wide mb-4">
                Customer Stories
              </div>
              <h2 className="text-5xl font-extrabold text-[#0f172a]">Loved by thousands of businesses</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { stars: 5, quote: 'We went from missing 40% of calls to capturing every single lead. Response time dropped from hours to seconds. Revenue up 31% in 3 months.', name: 'Marcus Rodriguez', title: 'Owner, CoolAir HVAC', initials: 'MR' },
                { stars: 5, quote: 'The automated follow-up system is a game changer. We\'re closing deals we would have lost before. Setup took less than a day.', name: 'Sarah Kim', title: 'Manager, ProFlow Plumbing', initials: 'SK' },
                { stars: 5, quote: 'Finally, a system that actually works for contractors. The dashboard shows me exactly what\'s happening with every lead. Worth every penny.', name: 'James Thompson', title: 'President, Summit Roofing', initials: 'JT' }
              ].map((test, idx) => (
                <div key={idx} className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-8">
                  <div className="text-yellow-400 text-lg mb-4 tracking-wider">★★★★★</div>
                  <blockquote className="text-sm text-[#334155] leading-relaxed mb-6 italic">&quot;{test.quote}&quot;</blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#fb923c] rounded-full flex items-center justify-center text-white font-bold">
                      {test.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0f172a]">{test.name}</h4>
                      <p className="text-xs text-[#64748b]">{test.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { stars: 5, quote: 'Our conversion rate jumped from 22% to 34% in the first month. The call tracking feature alone paid for the entire system.', name: 'Lisa Patel', title: 'Director, Precision Medical', initials: 'LP' },
                { stars: 5, quote: 'Best investment we made this year. Leads are organized, follow-ups are automatic, and our team actually uses it. Simple and powerful.', name: 'David Washington', title: 'CEO, Spark Electric', initials: 'DW' },
                { stars: 5, quote: 'I was skeptical at first, but the ROI is undeniable. We\'re booking 12 more jobs per month on average. Support team is phenomenal too.', name: 'Amanda Chen', title: 'Owner, Crystal Pools', initials: 'AC' }
              ].map((test, idx) => (
                <div key={idx} className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-8">
                  <div className="text-yellow-400 text-lg mb-4 tracking-wider">★★★★★</div>
                  <blockquote className="text-sm text-[#334155] leading-relaxed mb-6 italic">&quot;{test.quote}&quot;</blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#fb923c] rounded-full flex items-center justify-center text-white font-bold">
                      {test.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0f172a]">{test.name}</h4>
                      <p className="text-xs text-[#64748b]">{test.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-12 md:py-24 px-6 md:px-4 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-[#f97316]/10 border border-[#f97316]/20 px-4 py-2 rounded-full text-xs text-[#f97316] font-semibold uppercase tracking-wide mb-4">
                Pricing
              </div>
              <h2 className="text-5xl font-extrabold text-[#0f172a] mb-4">Simple, transparent pricing</h2>
              <p className="text-xl text-[#475569]">Choose the plan that works for your business</p>
            </div>

            <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />

            <div className="grid lg:grid-cols-2 gap-10 max-w-4xl mx-auto">
              {/* Starter Plan */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all">
                <div className="p-12 text-center">
                  <div className="text-2xl font-bold text-[#0f172a] mb-2">Starter</div>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-2xl font-bold text-[#0f172a]">$</span>
                    <span className="text-7xl font-extrabold text-[#0f172a]">297</span>
                    <span className="text-lg text-[#64748b]">/mo</span>
                  </div>
                  <div className="text-sm text-[#64748b] mb-8">+ $497 setup fee</div>

                  <ul className="text-left space-y-3 mb-8">
                    {['Professional website', 'Call tracking & recording', 'SMS auto-response', 'Lead database', 'Cancel anytime'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-[#334155] pb-3 border-b border-gray-200 last:border-0">
                        <span className="w-6 h-6 bg-[#d1fae5] text-[#10b981] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openQuoteModal('discount')}
                    className="w-full bg-[#f97316] text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-[#ea580c] transition shadow-lg"
                  >
                    14 Day Free Trial
                  </button>
                </div>
              </div>

              {/* Unlimited Plan */}
              <div className="bg-[#0f172a] border-2 border-[#f97316] rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2 transition-all">
                <div className="bg-[#f97316] text-[#0f172a] text-center py-3 text-sm font-bold uppercase tracking-wider">
                  ⚡ UNLIMITED
                </div>
                <div className="p-12 text-center">
                  <div className="text-2xl font-bold text-white mb-2">Unlimited</div>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">$</span>
                    <span className="text-7xl font-extrabold text-white">
                      {isAnnual ? '2,997' : '297'}
                    </span>
                    <span className="text-lg text-[#94a3b8]">{isAnnual ? '/yr' : '/mo'}</span>
                  </div>
                  <div className={`text-sm mb-8 ${isAnnual ? 'text-[#10b981] font-semibold' : 'text-transparent select-none'}`}>
                    {isAnnual ? 'Save $1,064 total!' : 'Placeholder'}
                  </div>

                  <ul className="text-left space-y-3 mb-8">
                    {['Everything in Starter', 'Priority support', 'Advanced analytics', 'API access - integrate with anything', 'Unlimited sub-accounts', 'Branded desktop app'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-[#94a3b8] pb-3 border-b border-[#334155] last:border-0">
                        <span className="w-6 h-6 bg-[#d1fae5] text-[#10b981] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openQuoteModal('discount')}
                    className="w-full bg-[#f97316] text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-[#ea580c] transition shadow-lg"
                  >
                    14 Day Free Trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-4 bg-[#0f172a] text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-[#f97316]/15 via-transparent to-transparent opacity-50"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-4">Ready to stop losing leads?</h2>
            <p className="text-xl text-[#94a3b8] mb-10">Join 2,500+ service businesses already using NeverMissLead to grow their revenue.</p>

            <button
              onClick={() => openQuoteModal('access')}
              className="bg-[#f97316] text-white px-10 py-5 rounded-lg font-bold text-xl hover:bg-[#ea580c] transition shadow-2xl hover:shadow-3xl mb-6"
            >
              See How It Works →
            </button>

            <div className="flex items-center justify-center gap-6 text-sm text-[#94a3b8]">
              <span className="flex items-center gap-2">
                <span className="text-[#10b981] font-bold">✓</span> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#10b981] font-bold">✓</span> Cancel anytime
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1e293b] border-t border-[#334155] py-16 px-4 text-[#94a3b8]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                      <path d="M20 4 L20 18 L14 14 L11 20 L9 19 L12 13 L6 13 L20 4 Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xl font-extrabold text-white">
                    Never<span className="text-[#f97316]">Miss</span>Lead
                  </span>
                </div>
                <p className="text-sm leading-relaxed">The lead management platform built for service businesses. Capture every lead, follow up instantly, and convert more prospects into customers.</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-5">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="hover:text-white transition">Features</a></li>
                  <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="/how-it-works" className="hover:text-white transition">How It Works</a></li>
                  <li><a href="#results" className="hover:text-white transition">Results</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-5">Industries</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/hvac" className="hover:text-white transition">HVAC</a></li>
                  <li><a href="/plumbing" className="hover:text-white transition">Plumbing</a></li>
                  <li><a href="/electrical" className="hover:text-white transition">Electrical</a></li>
                  <li><button onClick={() => openQuoteModal('quote')} className="hover:text-white transition cursor-pointer text-left">More Industries</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-5">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/about" className="hover:text-white transition">About</a></li>
                  <li><a href="mailto:support@cherysolutions.com" className="hover:text-white transition">Contact</a></li>
                  <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="https://cherysolutions.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Chery Solutions</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#334155] pt-8 flex justify-between items-center text-sm">
              <p>&copy; 2025 Chery Solutions LLC. All rights reserved. | Powered by <a href="https://cherysolutions.com" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:text-[#fb923c] transition">Chery Solutions</a></p>
              <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </main>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
        businessName="NeverMissLead"
        theme="landing"
        variant={modalVariant}
      />

      {/* Sticky Mobile CTA Bar - Only visible after scrolling */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden z-50 transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button
          onClick={() => openQuoteModal('discount')}
          className="w-full bg-[#10b981] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#059669] transition shadow-md"
        >
          Get 30% Off →
        </button>
      </div>
    </>
  );
}
