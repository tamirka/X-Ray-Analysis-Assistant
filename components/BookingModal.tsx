import React, { useState, FormEvent, useEffect } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Close modal on 'Escape' key press for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Booking Request:', { name, contact });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setTimeout(() => {
      setName('');
      setContact('');
      setIsSubmitted(false);
      onClose();
    }, 200); // Delay reset to allow for closing animation
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        {isSubmitted ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckIcon className="h-8 w-8 text-green-600"/>
            </div>
            <h2 id="booking-modal-title" className="text-2xl font-bold text-slate-800 mt-5">Request Sent!</h2>
            <p className="mt-2 text-slate-600">Thank you, {name}. Our team will contact you shortly to confirm your appointment.</p>
            <button
              onClick={handleClose}
              className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="booking-modal-title" className="text-2xl font-bold text-slate-800">Request an Appointment</h2>
            <p className="mt-2 text-slate-600">Our team will contact you at the provided details to schedule your visit.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-slate-700 mb-1">Email or Phone Number</label>
                <input
                  type="text"
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., jane.doe@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={!name || !contact}
                className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                Submit Request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
