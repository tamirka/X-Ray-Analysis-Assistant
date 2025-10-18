
import React, { useRef } from 'react';

interface UploadStepProps {
  onImageChange: (file: File | null) => void;
  onAnalyze: () => void;
  previewUrl: string | null;
  error: string | null;
  isAnalyzing: boolean;
  hasImage: boolean;
}

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
);

const UploadStep: React.FC<UploadStepProps> = ({ onImageChange, onAnalyze, previewUrl, error, isAnalyzing, hasImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center transition-all duration-300">
      <h2 className="text-3xl font-bold text-slate-800 text-center">Get a Preliminary X-Ray Analysis</h2>
      <p className="text-slate-600 mt-2 text-center max-w-lg">
        Upload your X-ray image to receive an instant, AI-powered preliminary analysis. This tool helps identify areas for discussion with your doctor.
      </p>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mt-8 w-full h-64 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-colors"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {previewUrl ? (
          <img src={previewUrl} alt="X-Ray Preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-slate-500">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md w-full text-center">{error}</p>}

      <button
        onClick={onAnalyze}
        disabled={!hasImage || isAnalyzing}
        className="mt-8 w-full py-4 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-lg"
      >
        {isAnalyzing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze X-Ray'
        )}
      </button>
    </div>
  );
};

export default UploadStep;
