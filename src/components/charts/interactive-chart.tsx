"use client";
import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartData {
  date: string;
  temperature: number;
  humidity: number;
}

const generateChartData = (): ChartData[] => {
  const data: ChartData[] = [];
  const startDate = new Date("2024-04-01");
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    data.push({
      date: date.toISOString().split("T")[0],
      temperature: Math.round(Math.random() * 15 + 15), // 15-30°C аралығындағы кездейсоқ температура
      humidity: Math.round(Math.random() * 30 + 50), // 50-80% аралығындағы кездейсоқ ылғалдылық
    });
  }
  return data;
};

const chartData = generateChartData();

const chartConfig = {
  weather: {
    label: "Ауа райы",
  },
  temperature: {
    label: "Температура (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Ылғалдылық (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function InteractiveChart() {
  const [timeRange, setTimeRange] = useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date("2024-06-30"); // "қазіргі уақыт" ретінде деректер жиынтығындағы соңғы күнді пайдалану
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Температура және Ылғалдылық Диаграммасы</CardTitle>
          <CardDescription>
            Таңдалған уақыт диапазоны үшін температура мен ылғалдылық деректерін
            көрсетіп тұр
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Уақыт аралығын таңдаңыз"
          >
            <SelectValue placeholder="Соңғы 3 ай" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Соңғы 3 ай
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Соңғы 30 күн
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Соңғы 7 күн
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-temperature)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-temperature)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-humidity)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-humidity)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("kk-KZ", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="var(--color-temperature)"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-humidity)"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("kk-KZ", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              yAxisId="left"
              dataKey="temperature"
              type="monotone"
              fill="url(#fillTemperature)"
              stroke="var(--color-temperature)"
            />
            <Area
              yAxisId="right"
              dataKey="humidity"
              type="monotone"
              fill="url(#fillHumidity)"
              stroke="var(--color-humidity)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
