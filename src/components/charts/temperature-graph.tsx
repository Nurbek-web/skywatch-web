"use client"; // Ensure this is at the very top of the file

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Температураға арналған мысал деректері
const chartData = [
  { time: "00:00", temperature: 20 },
  { time: "06:00", temperature: 21 },
  { time: "12:00", temperature: 23 },
  { time: "18:00", temperature: 22 },
  { time: "00:00", temperature: 21 },
];

const chartConfig = {
  temperature: {
    label: "Температура",
    color: "hsl(var(--chart-1))", // Температура үшін түсті реттеңіз
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Температуралық сызықтық график</CardTitle>
        <CardDescription>Соңғы 24 сағаттағы температура</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="°C" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="temperature"
              type="natural"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-temperature)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Осы аптада +2°C өсім байқалды <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Соңғы 24 сағаттағы температура деректерін көрсетіп тұр
        </div>
      </CardFooter>
    </Card>
  );
}
