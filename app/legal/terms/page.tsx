import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - FiestaCo',
  description: 'Terms of Service for FiestaCo beverage customization application',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            ← Back to Home
          </Link>

          <header className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last Updated: April 24, 2026</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                By accessing or using FiestaCo, you agree to be bound by these Terms of Service.
              </p>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                Welcome to FiestaCo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our beverage customization application, website, and related services (collectively, the &quot;Service&quot;).
              </p>
              <p className="text-gray-700">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                FiestaCo is a web-based application that allows users to customize and visualize beverage recipes. Our Service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Interactive beverage customization tools</li>
                <li>Recipe visualization and sharing</li>
                <li>Image processing and optimization</li>
                <li>Analytics and usage tracking</li>
                <li>Social media integration features</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to modify or discontinue the Service at any time without notice.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring you comply with these Terms</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to refuse service, terminate accounts, or remove content at our discretion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. User Content</h2>
              <p className="text-gray-700 mb-4">
                You retain ownership of any content you create or upload to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content for the purpose of operating and improving the Service.
              </p>
              <p className="text-gray-700">
                You agree not to upload content that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Is illegal, offensive, or infringes on others&apos; rights</li>
                <li>Contains viruses or malicious code</li>
                <li>Violates any third-party intellectual property rights</li>
                <li>Is false, misleading, or deceptive</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by FiestaCo and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700">
                Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our Service may integrate with or link to third-party services, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>TikTok API for social sharing</li>
                <li>Image hosting and optimization services</li>
                <li>Analytics and monitoring tools</li>
                <li>Payment processors (if applicable)</li>
              </ul>
              <p className="text-gray-700">
                Your use of third-party services is governed by their respective terms and privacy policies. We are not responsible for the content or practices of any third-party services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, FiestaCo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. FiestaCo makes no warranties, expressed or implied, regarding the Service&apos;s reliability, availability, or suitability for any particular purpose.
              </p>
              <p className="text-gray-700">
                We do not warrant that the Service will be uninterrupted, secure, or error-free, or that any defects will be corrected.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Indemnification</h2>
              <p className="text-gray-700">
                You agree to defend, indemnify, and hold harmless FiestaCo and its licensees and licensors from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mt-4 space-y-2">
                <li>Your use of and access to the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party right</li>
                <li>Any content you submit to the Service</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700">
                By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700">
                Any disputes arising under these Terms will be resolved in the state or federal courts located in San Francisco, California.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@fiestaco.app<br />
                  <strong>Address:</strong> 123 Tech Street, San Francisco, CA 94107<br />
                  <strong>Website:</strong> <Link href="https://fiestaco.app" className="text-blue-600 hover:text-blue-800">https://fiestaco.app</Link>
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                These Terms of Service were last updated on April 24, 2026 and are effective immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}