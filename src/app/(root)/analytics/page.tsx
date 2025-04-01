"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/charts/chart";
import PageWrapper from "@/components/layout.tsx/page-content";

const generateMockData = () => {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return {
      time: `${hour.getHours()}:00`,
      vpd: +(Math.random() * 2).toFixed(2),
      dli: +(Math.random() * 1).toFixed(3),
      soil_water_deficit_estimation: +(Math.random() * 3).toFixed(2),
      plant_heat_stress: +(1 + Math.random() * 0.5).toFixed(3),
    };
  });
};

const chartConfig: ChartConfig = {
  vpd: { label: "VPD", color: "hsl(var(--chart-1))" },
  dli: { label: "DLI", color: "hsl(var(--chart-2))" },
  soil_water_deficit_estimation: {
    label: "Soil Water Deficit",
    color: "hsl(var(--chart-3))",
  },
  plant_heat_stress: {
    label: "Plant Heat Stress",
    color: "hsl(var(--chart-4))",
  },
};

const AnalyticsPage = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(chartConfig).map(([key, config]) => (
          <Card key={key} className="shadow-xl relative overflow-hidden">
            {/* Top-right update badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                </span>
                <span>Updated • {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <CardHeader>
              <CardTitle>{config.label}</CardTitle>
              <CardDescription>Hourly trend (last 24 hours)</CardDescription>
            </CardHeader>

            <CardContent className="!p-4">
              <ChartContainer config={{ [key]: config }}>
                <AreaChart
                  data={data}
                  width={undefined}
                  height={200} 
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    fontSize={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey={key}
                    type="natural"
                    fill={`var(--color-${key})`}
                    fillOpacity={0.3}
                    stroke={`var(--color-${key})`}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};

export default AnalyticsPage;
