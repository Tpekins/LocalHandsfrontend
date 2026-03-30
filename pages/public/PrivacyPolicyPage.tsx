import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="prose lg:prose-xl max-w-none">
          <h1>Privacy Policy</h1>
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

          <p>Your privacy is important to us. It is Local Hands' policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>

          <h2>1. Information We Collect</h2>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
          <p>Information we collect includes:</p>
          <ul>
            <li><strong>Log data:</strong> When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.</li>
            <li><strong>Personal Information:</strong> We may ask for personal information, such as your name, email, social media profiles, phone/mobile number, home/mailing address, and payment information.</li>
            <li><strong>User-generated content:</strong> We also collect the content you generate and share on our platform, such as service listings, reviews, and messages between users.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We may use your information to:</p>
          <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Process your transactions</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2>3. Security of Your Information</h2>
          <p>The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>

          <h2>4. Links to Other Sites</h2>
          <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>

          <h2>5. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please <Link to="/contact">contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;