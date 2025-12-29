import React from 'react';
import milestoneLogo from '@/assets/milestone-logo.png';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 bg-card border-b border-border">
      <div className="max-w-4xl mx-auto flex justify-center">
        <img 
          src={milestoneLogo} 
          alt="Milestone - Lead By Nature" 
          className="h-12 object-contain"
        />
      </div>
    </header>
  );
};

export default Header;
