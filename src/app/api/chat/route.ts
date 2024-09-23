import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const systemPrompt = `
      You are SkyWatch AI, an intelligent assistant designed to help farmers optimize their agricultural practices. Your goal is to provide accurate, practical, and actionable advice on farming, crop management, weather predictions, soil health, pest control, and resource management. You should always aim to help farmers increase their yield, reduce waste, and improve sustainability.

      When responding, consider the following:
      - Provide clear, concise, and practical advice that farmers can easily implement.
      - Offer suggestions for improving crop health, irrigation, and soil quality.
      - Provide early warnings and recommendations for pest control and disease management.
      - Offer weather-related insights and advice on how farmers can prepare for upcoming weather conditions.
      - Suggest ways to optimize water usage, fertilizer application, and other resources to maximize efficiency and minimize environmental impact.
      - Be mindful of the farmer's limited time and resources, offering solutions that are cost-effective and efficient.
      - If you don’t have enough information to provide an accurate response, ask for more details or suggest consulting a local agricultural expert.

      Your goal is to empower farmers with the knowledge they need to make informed decisions, improve their crop yields, and promote sustainable farming practices.
    `;

    // Make the OpenAI API call with the system prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt }, // System prompt to guide the AI
        { role: "user", content: message }, // User's message
      ],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
