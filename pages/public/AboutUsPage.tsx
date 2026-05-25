import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold font-poppins text-gray-800 mb-4">About LocalHands Africa</h1>
          <p className="text-lg text-gray-600">Empowering local communities by connecting skilled professionals with neighbors in need.</p>
        </div>

        {/* Our Story */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-semibold font-poppins text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              LocalHands Africa was founded on a simple idea: that finding trusted, local help shouldn't be a chore. We saw communities across Africa struggle to find reliable professionals, while skilled workers had no digital visibility to reach clients. We knew there had to be a better way.
            </p>
            <p className="text-gray-600">
              We built this platform to bridge that gap. LocalHands Africa is more than just a marketplace — it's a community hub designed to foster connections, build trust, and empower Africa's informal economy. Every transaction on our platform helps a local professional grow their business and a neighbor get a job done right.
            </p>
          </div>
          <div>
            <img src="/placeholder-team.jpg" alt="Our Team" className="rounded-lg shadow-lg" />
          </div>
        </div>

        {/* Meet the Founder */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold font-poppins text-gray-800 mb-8 text-center">Meet the Founder</h2>

          <div className="bg-gray-50 rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">

            {/* Founder Photo */}
            <div className="flex-shrink-0">
              <img
                src="/Tiani.jpg"
                alt="Tiani Pekins Ebika — Founder of LocalHands Africa"
                className="w-40 h-40 rounded-2xl object-cover shadow-md"
              />
            </div>

            {/* Founder Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold font-poppins text-gray-800 mb-1">Tiani Pekins Ebika</h3>
              <p className="text-primary font-medium text-sm mb-4">
                Full-stack Software Engineer · MS Software Engineering, University of Buea
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Tiani Pekins Ebika is a full-stack software engineer deeply rooted in the Silicon Mountain tech community in Cameroon. Driven by a passion for using technology to create real impact, Tiani founded LocalHands Africa to empower everyday workers across Africa with digital visibility and bridge the trust gap in the informal economy.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                With expertise in mobile and web development, UI/UX, system design, and product management, Tiani brings a holistic vision to building platforms that serve real people across Africa.
              </p>

              {/* Links — only Portfolio and Email */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href="https://tianipekins.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-accent transition-colors"
                >
                  🌍 Visit Portfolio
                </a>
                <a
                  href="mailto:tiani@localhands.africa"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 text-sm font-semibold px-5 py-2 rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  ✉️ tiani@localhands.africa
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUsPage;