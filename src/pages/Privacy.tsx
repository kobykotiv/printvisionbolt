import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="bg-white dark:bg-secondary-900">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-secondary-900 dark:text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-secondary-500 dark:text-secondary-400">
            Last updated: February 25, 2025
          </p>
        </div>

        <div className="mt-16 prose prose-blue dark:prose-invert max-w-none">
          <section>
            <h2>1. Introduction</h2>
            <p>
              PrintVision.Cloud ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our print-on-demand management platform.
            </p>
          </section>

          <section className="mt-12">
            <h2>2. Your Data Ownership</h2>
            <p>
              We believe in absolute data ownership rights for our users. This means:
            </p>
            <ul>
              <li>You retain full ownership of all your content and data</li>
              <li>We do not train AI models on your data</li>
              <li>Your designs, customer information, and business data remain exclusively yours</li>
              <li>We only use your data to provide and improve our services as explicitly described in this policy</li>
              <li>You can export or delete your data at any time</li>
            </ul>
            <p className="font-semibold">
              AI Training Commitment: We explicitly commit to never using your designs, business data, or any other content for training artificial intelligence models. Your intellectual property remains solely yours.
            </p>
          </section>

          <section className="mt-12">
            <h2>3. Information We Collect</h2>
            <h3>3.1 Information You Provide</h3>
            <ul>
              <li>Account information (name, email, password)</li>
              <li>Business information (company name, address)</li>
              <li>Payment information</li>
              <li>Design files and product information</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="mt-6">3.2 Automatically Collected Information</h3>
            <ul>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2>4. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Send service updates and notifications</li>
              <li>Improve our platform and user experience</li>
              <li>Analyze usage patterns and trends</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2>5. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Print-on-demand suppliers (for order fulfillment)</li>
              <li>Payment processors</li>
              <li>Cloud service providers</li>
              <li>Analytics services</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mt-12">
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information, including:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data backups</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2>8. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to improve your experience. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mt-12">
            <h2>9. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect or maintain information from children under 13.
            </p>
          </section>

          <section className="mt-12">
            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mt-12">
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of any material changes through our Service or via email.
            </p>
          </section>

          <section className="mt-12">
            <h2>12. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or your personal information:
            </p>
            <p className="mt-2">
              Email: privacy@printvision.cloud<br />
              Data Protection Officer<br />
              PrintVision.Cloud<br />
              123 Print Avenue, Suite 100<br />
              Digital City, DC 12345<br />
              United States
            </p>
          </section>

          <section className="mt-12 border-t border-secondary-200 dark:border-secondary-700 pt-8">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              By using PrintVision.Cloud, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;