import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Briefcase as AgencyIcon,
  Edit2 as EditIcon,
  CheckCircle as SaveIcon,
  XCircle as CancelIcon,
  Lock as PasswordIcon,
  Mail as EmailIcon,
} from 'lucide-react';
import axios from 'axios';
import Footer from '../Components/Footer';

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [backup, setBackup] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user: { email: '', password: '', confirmPassword: '' },
    agency: {
      _id: '',
      username: '',
      agencyName: '',
      contactPerson: '',
      address: { street: '', city: '', zipCode: '', state: '', country: '' },
      phoneNumber: '',
      billingEmail: '',
      remarks: '',
    },
  });

  // Fetch user + agency
  useEffect(() => {
    (async () => {
      try {
        const [{ data: user }, { data: agencies }] = await Promise.all([
          axios.get('/users/me'),
          axios.get('/agency'),
        ]);
        setFormData(fd => ({
          ...fd,
          user: {
            email: user.email || '',
            password: '',
            confirmPassword: '',
          },
        }));

        // Find the agency that belongs to the current user
        const mine = agencies?.find(a => 
          a?.user === user?.userId || a?.user?._id === user?.userId
        );
        if (mine) {
          setFormData(fd => ({
            ...fd,
            agency: {
              _id: mine._id || '',
              username: mine.username || '',
              agencyName: mine.agencyName || '',
              contactPerson: mine.contactPerson || '',
              address: {
                street: mine.address?.street || '',
                city: mine.address?.city || '',
                zipCode: mine.address?.zipCode || '',
                state: mine.address?.state || '',
                country: mine.address?.country || '',
              },
              phoneNumber: mine.phoneNumber || '',
              billingEmail: mine.billingEmail || '',
              remarks: mine.remarks || '',
            },
          }));
        } else {
          console.warn('No agency profile found for the current user');
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        alert('Failed to load your settings. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (section, name, value) => {
    setFormData(fd => ({
      ...fd,
      [section]: { ...fd[section], [name]: value },
    }));
    setErrors(errs => ({ ...errs, [name]: '' }));
  };
  const handleAddressChange = (field, value) => {
    setFormData(fd => ({
      ...fd,
      agency: {
        ...fd.agency,
        address: { ...fd.agency.address, [field]: value },
      },
    }));
  };

  const validate = () => {
    const errs = {};
    const { user, agency } = formData;
    if (!user.email.trim()) errs.email = 'Email is required';
    if (user.password && user.password !== user.confirmPassword)
      errs.confirmPassword = 'Passwords must match';
    if (!agency.username.trim()) errs.username = 'Username required';
    if (!agency.agencyName.trim()) errs.agencyName = 'Agency name required';
    if (!agency.contactPerson.trim())
      errs.contactPerson = 'Contact person required';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const enableEdit = () => {
    setBackup(JSON.parse(JSON.stringify(formData)));
    setEditMode(true);
    setSuccessMessage('');
  };
  const cancelEdit = () => {
    setFormData(backup);
    setEditMode(false);
    setErrors({});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!window.confirm('💾 Save changes?')) return;
    if (!validate()) return;
    try {
      const { user, agency } = formData;
      await axios.put('/users/me', { email: user.email, ...(user.password && { password: user.password }) });
      await axios.put(`/agency/${agency._id}`, { ...agency });
      setSuccessMessage('✅ Settings saved!');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert('Save failed.');
    }
  };

  if (loading) {
    return (
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'} ml-0 flex items-center justify-center`}>
        <div className="animate-spin h-10 md:h-12 w-10 md:w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const inputCls = edit =>
    `w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 text-sm md:text-base ${
      edit ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
    }`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r p-4 md:p-6 rounded-b-3xl text-black mb-6 md:mb-8">
        <div className="max-w-3xl md:max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <EditIcon className="mr-2 w-5 md:w-6 h-5 md:h-6" /> Account Settings
          </h1>
          {!editMode && (
            <button
              onClick={enableEdit}
              className="flex items-center bg-white text-indigo-600 px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow hover:bg-gray-100 text-sm md:text-base"
            >
              <EditIcon className="mr-1 w-4 md:w-5 h-4 md:h-5" /> Edit
            </button>
          )}
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl md:max-w-4xl mx-auto px-4 md:px-0 space-y-6 md:space-y-8 pb-12 md:pb-16"
      >
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-3 md:px-4 py-2 md:py-3 rounded mb-3 md:mb-4 text-xs md:text-sm">
            {successMessage}
          </div>
        )}

        {/* ── USER PROFILE ───────────────────────────────────────── */}
        <section className="bg-white p-4 md:p-8 rounded-xl shadow-lg space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center">
            <UserIcon className="mr-2 w-5 md:w-6 h-5 md:h-6 text-indigo-600" /> User Profile
          </h2>
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            {/* Email */}
            <div>
              <label className="block text-sm md:text-base font-medium mb-1">Email</label>
              <div className="relative">
                <EmailIcon className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={16} md:size={18} />
                <input
                  type="email"
                  value={formData.user.email}
                  onChange={e => handleChange('user', 'email', e.target.value)}
                  disabled={!editMode}
                  className={`${inputCls(editMode)} pl-9 md:pl-10`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* New Password */}
            {editMode && (
              <div>
                <label className="block text-sm md:text-base font-medium mb-1">New Password</label>
                <div className="relative">
                  <PasswordIcon className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={16} md:size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.user.password}
                    onChange={e => handleChange('user', 'password', e.target.value)}
                    disabled={!editMode}
                    className={`${inputCls(editMode)} pl-9 md:pl-10`}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            {editMode && (
              <div>
                <label className="block text-sm md:text-base font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <PasswordIcon className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={16} md:size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.user.confirmPassword}
                    onChange={e =>
                      handleChange('user', 'confirmPassword', e.target.value)
                    }
                    disabled={!editMode}
                    className={`${inputCls(editMode)} pl-9 md:pl-10`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── AGENCY PROFILE ─────────────────────────────────────── */}
        <section className="bg-white p-4 md:p-8 rounded-xl shadow-lg space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center">
            <AgencyIcon className="mr-2 w-5 md:w-6 h-5 md:h-6 text-indigo-600" /> Agency Profile
          </h2>
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            {/* Username */}
            <div>
              <label className="block text-sm md:text-base font-medium mb-1">Username</label>
              <input
                value={formData.agency.username}
                onChange={e => handleChange('agency', 'username', e.target.value)}
                disabled={!editMode}
                className={inputCls(editMode)}
              />
              {errors.username && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.username}</p>
              )}
            </div>
            {/* Agency Name */}
            <div>
              <label className="block text-sm md:text-base font-medium mb-1">Agency Name</label>
              <input
                value={formData.agency.agencyName}
                onChange={e =>
                  handleChange('agency', 'agencyName', e.target.value)
                }
                disabled={!editMode}
                className={inputCls(editMode)}
              />
              {errors.agencyName && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.agencyName}</p>
              )}
            </div>
            {/* Contact Person */}
            <div>
              <label className="block text-sm md:text-base font-medium mb-1">Contact Person</label>
              <input
                value={formData.agency.contactPerson}
                onChange={e =>
                  handleChange('agency', 'contactPerson', e.target.value)
                }
                disabled={!editMode}
                className={inputCls(editMode)}
              />
              {errors.contactPerson && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.contactPerson}</p>
              )}
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm md:text-base font-medium mb-1">Phone Number</label>
              <input
                value={formData.agency.phoneNumber}
                onChange={e =>
                  handleChange('agency', 'phoneNumber', e.target.value)
                }
                disabled={!editMode}
                className={inputCls(editMode)}
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-4 md:mt-6">
            <h3 className="text-sm md:text-base font-medium mb-2">Address</h3>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
              {['street', 'city', 'state', 'zipCode', 'country'].map(f => (
                <div key={f}>
                  <label className="block text-sm md:text-base text-gray-700 mb-1">
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </label>
                  <input
                    value={formData.agency.address[f]}
                    onChange={e => handleAddressChange(f, e.target.value)}
                    disabled={!editMode}
                    className={inputCls(editMode)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Billing Email */}
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Billing Email</label>
            <input
              type="email"
              value={formData.agency.billingEmail}
              onChange={e =>
                handleChange('agency', 'billingEmail', e.target.value)
              }
              disabled={!editMode}
              className={inputCls(editMode)}
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Remarks</label>
            <textarea
              rows="3"
              value={formData.agency.remarks}
              onChange={e => handleChange('agency', 'remarks', e.target.value)}
              disabled={!editMode}
              className={`${inputCls(editMode)} resize-none`}
            />
          </div>
        </section>

        {/* ── ACTION BUTTONS ────────────────────────────────────── */}
        {editMode && (
          <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Discard changes?')) cancelEdit();
              }}
              className="flex items-center justify-center bg-gray-200 px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-gray-300 w-full md:w-auto text-sm md:text-base"
            >
              <CancelIcon className="mr-1 w-4 md:w-5 h-4 md:h-5 text-red-600" /> Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center bg-indigo-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-indigo-700 w-full md:w-auto text-sm md:text-base"
            >
              <SaveIcon className="mr-1 w-4 md:w-5 h-4 md:h-5" /> Save Changes
            </button>
          </div>
        )}
      </form>

      <Footer />
    </div>
  );
}