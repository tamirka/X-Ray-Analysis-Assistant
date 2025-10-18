import { AnalysisResult } from '../types';

export async function analyzeXrayImage(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const result = await response.json() as AnalysisResult;
    
    if (!result.findings || !result.potentialIssues || !result.recommendation) {
        throw new Error("API response from server is missing required fields.");
    }

    return result;

  } catch (error) {
    console.error("Error calling analysis API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get a valid analysis. ${error.message}`);
    }
    throw new Error("Failed to get a valid analysis due to an unknown error.");
  }
}
