import { useState } from 'react';
import VerifyInformation from './VerifyInformation';
import Login from './Login';
import Authentication from './Authentication';

type Page = 'verify' | 'login' | 'authentication' | 'complete';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('verify');
  const [username, setUsername] = useState('');

  const handleVerifyNext = () => {
    setCurrentPage('login');
  };

  const handleLoginNext = (enteredUsername: string) => {
    setUsername(enteredUsername);
    setCurrentPage('authentication');
  };

  const handleAuthComplete = () => {
    setCurrentPage('complete');
  };

  const handleBackToVerify = () => {
    setCurrentPage('verify');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  if (currentPage === 'complete') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="bg-white rounded-lg shadow-sm p-10 max-w-md w-full text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Successfully Logged In
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome back, {username}!
          </p>
          <button
            onClick={() => setCurrentPage('verify')}
            className="text-sm text-[#368727] hover:underline"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'verify' && (
        <VerifyInformation onNext={handleVerifyNext} />
      )}
      {currentPage === 'login' && (
        <Login
          onNext={handleLoginNext}
          onBack={handleBackToVerify}
        />
      )}
      {currentPage === 'authentication' && (
        <Authentication
          username={username}
          onComplete={handleAuthComplete}
          onBack={handleBackToLogin}
        />
      )}
    </>
  );
}

export default App;
