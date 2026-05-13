import React, { useState } from 'react';
import { registerUser, loginUser, isAuthenticated } from '../../services/authService'; // Assuming api.js is in services folder
import { CheckCircle, AlertCircle, Building, User, Mail, Lock, Phone, Briefcase, LogIn, UserPlus, Eye, EyeOff, FileText, Award } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'BIDDER',
    company_name: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const registerData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      company_name: formData.company_name,
      phone: formData.phone
    };

    try {
      const response = await registerUser(registerData);
      setSuccess('Registration successful! Please login.');
      // Reset form after 2 seconds
      setTimeout(() => {
        setIsLogin(true);
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'BIDDER',
          company_name: '',
          phone: ''
        });
        setSuccess('');
      }, 2000);
    } catch (err) {
      if (err && typeof err === 'object') {
        const errorMessages = Object.values(err).flat();
        setError(errorMessages[0] || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password) {
      setError('Please enter username and password');
      setLoading(false);
      return;
    }

    const loginData = {
      username: formData.username,
      password: formData.password
    };

    try {
      const response = await loginUser(loginData);
      setSuccess('Login successful! Redirecting...');
      
      // Store user role for dashboard redirection
      localStorage.setItem('userRole', response.role || (formData.username.includes('provider') ? 'TENDER_PROVIDER' : 'BIDDER'));
      localStorage.setItem('username', formData.username);
      
      // Redirect based on role
      setTimeout(() => {
        const role = localStorage.getItem('userRole');
        if (role === 'TENDER_PROVIDER') {
          window.location.href = '/tender-provider-dashboard';
        } else {
          window.location.href = '/bidder-dashboard';
        }
      }, 1000);
    } catch (err) {
      if (err && typeof err === 'object') {
        setError(err.detail || err.non_field_errors?.[0] || 'Invalid credentials. Please try again.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
        {/* Left Panel - Info Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-800 to-indigo-900 p-8 lg:p-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 p-2 rounded-xl">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TenderEval AI</h1>
              <p className="text-blue-200 text-sm">GovTech Procurement Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {isLogin ? 'Welcome Back!' : 'Join the Platform'}
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              {isLogin 
                ? 'Access your dashboard to manage tenders, submit bids, and leverage AI-powered eligibility evaluation.'
                : 'Create your account to participate in government tenders with transparent, AI-driven evaluation.'}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-300 mt-0.5" />
              <div>
                <h3 className="font-semibold">AI-Powered Evaluation</h3>
                <p className="text-blue-200 text-sm">Automatic extraction and verification of tender criteria</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-300 mt-0.5" />
              <div>
                <h3 className="font-semibold">Explainable Decisions</h3>
                <p className="text-blue-200 text-sm">Every verdict comes with source references and reasoning</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-300 mt-0.5" />
              <div>
                <h3 className="font-semibold">Secure & Auditable</h3>
                <p className="text-blue-200 text-sm">Complete audit trail for government compliance</p>
              </div>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-blue-200 text-sm">Tenders Evaluated</div>
            </div>
            <div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-blue-200 text-sm">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Forms */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-12">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                isLogin 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </div>
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                !isLogin 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </div>
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Login
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Demo credentials: username: "Durga", password: "12345678"
              </p>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="username"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="company@example.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                    required
                  >
                    <option value="BIDDER">Bidder (Company)</option>
                    <option value="TENDER_PROVIDER">Tender Provider (Government/CRPF)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Register
                  </>
                )}
              </button>
            </form>
          )}

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              <br />
              This platform is compliant with government procurement standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;