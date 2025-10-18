import OpenAI from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AnalysisResult } from '../types';

const analysisSchema = {
  type: "object",
  properties: {
    findings: {
      type: "array",
      description: 'A bulleted list of neutral, objective observations from the X-ray image.',
      items: { type: "string" }
    },
    potentialIssues: {
      type: "array",
      description: 'A bulleted list of potential medical issues or areas of concern based on the findings.',
      items: { type: "string" }
    },
    recommendation: {
      type: "string",
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
  
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY environment variable is not set on the server." });
  }
  
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const { base64Image, mimeType } = req.body;

  if (!base64Image || !mimeType) {
    return res.status(400).json({ error: 'Missing base64Image or mimeType in request body.' });
  }

  const model = 'gpt-4o';

  const systemInstruction = `You are an expert radiology assistant AI. Your purpose is to provide a preliminary analysis of X-ray images for patients.
  Your analysis is NOT a diagnosis.
  You must be professional, reassuring, and clear.
  You must respond in a JSON format that adheres to the following structure: ${JSON.stringify(analysisSchema)}.
  Always emphasize that the user must consult a human doctor for a proper diagnosis and treatment plan.
  Do not express certainty or provide a definitive diagnosis. Use cautious language like "potential signs of," "suggests," or "may indicate."`;

  const userPrompt = "Please analyze this X-ray image. Identify key findings, list potential concerns based on those findings, and provide a clear recommendation for the patient.";

  try {
    const response = await openai.chat.completions.create({
      model: model,
      response_format: { type: "json_object" },
      messages: [
        {
            role: "system",
            content: systemInstruction
        },
        {
            role: "user",
            content: [
                { type: "text", text: userPrompt },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:${mimeType};base64,${base64Image}`,
                    },
                },
            ],
        },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Received an empty response from the AI model.");
    }

    const result = JSON.parse(content) as AnalysisResult;
    
    if (!result.findings || !result.potentialIssues || !result.recommendation) {
        throw new Error("AI response is missing required fields.");
    }

    res.status(200).json(result);

  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);
    const errorMessage = error.message || "Failed to get a valid analysis from the AI. The model may be unable to process this image.";
    res.status(500).json({ error: errorMessage });
  }
}