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
  const [error, setError] = useState<string | null>(null);

  // Function to generate a random message in Kazakh
  const getRandomMessage = () => {
    const messages = [
      "Өсімдікте ерте фитофтороз белгілері байқалады. Фунгицид қолданып, өсімдікті мұқият бақылаңыз.",
      "Өсімдікте қоректік заттардың жетіспеушілігі байқалады, мүмкін азот жетіспейді. Теңдестірілген тыңайтқышты қолданып көріңіз.",
      "Өсімдік сау көрінеді, бірақ жеткілікті күн сәулесі мен су алуын қамтамасыз етіңіз.",
      "Өсімдікте ұнтақты зең ауруының белгілері бар. Өсімдікті желдетілетін жерде ұстаңыз және фунгицид қолданыңыз.",
      "Өсімдіктің жапырақтарында сарғаю байқалады, бұл темірдің жетіспеушілігі болуы мүмкін. Темірге бай тыңайтқыш қолданыңыз.",
      "Өсімдікте бактериалды дақ ауруының белгілері бар. Зақымдалған бөліктерді алып тастап, өсімдікті оқшаулаңыз.",
      "Өсімдіктің тамырларында шіру белгілері бар. Артық суаруды тоқтатып, топырақтың дренажын жақсартыңыз.",
      "Өсімдікте жәндіктердің зақымдану белгілері бар. Инсектицид қолданыңыз және өсімдікті тексеріңіз.",
      "Өсімдікке күн сәулесі жетіспейді. Оны жарық жерге қойып, суаруды реттеңіз.",
      "Өсімдіктің жапырақтары қурап жатыр. Бұл шамадан тыс суарудың белгісі болуы мүмкін. Суару жиілігін азайтыңыз.",
      "Өсімдікте саңырауқұлақ ауруының белгілері бар. Өсімдікті оқшаулап, арнайы фунгицид қолданыңыз.",
      "Өсімдікте фузариоз белгілері байқалады. Топырақты ауыстырып, өсімдікті мұқият бақылаңыз.",
      "Өсімдіктің жапырақтары күйіп кеткендей көрінеді. Бұл шамадан тыс күн сәулесінің әсері болуы мүмкін.",
      "Өсімдікте вирустық инфекцияның белгілері бар. Өсімдікті оқшаулап, арнайы күтім жасаңыз.",
      "Өсімдікке тыңайтқыш қажет. Қоректік заттарға бай тыңайтқыш қолданып көріңіз.",
    ];

    // Randomly pick one message
    const randomIndex = Math.floor(Math.random() * messages.length);
    return { message: messages[randomIndex] };
  };

  // Fake image analysis function
  const analyzeImage = async (base64Image: string) => {
    // Simulate a delay to mimic real API behavior
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getRandomMessage());
      }, 2000); // Simulate a 2-second delay
    });
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
          setError(null);

          try {
            const result = await analyzeImage(base64);
            setDiseaseInfo(result);
          } catch (error) {
            console.error("Error during image analysis:", error);
            setError(
              (error instanceof Error ? error.message : "Unknown error") ||
                "Суретті талдау сәтсіз аяқталды. Қайта көріңіз."
            );
            setDiseaseInfo(null);
          } finally {
            setIsAnalyzing(false);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Өсімдік ауруларын анықтау
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
                <span className="font-semibold">
                  Суретті жүктеу үшін басыңыз
                </span>{" "}
                немесе сүйреп әкеліп тастаңыз
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG немесе GIF (MAX. 800x400px)
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
            <CardTitle>Жүктелген сурет</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={selectedImage}
              alt="Жүктелген өсімдік"
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
          <p className="text-lg font-semibold">Сурет талдануда...</p>
        </div>
      )}

      {error && (
        <div className="text-center mb-8 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {diseaseInfo && diseaseInfo.message && (
        <Card>
          <CardHeader>
            <CardTitle>AI Жауабы</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{diseaseInfo.message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
