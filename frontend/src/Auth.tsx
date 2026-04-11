import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Scissors, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface AuthProps {
  onLogin: (userData: any) => void;
  apiBaseUrl: string;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, apiBaseUrl }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin ? '/api/auth/v1/login' : '/api/auth/v1/register';
    
    try {
      const response = await axios.post(`${apiBaseUrl}${endpoint}`, formData, {
        withCredentials: true // Important for cookies
      });

      if (isLogin) {
        onLogin(response.data.user);
      } else {
        // After successful registration, switch to login
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-wrapper">
      <motion.div 
        className="tool-card auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="feature-icon" style={{ margin: '0 auto 1.5rem' }}>
            <Scissors size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Enter your details to manage your links' : 'Sign up to start shortening links with your own custom limits'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <div className="input-icon-wrapper">
                <User className="input-icon" size={20} />
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Full Name" 
                  className="input-field"
                  value={formData.fullName}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="loading-spinner" size={20} />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {error && (
            <p className="error-msg" style={{ textAlign: 'center', marginTop: '1rem' }}>{error}</p>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: 'var(--primary)', fontWeight: 600, marginLeft: '0.25rem' }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
