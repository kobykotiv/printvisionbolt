import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Captcha from '../components/ui/Captcha';
import SocialLoginButton from '../components/ui/SocialLoginButton';

type DemoType = 'standard' | 'admin';

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithProvider, loginAsDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm() || !isCaptchaVerified) {
      if (!isCaptchaVerified) {
        setGeneralError('Please complete the captcha verification');
      }
      return;
    }

    setIsLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      navigate('/dashboard');
    } catch (error: unknown) {
      setGeneralError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred during login. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      await loginWithProvider(provider);
    } catch (error: unknown) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'Failed to login with social provider. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="PrintVision.Cloud"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-4">
              <SocialLoginButton
                provider="google"
                onClick={() => handleSocialLogin('google')}
              />
              <SocialLoginButton
                provider="github"
                onClick={() => handleSocialLogin('github')}
              />

              <div className="flex gap-4 w-full">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setIsLoading(true);
                    loginAsDemo('standard')
                      .then(() => navigate('/dashboard'))
                      .catch(error => setGeneralError(error.message))
                      .finally(() => setIsLoading(false));
                  }}
                >
                  Try Demo
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setIsLoading(true);
                    loginAsDemo('admin')
                      .then(() => navigate('/dashboard'))
                      .catch(error => setGeneralError(error.message))
                      .finally(() => setIsLoading(false));
                  }}
                >
                  Try Admin Demo
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

            <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  aria-label="Email address"
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  aria-label="Password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded
                             dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Captcha onVerify={setIsCaptchaVerified} />

              {generalError && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                  <div className="text-sm text-red-700 dark:text-red-200">
                    {generalError}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={!isCaptchaVerified}
              >
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;