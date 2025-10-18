import { AnalysisResult } from '../types';

export async function getAiAnalysis(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'The analysis service is currently unavailable. Please try again later.' }));
      throw new Error(errorData.error || `The server returned an unexpected response.`);
    }

    const result = await response.json() as AnalysisResult;
    
    if (!result.findings || !result.potentialIssues || !result.recommendation) {
        throw new Error("API response from the server is missing required fields.");
    }

    return result;

  } catch (error) {
    console.error("Error calling analysis API:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while fetching the analysis.");
  }
}