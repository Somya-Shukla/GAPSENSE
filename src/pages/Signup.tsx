import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { mockAuth } from '../utils/mockAuth';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'admin' | 'mentor'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const user = mockAuth.signup(formData.name, formData.email, formData.password, formData.role);
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/profile');
      }
    } else {
      setError('Failed to create account');
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <PageHeader
          title="Sign Up"
          subtitle="Create your GapSense account"
        />

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-crimson-accent/20 border border-crimson-accent/50 rounded-lg text-crimson-accent text-sm">
                {error}
              </div>
            )}

            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Sign up as
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'student' | 'admin' | 'mentor' })}
                className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 text-white"
                title="Select role"
              >
                <option value="student" className="bg-dark-blue text-white">Student</option>
                <option value="mentor" className="bg-dark-blue text-white">Mentor</option>
                <option value="admin" className="bg-dark-blue text-white">Admin</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Sign Up
            </Button>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-crimson-accent hover:underline">
                Login
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;

