import React from 'react';

interface NavbarProps {
  onLogoClick: () => void;
  logoSrc: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogoClick, logoSrc }) => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="container mx-auto max-w-6xl flex justify-between items-center">
        <div onClick={onLogoClick} className="flex items-center gap-3 cursor-pointer group">
          <img src={logoSrc} alt="Logo" className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold text-white tracking-wide group-hover:text-brand-crimson transition-colors">AI Wala Jhol</span>
        </div>
      </div>
    </header>
  );
};