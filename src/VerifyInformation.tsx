interface VerifyInformationProps {
  onNext: () => void;
}

function VerifyInformation({ onNext }: VerifyInformationProps) {
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
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Welcome
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Please verify your information to continue
            </p>

            <div>
              <button
                onClick={onNext}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded font-semibold text-base text-white bg-[#368727] hover:bg-[#2d6e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#368727] transition-colors"
              >
                Continue
              </button>
            </div>
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

export default VerifyInformation;
