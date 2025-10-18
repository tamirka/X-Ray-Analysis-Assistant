import React, { useState, useCallback } from 'react';
import { AppStep, AnalysisResult } from './types';
import { getAiAnalysis } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadStep from './components/UploadStep';
import AnalysisStep from './components/AnalysisStep';
import Disclaimer from './components/Disclaimer';
import { fileToBase64 } from './utils/fileUtils';
import BookingModal from './components/BookingModal';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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
      setError(null); // Clear previous errors on new file selection

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError("Invalid file type. Please upload a PNG, JPG, or WEBP image.");
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File is too large. Please upload an image smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }
      
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setStep(AppStep.Analyzing);
    
    try {
      const base64Image = await fileToBase64(imageFile);
      const mimeType = imageFile.type;
      
      const result = await getAiAnalysis(base64Image, mimeType);
      setAnalysisResult(result);
      setStep(AppStep.Result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      setError(`Analysis failed. ${errorMessage}`);
      setStep(AppStep.Result); // Go to result step to display the error
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
          {step === AppStep.Result && !error && <Disclaimer />}
        </div>
      </main>
      <Footer />
      <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseBookingModal} />
    </div>
  );
};

export default App;