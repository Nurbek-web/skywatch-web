import { Component as ChartArea } from "@/components/ui/chart-area";
import { GlobeDemo } from "@/components/globe";
import TimelineDemo from "@/components/timeline";
import ImagesSlider from "@/components/images-slider";
import BentoGrid from "@/components/bento-grid";
import FloatingNavDemo from "@/components/floating-navbar";

export default function Home() {
  return (
    <div>
      <FloatingNavDemo />
      <ImagesSlider />
      <BentoGrid />
      <TimelineDemo />
      <GlobeDemo />
      <ChartArea />
    </div>
  );
}
