import React from 'react';

const TrustAndSafetyPage: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold font-poppins text-center mb-8">Trust & Safety</h1>
        <div className="prose lg:prose-xl max-w-none">
          <p>At Local Hands, your safety and trust are the cornerstones of our community. We are dedicated to creating a secure environment where both customers and providers can connect with confidence. Here’s how we work to protect you:</p>
          
          <h2>Provider Verification</h2>
          <p>We believe that trust starts with transparency. Every service provider on Local Hands is required to complete a verification process, which includes confirming their identity and contact information. For certain service categories, we may also request proof of licenses or certifications to ensure they have the right qualifications for the job.</p>

          <h2>Secure Payments</h2>
          <p>Our secure payment system protects your financial information. All transactions are processed through an encrypted, PCI-compliant gateway. When a customer books a service, the payment is held in escrow and is only released to the provider after the customer confirms that the work has been completed to their satisfaction. This protects both parties and ensures a fair exchange.</p>

          <h2>Two-Way Reviews</h2>
          <p>Accountability is key to a healthy community. After a job is completed, both the customer and the provider can rate and review each other. This two-way system helps build a transparent record of reliability and quality, allowing users to make informed decisions when booking or accepting a job. It also encourages respectful and professional interactions from everyone on the platform.</p>

          <h2>Dispute Resolution</h2>
          <p>In the rare event that something goes wrong, our dedicated Resolution Center is here to help. If a job doesn’t meet the agreed-upon expectations, either party can open a dispute. Our support team will step in to mediate the situation, review the evidence, and work towards a fair and timely resolution, which may include partial or full refunds.</p>

          <h2>Your Privacy Matters</h2>
          <p>We are committed to protecting your personal information. All communication can be handled directly through our secure messaging system, so you never have to share your personal phone number or email address unless you choose to. For more details, please review our <a href="/privacy-policy">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default TrustAndSafetyPage;
