import { NextRequest, NextResponse } from 'next/server';
import { generateCrisisResponse } from '@/lib/gemini';
import { attachAIResponse } from '@/lib/firestore';

export async function POST(req: NextRequest) {
  try {
    const { incident } = await req.json();
    if (!incident?.crisisType) {
      return NextResponse.json({ error: 'Missing incident data' }, { status: 400 });
    }
    const aiResponse = await generateCrisisResponse(incident);
    if (incident.id) {
      await attachAIResponse(incident.id, aiResponse);
    }
    return NextResponse.json({ success: true, aiResponse });
  } catch (error) {
    console.error('AI Response Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}
