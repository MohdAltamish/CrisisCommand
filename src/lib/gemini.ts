import { GoogleGenerativeAI } from '@google/generative-ai';
import { Incident, AIResponse } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateCrisisResponse(incident: Partial<Incident> & { crisisType: string }): Promise<AIResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an emergency response coordinator for a hospitality venue in India.
A ${incident.crisisType.toUpperCase()} emergency has been reported.
Location: ${incident.location?.address || 'Venue premises'}
Description: ${incident.description || 'No description provided'}

Respond ONLY with a valid JSON object, no markdown, no explanation:
{
  "immediateActions": ["action1", "action2", "action3"],
  "staffInstructions": ["instruction1", "instruction2", "instruction3"],
  "guestInstructions": ["instruction1", "instruction2"],
  "estimatedResponseTime": "X-Y minutes",
  "severity": "critical",
  "contactNumbers": ["Fire: 101", "Police: 100", "Ambulance: 108"]
}
Use Indian emergency numbers. Be concise. Max 3 items per array.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(text) as AIResponse;
  } catch (e) {
    console.error('Gemini parse error:', e, 'Raw:', text);
    // Fallback response
    return {
      immediateActions: ['Alert all floor staff immediately', 'Activate emergency protocol', 'Call emergency services'],
      staffInstructions: ['Clear affected area', 'Guide guests to safety', 'Do not use elevators'],
      guestInstructions: ['Stay calm', 'Follow staff instructions'],
      estimatedResponseTime: '3-5 minutes',
      severity: 'high',
      contactNumbers: ['Fire: 101', 'Police: 100', 'Ambulance: 108'],
    };
  }
}
