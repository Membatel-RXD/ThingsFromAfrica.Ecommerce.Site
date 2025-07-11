import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import CraftShowcase from './CraftShowcase';
import Footer from './Footer';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-linen">
      <Header />
      <main>
        {children ? children : (
          <>
            <HeroSection />
            <CraftShowcase />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;