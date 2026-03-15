import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-darker border-t border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About NovelTap</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              NovelTap is your premier destination for web novels and digital reading experiences. 
              We provide access to exclusive content with flexible membership plans and secure payment options. 
              Join our community of avid readers and discover your next favorite story today.
            </p>
          </div>

          {/* Contact & Links Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <div className="space-y-3">
              <a
                href="https://t.me/noveltap1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-emerald transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56c-.21 2.31-1.13 7.88-1.6 10.46-.2 1.1-.59 1.47-.97 1.5-.82.07-1.45-.54-2.24-1.06-1.24-.82-1.94-1.33-3.14-2.13-1.39-.92-.49-1.43.3-2.26.21-.22 3.86-3.53 3.92-3.8.01-.04.01-.18-.07-.26s-.2-.04-.29-.02c-.12.03-2.09 1.33-5.91 3.91-.56.38-1.06.57-1.52.56-.5-.01-1.46-.28-2.18-.51-.88-.28-1.57-.43-1.51-.91.03-.25.39-.51 1.07-.78 4.18-1.82 6.96-3.03 8.34-3.63 3.98-1.66 4.8-1.95 5.34-1.96.12 0 .38.03.55.17.14.12.18.28.2.44-.01.06.01.24 0 .36z"/>
                </svg>
                Join our Telegram Group
              </a>
              <div className="text-gray-500 text-sm">
                <p>Get updates and exclusive content</p>
                <p>Connect with fellow readers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 NovelTap. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
