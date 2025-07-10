import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiUsers, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Secure Voting',
      description: 'Advanced encryption and blockchain technology ensure your vote is secure and tamper-proof.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Transparent Process',
      description: 'Real-time results and transparent voting process with complete audit trails.'
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: 'Easy to Use',
      description: 'Simple and intuitive interface that makes voting accessible to everyone.'
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: 'Live Results',
      description: 'Watch election results in real-time with detailed analytics and statistics.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Secure Digital Voting
              <span className="block text-primary-200">for Everyone</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Experience the future of democracy with our secure, transparent, and accessible election platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/candidates"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                View Candidates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive solution for secure, transparent, and accessible digital voting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to participate in the democratic process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Register
              </h3>
              <p className="text-gray-600">
                Create your account and verify your identity to participate in the election.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Review Candidates
              </h3>
              <p className="text-gray-600">
                Learn about the candidates, their policies, and make an informed decision.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cast Your Vote
              </h3>
              <p className="text-gray-600">
                Securely cast your vote and watch the results in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who are already using our platform to participate in democracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              Register Now
            </Link>
            <Link
              to="/results"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              View Results
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 