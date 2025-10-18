import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisStepProps {
  analysisResult: AnalysisResult | null;
  error: string | null;
  onReset: () => void;
  onBookAppointment: () => void;
}

const ResultDisplay: React.FC<{ result: AnalysisResult; onReset: () => void, onBookAppointment: () => void; }> = ({ result, onReset, onBookAppointment }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">Analysis Report</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Findings</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-600 bg-slate-50 p-4 rounded-md">
            {result.findings.map((finding, index) => <li key={index}>{finding}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">Potential Issues</h3>
           <ul className="list-disc list-inside space-y-1 text-yellow-800 bg-yellow-50 p-4 rounded-md border border-yellow-200">
            {result.potentialIssues.map((issue, index) => <li key={index}>{issue}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-green-700 mb-2">Doctor's Recommendation</h3>
          <p className="text-slate-800 bg-green-50 p-4 rounded-md border border-green-200">
            {result.recommendation}
          </p>
        </div>
      </div>
      
      <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row gap-4">
        <button
            onClick={onBookAppointment}
            className="w-full sm:w-auto flex-grow py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
            Book an Appointment
        </button>
        <button
            onClick={onReset}
            className="w-full sm:w-auto py-3 px-6 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
        >
            Analyze Another X-Ray
        </button>
      </div>

    </div>
);

const ErrorIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const ErrorDisplay: React.FC<{ error: string; onReset: () => void; }> = ({ error, onReset }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 flex flex-col items-center text-center animate-fade-in">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <ErrorIcon className="h-8 w-8 text-red-600"/>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mt-6">An Error Occurred</h2>
        <p className="text-slate-600 mt-2 bg-red-50 p-4 rounded-md w-full">
          {error}
        </p>
        <button
            onClick={onReset}
            className="mt-8 w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
            Try Again
        </button>
    </div>
);

const AnalysisStep: React.FC<AnalysisStepProps> = ({ analysisResult, error, onReset, onBookAppointment }) => {
  if (error) {
    return <ErrorDisplay error={error} onReset={onReset} />;
  }
  
  if (analysisResult) {
    return <ResultDisplay result={analysisResult} onReset={onReset} onBookAppointment={onBookAppointment} />;
  }

  // Fallback for when not loading, no result, and no error
  return <ErrorDisplay error="Could not display analysis results. An unexpected error occurred." onReset={onReset} />;
};

export default AnalysisStep;