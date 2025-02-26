import React, { useState, useEffect } from 'react';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
    setUserInput('');
    setError('');
    setVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setVerified(true);
      setError('');
      onVerify(true);
    } else {
      setError('Incorrect captcha. Please try again.');
      generateCaptcha();
      onVerify(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-4">
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <div className="select-none font-mono text-lg tracking-widest text-gray-700 dark:text-gray-300 
                         transform -skew-x-12 inline-block px-4 py-2 bg-white dark:bg-gray-700 rounded">
            {captchaText}
          </div>
          <button
            type="button"
            onClick={generateCaptcha}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter the code above"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {verified && (
            <p className="text-green-500 text-sm">✓ Verification successful</p>
          )}
          {!verified && (
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Verify
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Captcha;