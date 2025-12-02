import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { mockAuth } from '../utils/mockAuth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' as 'student' | 'admin' | 'mentor',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = mockAuth.login(formData.email, formData.password, formData.role);
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/profile');
      }
    } else {
      setError('Invalid email or password');
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
          title="Login"
          subtitle="Welcome back to GapSense"
        />

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-crimson-accent/20 border border-crimson-accent/50 rounded-lg text-crimson-accent text-sm">
                {error}
              </div>
            )}

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

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Login as
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-crimson-accent focus:ring-crimson-accent/50"
                />
                <label htmlFor="remember" className="text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-crimson-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-crimson-accent hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;

