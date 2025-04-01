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
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
  
        if (!Array.isArray(json.data)) {
          console.error("Unexpected data format:", json);
          return;
        }
  
        const formatted = json.data.map((item: any) => ({
          time: new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          vpd: item.vpd,
          dli: item.dli,
          soil_water_deficit_estimation: item.soil_water_deficit_estimation,
          plant_heat_stress: item.plant_heat_stress,
        }));
  
        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
      }
    };
  
    // fetchData(); // first fetch immediately
  //fetchData every 60 minutes
    const interval = setInterval(fetchData, 60 * 60 * 1000); // every hour
    fetchData(); // also fetch immediately
    return () => clearInterval(interval); // cleanup on unmount
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
