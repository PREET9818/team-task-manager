import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, Mail, Lock, CheckCircle, Users, BarChart3, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.non_field_errors) toast.error(data.non_field_errors[0]);
      else if (data?.detail) toast.error(data.detail);
      else setErrors(data ?? {});
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: CheckCircle, text: 'Create & manage projects easily' },
    { icon: Users, text: 'Assign tasks to team members' },
    { icon: BarChart3, text: 'Track progress in real-time' },
    { icon: Shield, text: 'Role-based access control' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 flex-col justify-between p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl">TaskFlow</span>
        </div>

        {/* Middle content */}
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-3">
            Manage your team<br />with confidence.
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-8">
            Assign tasks, track progress, and deliver projects on time — all in one beautifully simple workspace.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        
          <p className="text-white/90 text-sm italic leading-relaxed">
            "TaskFlow helped our team stay organized and deliver projects 40% faster."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Sarah Johnson</p>
              <p className="text-blue-200 text-xs">Project Manager, TechCorp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">TaskFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className="input pl-9"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 text-base"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}