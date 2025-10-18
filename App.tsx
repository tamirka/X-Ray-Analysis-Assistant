import React, { useState, useCallback } from 'react';
import { AppStep, AnalysisResult } from './types';
import { analyzeXrayImage } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadStep from './components/UploadStep';
import AnalysisStep from './components/AnalysisStep';
import Disclaimer from './components/Disclaimer';
import { fileToBase64 } from './utils/fileUtils';
import BookingModal from './components/BookingModal';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Upload);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep(AppStep.Analyzing);
    
    try {
      const base64Image = await fileToBase64(imageFile);
      const mimeType = imageFile.type;
      
      const result = await analyzeXrayImage(base64Image, mimeType);
      setAnalysisResult(result);
      setStep(AppStep.Result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      setError(`Analysis failed: ${errorMessage}. Please try again or use a different image.`);
      setStep(AppStep.Upload); // Go back to upload step on error
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setStep(AppStep.Upload);
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleOpenBookingModal = () => setIsBookingModalOpen(true);
  const handleCloseBookingModal = () => setIsBookingModalOpen(false);


  const renderStep = () => {
    switch (step) {
      case AppStep.Upload:
        return (
          <UploadStep
            onImageChange={handleImageChange}
            onAnalyze={handleAnalyze}
            previewUrl={previewUrl}
            error={error}
            isAnalyzing={isLoading}
            hasImage={!!imageFile}
          />
        );
      case AppStep.Analyzing:
        return (
          <AnalysisStep
            isLoading={true}
            analysisResult={null}
            error={null}
            onReset={handleReset}
            onBookAppointment={handleOpenBookingModal}
          />
        );
      case AppStep.Result:
        return (
           <AnalysisStep
            isLoading={false}
            analysisResult={analysisResult}
            error={error}
            onReset={handleReset}
            onBookAppointment={handleOpenBookingModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col antialiased">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          {renderStep()}
          {step === AppStep.Result && <Disclaimer />}
        </div>
      </main>
      <Footer />
      <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseBookingModal} />
    </div>
  );
};

export default App;