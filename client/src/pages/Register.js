import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: 'voter',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-4xl w-full mx-auto bg-white shadow rounded-lg p-6 md:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h2 className="mt-4 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to register as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['voter', 'candidate'].map(type => (
                <label key={type} className="relative">
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={formData.userType === type}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.userType === type
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="text-center">
                      <div className="text-lg font-semibold capitalize">{type}</div>
                      <div className="text-sm text-gray-600">
                        {type === 'voter' ? 'Cast your vote' : 'Stand for election'}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* First & Last Name */}
          {['firstName', 'lastName'].map((field, idx) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field === 'firstName' ? 'First name' : 'Last name'}
              </label>
              <div className="mt-1 relative">
                <FiUser className="absolute inset-y-0 left-3 my-auto text-gray-400" />
                <input
                  id={field}
                  name={field}
                  type="text"
                  required
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field === 'firstName' ? 'First name' : 'Last name'}
                  className={`input-field pl-10 ${errors[field] ? 'border-red-500' : ''}`}
                />
              </div>
              {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}

          {/* Username */}
          <div className="md:col-span-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1 relative">
              <FiUser className="absolute inset-y-0 left-3 my-auto text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className={`input-field pl-10 ${errors.username ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <div className="mt-1 relative">
              <FiMail className="absolute inset-y-0 left-3 my-auto text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number (optional)</label>
            <div className="mt-1 relative">
              <FiPhone className="absolute inset-y-0 left-3 my-auto text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Password & Confirm */}
          {['password', 'confirmPassword'].map((field, idx) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field === 'password' ? 'Password' : 'Confirm password'}
              </label>
              <div className="mt-1 relative">
                <FiLock className="absolute inset-y-0 left-3 my-auto text-gray-400" />
                <input
                  id={field}
                  name={field}
                  type={
                    field === 'password'
                      ? (showPassword ? 'text' : 'password')
                      : (showConfirmPassword ? 'text' : 'password')
                  }
                  required
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field === 'password' ? 'Create a password' : 'Confirm your password'}
                  className={`input-field pl-10 pr-10 ${errors[field] ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    field === 'password'
                      ? setShowPassword(!showPassword)
                      : setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {(field === 'password' ? showPassword : showConfirmPassword)
                    ? <FiEyeOff className="text-gray-400" />
                    : <FiEye className="text-gray-400" />}
                </button>
              </div>
              {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
