import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - SMS/Text Messaging & Data Protection | NeverMissLead',
  description: 'Learn how NeverMissLead protects your mobile phone number and SMS communication data. A2P 10DLC compliant privacy policy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="prose prose-lg prose-blue mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy - nevermisslead.com</h1>
          <p className="text-xl text-gray-600 mb-8">SMS/Text Messaging & Data Protection</p>

          <div className="text-sm text-gray-500 mb-8">
            <p><strong>Effective Date:</strong> November 2025</p>
            <p><strong>Last Updated:</strong> November 10, 2025</p>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Section 1 */}
          <section id="mobile-data-protection" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Mobile Data Protection & SMS Opt-In</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Mobile Data Non-Sharing Clause</h3>
            <p className="mb-4">
              <strong>We are committed to protecting your mobile phone number and SMS communication data.</strong>
            </p>

            <p className="mb-4">Chery Solutions LLC and nevermisslead.com guarantee that:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your mobile phone number will <strong>never be shared, sold, or transferred</strong> to third parties, affiliates, lead generators, or marketing partners</li>
              <li>Mobile information collected through SMS opt-in is used <strong>exclusively</strong> for service-related communications from nevermisslead.com</li>
              <li>We do not monetize, package, or distribute your phone number to any external entity</li>
              <li>Your mobile data is stored securely and protected under applicable US data protection laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Collection & Use</h3>
            <p className="mb-4">When you opt in to receive SMS/text messages from nevermisslead.com, we collect:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your mobile phone number</li>
              <li>Your service category (HVAC, Plumbing, Electrical, etc.)</li>
              <li>Your service area/location</li>
              <li>Opt-in date and consent timestamp</li>
            </ul>

            <p className="mb-4"><strong>We use this data exclusively for:</strong></p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Sending lead confirmations to your business</li>
              <li>Service appointment reminders and updates</li>
              <li>Support communications related to your nevermisslead.com account</li>
              <li>System notifications and service alerts</li>
            </ul>

            <p className="mb-4"><strong>We do NOT use your data for:</strong></p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Marketing campaigns or promotional messages (unless explicitly requested)</li>
              <li>Third-party marketing or affiliate promotions</li>
              <li>Data sharing with lead aggregators or brokers</li>
              <li>Any purpose unrelated to your nevermisslead.com service</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200" />

          {/* Section 2 */}
          <section id="sms-frequency" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. SMS Message Frequency & Charges</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Message Frequency</h3>
            <p className="mb-4">
              Standard service sends 1-5 SMS per business day during active lead periods. High-volume periods may result in more frequent messages. You control message frequency through your nevermisslead.com account dashboard.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Message & Data Rates</h3>
            <p className="mb-4">
              <strong>Message and data rates may apply.</strong> Standard message and data rates apply per your mobile carrier plan. nevermisslead.com is not responsible for carrier charges.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          {/* Section 3 */}
          <section id="opt-out" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Opt-Out & Consent Withdrawal</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Stop SMS Messages</h3>
            <p className="mb-4">
              Text <strong>STOP</strong> to the nevermisslead.com phone number at any time to unsubscribe from all SMS messages.
            </p>
            <p className="mb-4">
              You will receive a confirmation message. After opting out, you will only receive SMS related to customer service inquiries (not promotional messages).
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Re-Opt-In</h3>
            <p className="mb-4">
              To resume SMS messages after opting out, reply <strong>START</strong> or contact nevermisslead.com support at{' '}
              <a href="mailto:support@cherysolutions.com" className="text-blue-600 hover:text-blue-700">
                support@cherysolutions.com
              </a>.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          {/* Section 4 */}
          <section id="help-support" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Help & Support</h2>
            <p className="mb-4">For SMS support issues, questions about your subscription, or data privacy concerns:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:support@cherysolutions.com" className="text-blue-600 hover:text-blue-700">
                  support@cherysolutions.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{' '}
                <a href="tel:+16787887281" className="text-blue-600 hover:text-blue-700">
                  (678) 788-7281
                </a>
              </li>
              <li>
                <strong>Website:</strong>{' '}
                <Link href="/" className="text-blue-600 hover:text-blue-700">
                  nevermisslead.com/support
                </Link>
              </li>
            </ul>
            <p className="mb-4">We aim to respond to support requests within 24 hours.</p>
          </section>

          <hr className="my-8 border-gray-200" />

          {/* Section 5 */}
          <section id="compliance" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compliance & Legal Basis</h2>
            <p className="mb-4">This privacy policy and SMS opt-in process comply with:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>FCC regulations</strong> (47 CFR §64.1200) for SMS messaging</li>
              <li><strong>TCPA</strong> (Telephone Consumer Protection Act) requirements</li>
              <li><strong>A2P 10DLC standards</strong> established by major US carriers (Verizon, AT&T, T-Mobile, US Cellular)</li>
              <li><strong>CAN-SPAM Act</strong> for marketing communications</li>
              <li><strong>GDPR</strong> (if applicable to EU residents)</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200" />

          {/* Section 6 */}
          <section id="data-security" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security & Retention</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your mobile phone number is encrypted and stored securely</li>
              <li>Access to SMS data is restricted to authorized Chery Solutions LLC personnel only</li>
              <li>We retain SMS opt-in data for the duration of your service + 90 days after account termination</li>
              <li>We never retain SMS message content after delivery</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200" />

          {/* Section 7 */}
          <section id="policy-changes" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to This Policy</h2>
            <p className="mb-4">
              Chery Solutions LLC reserves the right to update this privacy policy at any time. Material changes will be communicated via email to the address associated with your nevermisslead.com account.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          {/* Section 8 */}
          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact & Questions</h2>
            <p className="mb-4"><strong>Privacy inquiries:</strong></p>
            <address className="not-italic mb-4">
              Chery Solutions LLC<br />
              300 Peachtree St NE, Ste CS2 #3472<br />
              Atlanta, GA 30308<br />
              Email:{' '}
              <a href="mailto:support@cherysolutions.com" className="text-blue-600 hover:text-blue-700">
                support@cherysolutions.com
              </a><br />
              Phone:{' '}
              <a href="tel:+16787887281" className="text-blue-600 hover:text-blue-700">
                (678) 788-7281
              </a>
            </address>
          </section>

          <hr className="my-8 border-gray-200" />

          <footer className="text-sm text-gray-500 italic">
            <p>This privacy policy is designed to meet A2P 10DLC and Twilio compliance requirements for SMS messaging.</p>
          </footer>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Chery Solutions LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
