import React, { useState, useEffect } from 'react';
import NovelList from './NovelList';
import PaymentModal from './PaymentModal';
import SuccessMessage from './SuccessMessage';

interface Novel {
  _id: string;
  title: string;
  price: number;
  qrImageUrl: string;
  coverImageUrl: string;
  description: string;
  category: string;
}

interface Plan {
  name: string;
  price: number;
  duration: string;
}

const HomePage: React.FC = () => {
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [groupLink, setGroupLink] = useState('');
  const [paymentType, setPaymentType] = useState<'novel' | 'membership'>('novel');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fantasy', 'System Apocalypse', 'Dark Fantasy', 'Cultivation', 'Reincarnation', 'Romance', 'Action'];

  // Listen for custom events
  useEffect(() => {
    const handleSelectPlan = (e: any) => {
      setSelectedPlan(e.detail);
      setPaymentType('membership');
      setShowPayment(true);
    };

    const handlePaymentSuccess = (e: any) => {
      setGroupLink(e.detail.groupLink);
      setShowPayment(false);
      setShowSuccess(true);
    };

    window.addEventListener('selectPlan', handleSelectPlan);
    window.addEventListener('paymentSuccess', handlePaymentSuccess);

    return () => {
      window.removeEventListener('selectPlan', handleSelectPlan);
      window.removeEventListener('paymentSuccess', handlePaymentSuccess);
    };
  }, []);

  const handleBuyNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setPaymentType('novel');
    setShowPayment(true);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    setSelectedNovel(null);
    setSelectedPlan(null);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSelectedNovel(null);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-slate-dark">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">NovelTap - Premium Web Novels</h1>
          <p className="text-lg md:text-xl mb-8">Discover exclusive stories and join our premium reading community</p>
          <div className="flex justify-center mt-8">
            <a
              href="/membership"
              className="!bg-emerald-600 !text-white font-extrabold py-4 px-10 rounded-full 
                         uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] 
                         hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] 
                         hover:scale-105 active:scale-95 
                         transition-all duration-300 ease-in-out"
            >
              🔥 Buy Membership
            </a>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Novel List */}
        <NovelList 
          onBuyNovel={handleBuyNovel} 
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Payment Modal */}
      {showPayment && (selectedNovel || selectedPlan) && (
        <PaymentModal
          isOpen={showPayment}
          onClose={handleClosePayment}
          item={selectedNovel || selectedPlan}
          type={paymentType}
        />
      )}

      {/* Success Message */}
      {showSuccess && (
        <SuccessMessage
          onClose={handleCloseSuccess}
          groupLink={groupLink}
        />
      )}
    </div>
  );
};

export default HomePage;
