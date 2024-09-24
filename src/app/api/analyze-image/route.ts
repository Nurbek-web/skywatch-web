import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handle the POST request
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON body
    const { imageUrl } = await req.json();

    // Validate that image URL is provided
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Make the API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview", // Ensure this is the correct model for GPT-4 with vision capabilities
      messages: [
        {
          role: "user",
          content: `Analyze the image at this URL and tell me if there's any plant disease: ${imageUrl}`,
        },
      ],
      max_tokens: 500,
    });

    // Extract the response from OpenAI
    const reply = response.choices[0].message.content;

    // Send the analysis back to the client
    return NextResponse.json({ analysis: reply });
  } catch (error) {
    // Log the error and return a 500 response with the error message
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
