
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="container mx-auto px-4 py-6 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Your Clinic Name. All rights reserved.</p>
        <p className="mt-2 font-semibold">
          Disclaimer: This tool provides a preliminary AI-based analysis and is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
