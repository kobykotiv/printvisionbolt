import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Captcha from '../components/ui/Captcha';
import SocialLoginButton from '../components/ui/SocialLoginButton';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  isStrong: boolean;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithProvider } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: '',
    isStrong: false
  });

  const validatePassword = (password: string): PasswordStrength => {
    let score = 0;
    let feedback = '';

    // Length check
    if (password.length < 8) {
      feedback = 'Password must be at least 8 characters long';
    } else {
      score += 1;
    }

    // Uppercase letter check
    if (/[A-Z]/.test(password)) score += 1;
    // Lowercase letter check
    if (/[a-z]/.test(password)) score += 1;
    // Number check
    if (/[0-9]/.test(password)) score += 1;
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 3 && !feedback) {
      feedback = 'Password should include uppercase, lowercase, numbers, and special characters';
    }

    return {
      score,
      feedback,
      isStrong: score >= 3
    };
  };

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(validatePassword(formData.password));
    }
  }, [formData.password]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordStrength.isStrong) {
      newErrors.password = passwordStrength.feedback;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (error: unknown) {
      setGeneralError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred during registration. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const renderPasswordStrengthBar = () => {
    const getColor = () => {
      if (passwordStrength.score < 2) return 'bg-red-500';
      if (passwordStrength.score < 4) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    return (
      <div className="mt-1">
        <div className="h-1 w-full bg-gray-200 rounded-full">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${getColor()}`}
            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
          />
        </div>
        {passwordStrength.feedback && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {passwordStrength.feedback}
          </p>
        )}
      </div>
    );
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign in
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
                  label="Full Name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  aria-label="Full name"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  aria-label="Password"
                />
                {formData.password && renderPasswordStrengthBar()}
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  aria-label="Confirm password"
                />
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
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
              By creating an account, you agree to our{' '}
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

export default SignUp;