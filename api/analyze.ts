import { GoogleGenAI, Type } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AnalysisResult } from '../types';


const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    findings: {
      type: Type.ARRAY,
      description: 'A bulleted list of neutral, objective observations from the X-ray image.',
      items: { type: Type.STRING }
    },
    potentialIssues: {
      type: Type.ARRAY,
      description: 'A bulleted list of potential medical issues or areas of concern based on the findings.',
      items: { type: Type.STRING }
    },
    recommendation: {
      type: Type.STRING,
      description: 'A clear, empathetic paragraph advising the user on the next steps, strongly recommending a consultation with a qualified doctor for a definitive diagnosis. This should not sound like a final diagnosis.'
    }
  },
  required: ['findings', 'potentialIssues', 'recommendation']
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "API_KEY environment variable is not set on the server." });
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const { base64Image, mimeType } = req.body;

  if (!base64Image || !mimeType) {
    return res.status(400).json({ error: 'Missing base64Image or mimeType in request body.' });
  }

  const model = 'gemini-2.5-flash';

  const systemInstruction = `You are an expert radiology assistant AI. Your purpose is to provide a preliminary analysis of X-ray images for patients.
  Your analysis is NOT a diagnosis.
  You must be professional, reassuring, and clear.
  Strictly adhere to the provided JSON schema for your response.
  Always emphasize that the user must consult a human doctor for a proper diagnosis and treatment plan.
  Do not express certainty or provide a definitive diagnosis. Use cautious language like "potential signs of," "suggests," or "may indicate."`;

  const prompt = "Please analyze this X-ray image. Identify key findings, list potential concerns based on those findings, and provide a clear recommendation for the patient.";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    if (!response.text) {
      throw new Error("Received an empty response from the AI model.");
    }

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;
    
    if (!result.findings || !result.potentialIssues || !result.recommendation) {
        throw new Error("AI response is missing required fields.");
    }

    res.status(200).json(result);

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error.message || "Failed to get a valid analysis from the AI. The model may be unable to process this image.";
    res.status(500).json({ error: errorMessage });
  }
}