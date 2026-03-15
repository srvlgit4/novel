import React from 'react';

interface SuccessMessageProps {
  groupLink: string;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ groupLink, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-darker rounded-lg max-w-md w-full p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-emerald rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            🎉 Payment Successful!
          </h2>
          <p className="text-gray-300 mb-6">
            Your membership has been activated. You now have access to premium novels.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-3">Join our Telegram group:</p>
          <a
            href={groupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-dark hover:bg-blue-light text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Join Telegram Group
          </a>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
