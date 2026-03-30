import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 focus:outline-none"
      >
        <span>{question}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const customerFAQs = [
    {
      question: "How does payment work?",
      answer: "Payments are handled securely through our platform. When you book a service, we hold the payment and only release it to the provider once you mark the job as complete. We accept all major credit cards."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "Your satisfaction is our priority. If the service doesn't meet your expectations, you can raise a dispute through our Resolution Center. We'll mediate between you and the provider to find a fair solution, which may include a partial or full refund."
    },
    {
      question: "How are providers vetted?",
      answer: "We take safety and quality seriously. All providers on Local Hands undergo a verification process that includes identity checks and a review of their qualifications and past work. You can also read reviews from other customers on their profile."
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes, you can cancel a booking. Our cancellation policy depends on how far in advance you cancel. Please refer to our Terms of Service for detailed information on cancellation fees and procedures."
    }
];

const providerFAQs = [
    {
      question: "How do I get paid?",
      answer: "Once a customer marks a job as complete, the funds are transferred to your Local Hands wallet. You can then withdraw your earnings directly to your bank account. Withdrawals typically take 2-3 business days to process."
    },
    {
      question: "What are the service fees?",
      answer: "It's free to create a profile and list your services on Local Hands. We charge a small service fee on completed bookings, which helps us operate the platform and provide support. The fee is a percentage of the total job price and is clearly displayed before you accept a job."
    },
    {
      question: "How can I improve my profile to get more bookings?",
      answer: "A great profile makes a big difference. We recommend uploading a professional photo, writing a detailed bio that highlights your skills and experience, and showcasing your best work in a portfolio. Encouraging your clients to leave reviews after a job is also crucial."
    },
    {
      question: "What happens if a customer cancels?",
      answer: "Our cancellation policy protects providers from last-minute changes. If a customer cancels with short notice, you may be entitled to a portion of the job payment. The specific amount depends on the timing of the cancellation as outlined in our provider agreement."
    }
];


const FAQPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-poppins text-gray-800">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-gray-600">Find answers to common questions about using Local Hands.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Questions for Customers */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold font-poppins text-gray-800 mb-6">For Customers</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {customerFAQs.map((faq, index) => (
                <FAQItem key={`customer-${index}`} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          {/* Questions for Providers */}
          <div>
            <h2 className="text-3xl font-semibold font-poppins text-gray-800 mb-6">For Providers</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {providerFAQs.map((faq, index) => (
                <FAQItem key={`provider-${index}`} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;