import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="bg-white dark:bg-secondary-900">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-secondary-900 dark:text-white sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-secondary-500 dark:text-secondary-400">
            Last updated: February 25, 2025
          </p>
        </div>

        <div className="mt-16 prose prose-blue dark:prose-invert max-w-none">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using PrintVision.Cloud ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you do not have permission to access the Service.
            </p>
          </section>

          <section className="mt-12">
            <h2>2. Description of Service</h2>
            <p>
              PrintVision.Cloud provides a platform for managing print-on-demand products across multiple marketplaces and suppliers. The Service includes automation tools, design management, order tracking, and integration capabilities with various e-commerce platforms and print-on-demand suppliers.
            </p>
          </section>

          <section className="mt-12">
            <h2>3. User Accounts</h2>
            <p>
              To access the Service, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update your account information as needed</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2>4. Intellectual Property</h2>
            <p>
              You retain all rights to your content uploaded to the Service. By using the Service, you grant PrintVision.Cloud a license to use your content solely for the purpose of providing and improving the Service. PrintVision.Cloud respects intellectual property rights and expects users to do the same.
            </p>
          </section>

          <section className="mt-12">
            <h2>5. Acceptable Use</h2>
            <p>
              You agree not to:
            </p>
            <ul>
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Upload malicious code or content</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2>6. Payment Terms</h2>
            <p>
              Paid subscriptions are billed in advance on a monthly basis. You authorize us to charge your designated payment method for all applicable fees. If automatic billing fails, you will be notified and must provide an alternative payment method within 7 days to maintain service access.
            </p>
          </section>

          <section className="mt-12">
            <h2>7. Cancellation and Termination</h2>
            <p>
              You may cancel your subscription at any time. Upon cancellation:
            </p>
            <ul>
              <li>Your access continues until the end of your current billing period</li>
              <li>No refunds are provided for partial months</li>
              <li>You remain responsible for any outstanding charges</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2>8. Limitation of Liability</h2>
            <p>
              PrintVision.Cloud provides the Service "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section className="mt-12">
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. Continued use of the Service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mt-12">
            <h2>10. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              Email: legal@printvision.cloud<br />
              Address: 123 Print Avenue, Suite 100<br />
              Digital City, DC 12345<br />
              United States
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;