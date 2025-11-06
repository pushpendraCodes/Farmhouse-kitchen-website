import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BranchDetail from './pages/BranchDetail';
import AboutPage from './pages/AboutPage';
import FacilityPage from './pages/FacilityPage';
import MenuPage from './pages/MenuPage';
import SignupPage from './pages/SignupPage';
import OrderPage from './pages/OrderPage';
import ContactPage from './pages/ContactPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBranch, setSelectedBranch] = useState(null);

  const navigate = (page, branch = null) => {
    setCurrentPage(page);
    setSelectedBranch(branch);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'branch':
        return <BranchDetail branch={selectedBranch} />;
      case 'about':
        return <AboutPage />;
      case 'facility':
        return <FacilityPage />;
      case 'menu':
        return <MenuPage />;
      case 'signup':
        return <SignupPage />;
      case 'order':
        return <OrderPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar navigate={navigate} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default App;