"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function DiseaseDectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diseaseInfo, setDiseaseInfo] = useState<any>(null);

  const analyzeImage = async (base64Image: string) => {
    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result = await response.json();
      return parseOpenAIResponse(result.analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      return null;
    }
  };

  const parseOpenAIResponse = (response: string) => {
    const lines = response.split("\n");
    const info: any = {};
    let currentKey = "";

    for (const line of lines) {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        currentKey = key.trim().toLowerCase();
        info[currentKey] = value.trim();
      } else if (currentKey) {
        info[currentKey] += " " + line.trim();
      }
    }

    return info;
  };

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = (e.target?.result as string).split(",")[1];
          setSelectedImage(`data:image/jpeg;base64,${base64}`);
          setIsAnalyzing(true);

          const result = await analyzeImage(base64);
          setDiseaseInfo(result);
          setIsAnalyzing(false);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Plant Disease Detection
      </h1>

      <div className="mb-8">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>
        </div>
      </div>

      {selectedImage && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Uploaded Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={selectedImage}
              alt="Uploaded plant"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {isAnalyzing && (
        <div className="text-center mb-8">
          <AlertCircle className="w-10 h-10 mx-auto mb-4 animate-pulse text-yellow-500" />
          <p className="text-lg font-semibold">Analyzing image...</p>
        </div>
      )}

      {diseaseInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Detection Result</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">{diseaseInfo.name}</h3>
            <p className="mb-4">
              <strong>Type:</strong> {diseaseInfo.type}
            </p>
            <p className="mb-4">{diseaseInfo.description}</p>
            <h4 className="text-lg font-semibold mb-2">Symptoms:</h4>
            <p className="mb-4">{diseaseInfo.symptoms}</p>
            <h4 className="text-lg font-semibold mb-2">Management:</h4>
            <p>{diseaseInfo.management}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
