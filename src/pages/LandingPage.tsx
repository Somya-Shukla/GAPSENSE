import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import GapCard from '../components/GapCard';
import Card from '../components/Card';
import Hero3D from '../components/3DHero';
import { mockData } from '../utils/mockData';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 neon-glow">
              GapSense
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8">
              Real-time Student Struggle Analyzer & Mentor Match
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-8">
              Connect with mentors, share your struggles anonymously, and get the support you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate('/submit')} variant="primary">
                Submit a Struggle
              </Button>
              <Button onClick={() => navigate('/community')} variant="secondary">
                View Community
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Hero3D />
          </motion.div>
        </div>
      </section>

      {/* Gap Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GapCard
            title="Today's Most Common Struggle"
            value={mockData.getMostCommonStruggle()}
            icon="📊"
            delay={0.1}
          />
          <GapCard
            title="Fastest Growing Category"
            value={mockData.getFastestGrowingCategory()}
            icon="📈"
            delay={0.2}
          />
          <GapCard
            title="Most Active Time"
            value={mockData.getMostActiveTime()}
            icon="⏰"
            delay={0.3}
          />
        </div>
      </section>

      {/* Why GapSense */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why GapSense?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
            <p className="text-gray-300">Track and analyze student struggles in real-time</p>
          </Card>
          <Card>
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-300">Get matched with mentors who understand your needs</p>
          </Card>
          <Card>
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Anonymous & Safe</h3>
            <p className="text-gray-300">Share your struggles anonymously in a safe space</p>
          </Card>
          <Card>
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-300">Connect with peers facing similar challenges</p>
          </Card>
        </div>
      </section>

      {/* How It Helps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">How GapSense Helps Students</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-xl p-8"
          >
            <h3 className="text-2xl font-semibold mb-4">1. Identify Struggles</h3>
            <p className="text-gray-300">
              Submit your struggles in a safe, anonymous environment. Our system automatically categorizes and tags them for better matching.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-8"
          >
            <h3 className="text-2xl font-semibold mb-4">2. Get Matched</h3>
            <p className="text-gray-300">
              Our AI-powered system matches you with experienced mentors who specialize in your area of struggle.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-8"
          >
            <h3 className="text-2xl font-semibold mb-4">3. Book Sessions</h3>
            <p className="text-gray-300">
              Schedule one-on-one sessions with your matched mentor to get personalized guidance and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Our Expert Mentors</h2>
        <p className="text-center text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
          Connect with experienced mentors who are passionate about helping students succeed. Our mentors specialize in various areas including technical skills, academic support, career guidance, and mental health.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-4xl mb-4">👨‍💻</div>
            <h3 className="text-xl font-semibold mb-2">Technical Mentors</h3>
            <p className="text-gray-300 text-sm">
              Get help with programming, algorithms, system design, and technical interviews from industry professionals.
            </p>
          </Card>
          <Card>
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Academic Mentors</h3>
            <p className="text-gray-300 text-sm">
              Improve your study strategies, time management, and academic performance with expert guidance.
            </p>
          </Card>
          <Card>
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Career Mentors</h3>
            <p className="text-gray-300 text-sm">
              Navigate your career path, build your resume, ace interviews, and grow professionally.
            </p>
          </Card>
          <Card>
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Mental Health</h3>
            <p className="text-gray-300 text-sm">
              Get support for stress, anxiety, imposter syndrome, and other mental health challenges.
            </p>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Button onClick={() => navigate('/book-session')} variant="primary">
            Browse All Mentors
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

