import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', password2: ''
  });
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
    if (form.password !== form.password2) {
      setErrors({ password2: ["Passwords don't match."] });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await register(form);
      toast.success('Account created! Welcome');
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data ?? {};
      setErrors(data);
      const firstMsg = Object.values(data).flat()[0];
      if (firstMsg) toast.error(firstMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shadow">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-xl">TaskFlow</span>
        </div>
        <div className="card p-7">
          <h1 className="text-xl font-bold text-slate-800 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-6">Join your team and start managing tasks</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
                <input name="first_name" type="text" value={form.first_name} onChange={handleChange} placeholder="Jane" required className="input" />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                <input name="last_name" type="text" value={form.last_name} onChange={handleChange} placeholder="Doe" required className="input" />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" required className="input" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required className="input pr-10" />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
              <input name="password2" type="password" value={form.password2} onChange={handleChange} placeholder="Repeat password" required className="input" />
              {errors.password2 && <p className="text-red-500 text-xs mt-1">{errors.password2[0]}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
