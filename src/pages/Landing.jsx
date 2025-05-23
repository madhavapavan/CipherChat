import { useNavigate } from 'react-router-dom';
import { FiShield, FiLock, FiShare2, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Landing() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="w-screen bg-dark-500 flex flex-col relative"
      style={{ WebkitOverflowScrolling: 'touch', touchAction: 'auto' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-500 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,207,253,0.15)_0%,rgba(123,97,255,0.05)_25%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,163,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(123,97,255,0.1)_0%,transparent_50%)] pointer-events-none" />

      {/* Sparkling effects */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-500 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center py-8 md:py-14 min-h-[100vh]">
        <div className="w-full max-w-6xl mx-4 flex flex-col items-center">
          {/* Hero Section */}
          <motion.div className="text-center mb-14" variants={itemVariants}>
            <div className="inline-flex items-center justify-center p-5 mb-7 bg-dark-400/50 rounded-full backdrop-blur-lg shadow-[0_0_12px_rgba(0,207,253,0.3)] relative">
              <FiShield className="h-14 w-14 text-primary-500" />
              <div className="absolute inset-0 rounded-full bg-primary-500 opacity-20 blur-md" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 animate-pulse" />
            </div>
            <motion.h1
              className="text-[2.5rem] md:text-6xl font-bold text-white mb-5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              CipherChat
            </motion.h1>
            <motion.p
              className="text-xl md:text-[1.375rem] text-gray-400 mb-10 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Experience private, encrypted conversations with ease. Stay connected while keeping your chats safe.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => navigate('/auth', { state: { isLogin: true } })}
                className="w-full sm:w-auto px-9 py-3.5 text-lg text-white font-medium bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg hover:from-primary-500 hover:to-secondary-400 transform transition duration-150 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-500 backdrop-blur-lg shadow-[0_0_12px_rgba(0,207,253,0.3)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate('/auth', { state: { isLogin: false } })}
                className="w-full sm:w-auto px-9 py-3.5 text-lg text-white font-medium bg-dark-400/50 rounded-lg border border-primary-500 hover:bg-dark-300/50 transform transition duration-150 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-500 backdrop-blur-lg shadow-[0_0_10px_rgba(0,207,253,0.2)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-7 px-4"
            variants={containerVariants}
          >
            <motion.div
              className="bg-dark-400/50 p-7 rounded-xl backdrop-blur-lg border border-dark-300 shadow-[0_0_12px_rgba(0,207,253,0.1)] flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-dark-300/50 rounded-full flex items-center justify-center mb-5 relative">
                <div
                  className="absolute inset-0 rounded-full bg-primary-500/30 z-[1]"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }}
                />
                <FiLock className="relative h-6 w-6 text-primary-500 z-[2]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">End-to-End Encryption</h3>
              <p className="text-gray-400 text-base">Your messages are encrypted.</p>
              <style>
                {`
                  @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                  }
                `}
              </style>
            </motion.div>

            <motion.div
              className="bg-dark-400/50 p-7 rounded-xl backdrop-blur-lg border border-dark-300 shadow-[0_0_12px_rgba(123,97,255,0.1)] flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-dark-300/50 rounded-full flex items-center justify-center mb-5 relative">
                <div
                  className="absolute inset-0 rounded-full bg-secondary-500/30 z-[1]"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }}
                />
                <FiShare2 className="relative h-6 w-6 text-secondary-500 z-[2]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure File Sharing</h3>
              <p className="text-gray-400 text-base">Share files securely with built-in encryption.</p>
              <style>
                {`
                  @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                  }
                `}
              </style>
            </motion.div>

            <motion.div
              className="bg-dark-400/50 p-7 rounded-xl backdrop-blur-lg border border-dark-300 shadow-[0_0_12px_rgba(0,255,163,0.1)] flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-dark-300/50 rounded-full flex items-center justify-center mb-5 relative">
                <div
                  className="absolute inset-0 rounded-full bg-accent-500/30 z-[1]"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }}
                />
                <FiEyeOff className="relative h-6 w-6 text-accent-500 z-[2]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Privacy First</h3>
              <p className="text-gray-400 text-base">Your privacy is our priority. No tracking.</p>
              <style>
                {`
                  @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                  }
                `}
              </style>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Landing;