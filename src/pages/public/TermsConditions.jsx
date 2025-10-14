// pages/public/TermsConditions.jsx
const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="page-title">Terms and Conditions</h1>
          <p className="page-subtitle">
            Please read these terms carefully before using our services
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="prose max-w-none">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Last updated: {new Date().getFullYear()}
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing and using the services of Xtra-Mile Freight Forwarding Inc., 
                you acknowledge that you have read, understood, and agree to be bound 
                by these Terms and Conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Services Description
              </h2>
              <p className="text-gray-600 mb-4">
                Xtra-Mile Freight Forwarding Inc. provides freight forwarding, 
                cargo monitoring, and logistics services through our digital platform. 
                Our services include but are not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Booking management and tracking</li>
                <li>Cargo monitoring and status updates</li>
                <li>Document management and waybill processing</li>
                <li>Financial transactions and payment processing</li>
                <li>Customer support and incident reporting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. User Accounts
              </h2>
              <p className="text-gray-600 mb-4">
                To access certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Booking and Payments
              </h2>
              <p className="text-gray-600 mb-4">
                All bookings are subject to availability and confirmation. 
                Payment terms will be specified during the booking process. 
                We reserve the right to cancel bookings if payment is not received 
                according to agreed terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. Liability and Limitations
              </h2>
              <p className="text-gray-600 mb-4">
                While we strive to provide reliable services, Xtra-Mile Freight Forwarding Inc. 
                shall not be liable for delays or failures in performance resulting from 
                circumstances beyond our reasonable control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Privacy and Data Protection
              </h2>
              <p className="text-gray-600 mb-4">
                We are committed to protecting your privacy. Our Privacy Policy explains 
                how we collect, use, and protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. Modifications to Terms
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Continued use 
                of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                8. Contact Information
              </h2>
              <p className="text-gray-600">
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email: legal@xtramilefreight.com<br />
                Phone: +63 123 456 7890<br />
                Address: [Your Company Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;