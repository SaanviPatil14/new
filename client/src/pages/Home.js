import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiUsers, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

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
    <main className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Secure Digital Voting
            <span className="block text-primary-200">for Everyone</span>
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-primary-100 mb-6 md:mb-8 max-w-2xl md:max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Experience the future of democracy with our secure, transparent, and accessible election platform.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/candidates"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200"
            >
              View Candidates
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.header 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl md:max-w-2xl mx-auto">
              We provide a comprehensive solution for secure, transparent, and accessible digital voting.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.article 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="bg-primary-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl md:max-w-2xl mx-auto">
              Simple steps to participate in the democratic process
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {['Register', 'Review Candidates', 'Cast Your Vote'].map((step, idx) => (
              <motion.article
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <div className="bg-primary-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white font-bold text-base sm:text-xl">
                  {idx + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {step}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {idx === 0 && 'Create your account and verify your identity to participate in the election.'}
                  {idx === 1 && 'Learn about the candidates, their policies, and make an informed decision.'}
                  {idx === 2 && 'Securely cast your vote and watch the results in real-time.'}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <footer className="py-14 md:py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Make Your Voice Heard?
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-primary-100 mb-6 md:mb-8 max-w-xl md:max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join thousands of citizens who are already using our platform to participate in democracy.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200"
            >
              Register Now
            </Link>
            <Link
              to="/results"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200"
            >
              View Results
            </Link>
          </motion.div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
