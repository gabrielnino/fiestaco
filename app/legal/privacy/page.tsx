import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - FiestaCo',
  description: 'Privacy Policy for FiestaCo beverage customization application',
};

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: April 24, 2026</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                This Privacy Policy describes how FiestaCo collects, uses, and shares your personal information when you use our Service.
              </p>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                FiestaCo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our beverage customization application and website (the &quot;Service&quot;).
              </p>
              <p className="text-gray-700">
                Please read this Privacy Policy carefully. By using the Service, you consent to the data practices described in this policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">a. Information You Provide</h3>
              <p className="text-gray-700 mb-4">
                We collect information you voluntarily provide when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Create an account</li>
                <li>Customize beverage recipes</li>
                <li>Save or share recipes</li>
                <li>Contact us for support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-gray-700">
                This may include your name, email address, recipe preferences, and any content you create.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">b. Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">
                When you use our Service, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
                <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
                <li><strong>IP Address:</strong> For security and analytics purposes</li>
                <li><strong>Cookies and Similar Technologies:</strong> To enhance your experience</li>
                <li><strong>Analytics Data:</strong> Customization patterns, interaction flows</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">c. Third-Party Information</h3>
              <p className="text-gray-700">
                If you connect social media accounts (like TikTok) to our Service, we may receive information from those platforms according to their privacy policies and your privacy settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Provide, maintain, and improve our Service</li>
                <li>Personalize your experience and content recommendations</li>
                <li>Process your requests and transactions</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. How We Share Your Information</h2>
              <p className="text-gray-700 mb-4">
                We may share your information in the following circumstances:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">a. Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We may share your information with third-party vendors who provide services on our behalf, such as:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Hosting and infrastructure providers</li>
                <li>Analytics and monitoring services</li>
                <li>Customer support platforms</li>
                <li>Payment processors (if applicable)</li>
              </ul>
              <p className="text-gray-700">
                These providers are contractually obligated to protect your information and may only use it for the purposes we specify.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">b. Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">c. Business Transfers</h3>
              <p className="text-gray-700">
                In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business, your information may be transferred as a business asset.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">d. With Your Consent</h3>
              <p className="text-gray-700">
                We may share your information with third parties when you give us explicit consent to do so.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our Service</li>
                <li>Personalize your experience</li>
                <li>Analyze traffic and trends</li>
                <li>Improve security</li>
              </ul>
              <p className="text-gray-700">
                You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure development practices</li>
                <li>Incident response procedures</li>
              </ul>
              <p className="text-gray-700">
                While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Provide you with the Service</li>
                <li>Comply with our legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
                <li>Conduct legitimate business operations</li>
              </ul>
              <p className="text-gray-700">
                When we no longer need to retain your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us using the information in the &quot;Contact Us&quot; section.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Third-Party Links and Services</h2>
              <p className="text-gray-700 mb-4">
                Our Service may contain links to third-party websites or services that are not owned or controlled by FiestaCo. This Privacy Policy applies only to our Service.
              </p>
              <p className="text-gray-700">
                We are not responsible for the privacy practices of third-party websites or services. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
              </p>
              <p className="text-gray-700">
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ.
              </p>
              <p className="text-gray-700">
                By using our Service, you consent to the transfer of your information to regions where we operate, including the United States.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
              </p>
              <p className="text-gray-700">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@fiestaco.app<br />
                  <strong>Address:</strong> 123 Tech Street, San Francisco, CA 94107<br />
                  <strong>Website:</strong> <Link href="https://fiestaco.app" className="text-blue-600 hover:text-blue-800">https://fiestaco.app</Link>
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                For data protection inquiries, you may also contact our Data Protection Officer at: <span className="text-blue-600">dpo@fiestaco.app</span>
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                This Privacy Policy was last updated on April 24, 2026 and is effective immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}