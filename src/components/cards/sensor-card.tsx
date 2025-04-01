"use client";

import React from "react";
import { motion } from "framer-motion";
import { Droplet, DropletOff, Thermometer, Sun, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart";
import { LineChart, Line, CartesianGrid } from "recharts";

interface SensorData {
  soil_moisture1: number;
  soil_moisture2: number;
  liquid_detected: boolean;
  temperature: number;
  humidity: number;
  light: number;
  timestamp: string;
}

interface SensorCardProps {
  data: SensorData;
  history: SensorData[];
}

const SensorCard: React.FC<SensorCardProps> = ({ data, history }) => {
  if (!data || !history.length) return null;

  const averageMoisture = (
    (data.soil_moisture1 + data.soil_moisture2) /
    2
  ).toFixed(1);

  const chartData = history.map((entry) => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    moisture1: entry.soil_moisture1,
    moisture2: entry.soil_moisture2,
  }));

  return (
    <motion.div
      className="rounded-2xl bg-white dark:bg-neutral-900 shadow-sm p-4 border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        🔎 Sensor Snapshot @ {new Date(data.timestamp).toLocaleTimeString()}
      </h3>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Thermometer className="text-red-500" size={14} />
          <span>{data.temperature}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="text-blue-500" size={14} />
          <span>{data.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Sun className="text-yellow-500" size={14} />
          <span>{data.light}</span>
        </div>
        <div className="flex items-center gap-2">
          📊{" "}
          <span className="text-green-600 font-semibold">
            {averageMoisture}%
          </span>
        </div>
      </div>

      <Card className="border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Moisture Trends</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Last 5 records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}}>
            <LineChart
              width={300}
              height={100}
              data={chartData}
              margin={{ top: 0, left: 0, right: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <ChartTooltip
                content={
                  <ChartTooltipContent nameKey="time" indicator="line" />
                }
              />
              <Line
                type="monotone"
                dataKey="moisture1"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2, fill: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="moisture2"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 2, fill: "#10b981" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground px-4 pb-3">
          Updated every 30s • Live from sensors
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SensorCard;
