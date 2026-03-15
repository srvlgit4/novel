import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MembershipPlans from './components/MembershipPlans';
import AdminLogin from './components/AdminLogin';
import AdminDashboardEnhanced from './components/AdminDashboardEnhanced';
import AdminAddNovelEnhanced from './components/AdminAddNovelEnhanced';
import ProtectedRoute from './components/ProtectedRoute';
import UserStatus from './components/UserStatus';
import PaymentModal from './components/PaymentModal';
import SuccessMessage from './components/SuccessMessage';
import NovelDetail from './components/NovelDetail';

interface Novel {
  _id: string;
  title: string;
  price: number;
  qrImageUrl: string;
}

interface Plan {
  name: string;
  price: number;
  duration: string;
}

// Main App Content Component
const AppContent: React.FC = () => {
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [groupLink, setGroupLink] = useState('');
  const [paymentType, setPaymentType] = useState<'novel' | 'membership'>('novel');
  const location = useLocation();

  // Listen for custom events (move before early returns)
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

  // Check if current page should show Navbar/Footer
  const showLayout = !location.pathname.startsWith('/admin-login');

  return (
    <div className="App min-h-screen flex flex-col">
      {showLayout && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/my-status" element={<UserStatus />} />
          <Route path="/membership" element={<MembershipPlans />} />
          <Route path="/novel/:id" element={<NovelDetail />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboardEnhanced />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-novel" element={
            <ProtectedRoute>
              <AdminAddNovelEnhanced />
            </ProtectedRoute>
          } />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {showLayout && <Footer />}
      
      {showPayment && (selectedNovel || selectedPlan) && (
        <PaymentModal
          isOpen={showPayment}
          onClose={handleClosePayment}
          item={selectedNovel || selectedPlan}
          type={paymentType}
        />
      )}
      
      {showSuccess && (
        <SuccessMessage
          groupLink={groupLink}
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  );
};

// Main App Component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
