import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import { User, Mail, Shield, Key, Save, Calendar } from 'lucide-react';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
  });
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleProfileChange = (e) => {
    setProfileForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setProfileErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setPasswordErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await authApi.updateMe(profileForm);
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch (err) {
      const data = err.response?.data ?? {};
      setProfileErrors(data);
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm) {
      setPasswordErrors({ confirm: ["Passwords don't match."] });
      return;
    }
    setPasswordLoading(true);
    try {
      await authApi.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      toast.success('Password changed!');
      setPasswordForm({ old_password: '', new_password: '', confirm: '' });
    } catch (err) {
      const data = err.response?.data ?? {};
      setPasswordErrors(data);
      const firstMsg = Object.values(data).flat()[0];
      if (firstMsg) toast.error(firstMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Profile Settings</h2>
        <p className="text-sm text-slate-400">Manage your account information</p>
      </div>

      {/* Avatar + info */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{user?.first_name} {user?.last_name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Mail size={13} /> {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge value={user?.role} />
              {user?.date_joined && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar size={11} /> Joined {format(new Date(user.date_joined), 'MMM yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit profile */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <User size={15} className="text-brand-600" /> Personal Information
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
              <input name="first_name" value={profileForm.first_name} onChange={handleProfileChange} className="input" required />
              {profileErrors.first_name && <p className="text-red-500 text-xs mt-1">{profileErrors.first_name[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
              <input name="last_name" value={profileForm.last_name} onChange={handleProfileChange} className="input" required />
              {profileErrors.last_name && <p className="text-red-500 text-xs mt-1">{profileErrors.last_name[0]}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={user?.email} disabled className="input pl-9 bg-slate-50 text-slate-400 cursor-not-allowed" />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <div className="relative">
              <Shield size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={user?.role === 'admin' ? 'Admin' : 'Member'} disabled className="input pl-9 bg-slate-50 text-slate-400 cursor-not-allowed capitalize" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={profileLoading} className="btn-primary">
              <Save size={15} /> {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Key size={15} className="text-brand-600" /> Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current password</label>
            <input name="old_password" type="password" value={passwordForm.old_password} onChange={handlePasswordChange} className="input" required placeholder="••••••••" />
            {passwordErrors.old_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.old_password[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
            <input name="new_password" type="password" value={passwordForm.new_password} onChange={handlePasswordChange} className="input" required placeholder="Min. 8 characters" />
            {passwordErrors.new_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.new_password[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
            <input name="confirm" type="password" value={passwordForm.confirm} onChange={handlePasswordChange} className="input" required placeholder="Repeat new password" />
            {passwordErrors.confirm && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm[0]}</p>}
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={passwordLoading} className="btn-primary">
              <Key size={15} /> {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
