import React, { useState } from 'react';

const ContactUsPage: React.FC = () => {
    const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Contact form submitted:', formData);
      // In a real app, you'd send the data to a server here.
      setSubmissionStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionStatus('error');
    }
  };
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold font-poppins text-gray-800">Get in Touch</h1>
          <p className="text-lg text-gray-600 mt-4">Have a question or need assistance? We're here to help.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-50 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold font-poppins mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">Subject</label>
                <input type="text" id="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea id="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required></textarea>
              </div>
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition duration-300">Submit</button>
              {submissionStatus === 'success' && (
                <p className="text-green-600 mt-4">Thank you for your message! We will get back to you shortly.</p>
              )}
              {submissionStatus === 'error' && (
                <p className="text-red-600 mt-4">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
          <div className="text-gray-700">
            <h2 className="text-2xl font-semibold font-poppins mb-6">Contact Information</h2>
                                    <p className="mb-4"><strong>Email:</strong> <a href="https://mail.google.com/mail/?view=cm&fs=1&to=slocalhands@gmail.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">slocalhands@gmail.com</a></p>
            <p className="mb-4"><strong>Phone:</strong> (+237) 670902508 </p>
            <p><strong>Address:</strong> boundoma, Buea, Cameroon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
