import { Component as ChartArea } from "@/components/ui/chart-area";
import Image from "next/image";
import { GlobeDemo } from "@/components/globe";
import TimelineDemo from "@/components/timeline";
import ImagesSlider from "@/components/images-slider";

export default function Home() {
  return (
    <div>
      <ImagesSlider />
      <TimelineDemo />
      <GlobeDemo />
      <ChartArea />
    </div>
  );
}
