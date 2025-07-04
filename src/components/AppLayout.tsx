import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import CraftShowcase from './CraftShowcase';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-linen">
      <Header />
      <main>
        <HeroSection />
        <CraftShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;