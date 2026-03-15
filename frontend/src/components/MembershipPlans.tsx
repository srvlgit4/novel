import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Plan {
  name: string;
  price: number;
  duration: string;
  features: string[];
  isBestValue?: boolean;
}

const MembershipPlans: React.FC = () => {
  const navigate = useNavigate();

  const plans: Plan[] = [
    {
      name: 'Trial',
      price: 59,
      duration: '15 Days',
      features: ['Access to 5 novels', 'Basic support', 'Mobile reading'],
      isBestValue: false
    },
    {
      name: 'Basic',
      price: 100,
      duration: '1 Month',
      features: ['Access to all novels', 'Priority support', 'Offline downloads', 'Mobile reading'],
      isBestValue: false
    },
    {
      name: 'Standard',
      price: 195,
      duration: '2 Months',
      features: ['Access to all novels', 'Priority support', 'Offline downloads', 'Mobile reading', 'Early access to new chapters'],
      isBestValue: false
    },
    {
      name: 'Premium',
      price: 285,
      duration: '3 Months',
      features: ['Access to all novels', 'Priority support', 'Offline downloads', 'Mobile reading', 'Early access to new chapters', 'Exclusive content'],
      isBestValue: false
    },
    {
      name: 'VIP',
      price: 565,
      duration: '6 Months',
      features: ['Access to all novels', 'Priority support', 'Offline downloads', 'Mobile reading', 'Early access to new chapters', 'Exclusive content', 'Author interactions'],
      isBestValue: false
    },
    {
      name: 'Lifetime',
      price: 1125,
      duration: '1 Year',
      features: ['Access to all novels', 'Priority support', 'Offline downloads', 'Mobile reading', 'Early access to new chapters', 'Exclusive content', 'Author interactions', 'Lifetime updates'],
      isBestValue: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-dark py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with back button */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Back to Home
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Reading Plan</h1>
          <p className="text-gray-400 text-lg">Unlock unlimited access to our premium novel collection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-slate-darker rounded-xl p-8 border-2 transition-all duration-300 hover:transform hover:scale-105 hover:border-emerald-500 ${
                plan.isBestValue
                  ? 'border-emerald shadow-lg shadow-emerald/20'
                  : 'border-gray-700'
              }`}
            >
              {plan.isBestValue && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-emerald mb-1">
                  ₹{plan.price}
                </div>
                <div className="text-gray-400">{plan.duration}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-emerald mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  const event = new CustomEvent('selectPlan', { detail: plan });
                  window.dispatchEvent(event);
                }}
                className="w-full bg-slate-dark hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
