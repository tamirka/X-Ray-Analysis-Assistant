import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisStepProps {
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
  error: string | null;
  onReset: () => void;
  onBookAppointment: () => void;
}

const LoadingState: React.FC = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center text-center">
    <div className="animate-pulse">
        <div className="w-16 h-16 bg-blue-200 rounded-full"></div>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mt-6">Analyzing Your X-Ray...</h2>
    <p className="text-slate-600 mt-2">
      Our AI assistant is carefully examining your image. This may take a few moments.
    </p>
    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-8">
      <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{width: '75%'}}></div>
    </div>
  </div>
);

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

const AnalysisStep: React.FC<AnalysisStepProps> = ({ isLoading, analysisResult, onReset, onBookAppointment }) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (analysisResult) {
    return <ResultDisplay result={analysisResult} onReset={onReset} onBookAppointment={onBookAppointment} />;
  }

  // Fallback for when not loading and no result (should not happen in normal flow, but good for robustness)
  return (
     <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
       <h2 className="text-xl font-bold text-red-600">Something went wrong.</h2>
       <p className="text-slate-600 mt-2">Could not display analysis results.</p>
       <button onClick={onReset} className="mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg">Start Over</button>
    </div>
  );
};

export default AnalysisStep;