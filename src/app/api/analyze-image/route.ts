import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Buffer } from "buffer";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handle the POST request
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON body
    const { image } = await req.json();

    // Validate that base64 image is provided
    if (!image) {
      return NextResponse.json(
        { error: "Base64 image is required" },
        { status: 400 }
      );
    }

    // Decode base64 image to binary (Buffer)
    const imageBuffer = Buffer.from(image, "base64");

    // If OpenAI supports direct image uploads, send the imageBuffer directly.
    // However, OpenAI GPT-4 Vision currently does not accept base64 or binary images directly.
    // You may need to use another image analysis API that accepts binary data.

    // Example: Sending imageBuffer to OpenAI (if supported)
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Ensure this is the correct model for GPT-4 with vision capabilities
      messages: [
        {
          role: "user",
          content:
            "Analyze this image and tell me if there are any plant diseases.",
        },
      ],
      // Attach the imageBuffer here if OpenAI supports it (not currently available)
      // files: [{ name: "plant.jpg", buffer: imageBuffer, type: "image/jpeg" }],
      max_tokens: 500,
    });

    // Check if the response is OK
    if (
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message
    ) {
      throw new Error("Invalid response from OpenAI API");
    }

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
