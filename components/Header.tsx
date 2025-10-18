
import React from 'react';

const StethoscopeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M4 14a2 2 0 1 0 4 0V6a6 6 0 1 1 12 0v8a2 2 0 1 0 4 0"/>
        <path d="M4 14v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2"/>
        <circle cx="20" cy="14" r="2"/>
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
            <StethoscopeIcon className="h-8 w-8 text-blue-600"/>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                X-Ray Analysis Assistant
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
