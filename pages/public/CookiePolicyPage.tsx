import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="prose lg:prose-xl max-w-none">
          <h1>Cookie Policy</h1>
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

          <p>Local Hands ("us", "we", or "our") uses cookies on our website (the "Service"). By using the Service, you consent to the use of cookies.</p>

          <h2>What are cookies?</h2>
          <p>A cookie is a small piece of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>

          <h2>How Local Hands uses cookies</h2>
          <p>When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
          <ul>
            <li><strong>To enable essential functions of the Service:</strong> We use essential cookies to authenticate users, prevent fraudulent use of user accounts, and secure user data from unauthorized parties.</li>
            <li><strong>For analytics and performance:</strong> We use analytics cookies to track information how the Service is used so that we can make improvements. We may also use analytics cookies to test new advertisements, pages, features or new functionality of the Service to see how our users react to them.</li>
            <li><strong>For advertising:</strong> These cookies are used to deliver advertisements that may be relevant to you and your interests. They may be used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.</li>
          </ul>

          <h2>What are your choices regarding cookies?</h2>
          <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about our use of cookies, please <Link to="/contact">contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
