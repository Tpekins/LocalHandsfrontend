import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="prose lg:prose-xl max-w-none">
          <h1>Terms of Service</h1>
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

          <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Local Hands website (the "Service") operated by Local Hands ("us", "we", or "our").</p>

          <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>

          <h2>1. Accounts</h2>
          <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

          <h2>2. Service Marketplace</h2>
          <p>Local Hands provides a platform for connecting individuals seeking to obtain services ("Customers") and individuals seeking to provide services ("Providers"). We are not a party to the transactions between Customers and Providers. We do not hire or employ Providers, and we are not responsible for the conduct of any user of our Service.</p>

          <h2>3. User Conduct</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any local, state, national, or international law.</li>
            <li>Engage in any activity that is fraudulent, false, or misleading.</li>
            <li>Harass, abuse, or harm another person.</li>
            <li>Infringe upon the rights of any third party, including intellectual property rights.</li>
          </ul>

          <h2>4. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

          <h2>5. Limitation of Liability</h2>
          <p>In no event shall Local Hands, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2>6. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms, please <Link to="/contact">contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;