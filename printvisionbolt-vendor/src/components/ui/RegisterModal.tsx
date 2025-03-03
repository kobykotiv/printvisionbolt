import React from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, UserPlus } from 'lucide-react';
import { Modal } from './Modal';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  captcha: string;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: RegisterFormData) => Promise<void>;
}

export function RegisterModal({ isOpen, onClose, onRegister }: RegisterModalProps) {
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<RegisterFormData>();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [captchaValue, setCaptchaValue] = React.useState('');

  // Generate a simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaValue(`${num1} + ${num2}`);
    return num1 + num2;
  };

  React.useEffect(() => {
    if (isOpen) {
      generateCaptcha();
    }
  }, [isOpen]);

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);

    // Verify captcha
    const [num1, , num2] = captchaValue.split(' ');
    const correctAnswer = parseInt(num1) + parseInt(num2);
    
    if (parseInt(data.captcha) !== correctAnswer) {
      setError('Incorrect captcha answer');
      setLoading(false);
      generateCaptcha();
      setValue('captcha', '');
      return;
    }

    try {
      await onRegister(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      generateCaptcha();
      setValue('captcha', '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create an Account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === watch('password') || 'Passwords do not match'
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Verify you're human
          </label>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex-shrink-0 px-4 py-2 bg-gray-100 rounded-md">
              {captchaValue}
            </div>
            <input
              type="text"
              {...register('captcha', {
                required: 'Please solve the captcha'
              })}
              placeholder="Enter the sum"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {errors.captcha && (
            <p className="mt-1 text-sm text-red-600">{errors.captcha.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
}