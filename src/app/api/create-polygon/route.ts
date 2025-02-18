// pages/api/create-polygon.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const AGRO_API_KEY = process.env.AGRO_API_KEY;
  const { name, geo_json } = await request.json();

  try {
    const response = await fetch(
      `http://api.agromonitoring.com/agro/1.0/polygons?appid=${AGRO_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, geo_json }),
      }
    );

    const data = await response.json();

    console.log("AgroMonitoring Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Error creating polygon" },
        { status: response.status }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Error creating polygon:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
