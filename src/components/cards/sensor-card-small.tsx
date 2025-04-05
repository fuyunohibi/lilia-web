"use client";

import React from "react";
import { motion } from "framer-motion";
import { Switch } from "../ui/switch";

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

interface ActuatorCardProps {
  title: string;
  description: string;
  backgroundImage: string;
  isActive: boolean;
  onToggle: (state: boolean) => void;
}


const SensorSmallCard: React.FC<SensorCardProps> = ({ data, history }) => {
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

    const sensorList = ["temperature", "humidity", "light", "soil moisture"];

    return (
        <div className="grid grid-cols-4 col-start-1 col-end-4 gap-6 relative h-full w-full flex flex-col justify-between ">
            {/* Loop sensors */}
            {sensorList.map((sensor, index) => (
            <motion.div
                key={sensor}
                className="grid grid-cols-5 p-5 bg-gray-100 rounded-3xl shadow-lg" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
            >
                
                {/* Title & Description */}
                <motion.div
                className="col-span-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <motion.p className="text-sm" layout>
                        {sensor}
                    </motion.p>
                </motion.div>
                
                {/* Icons */}
                <div className="flex items-right justify-end col-span-1">
                    {sensor === "temperature" && <span>🌡️</span>}
                    {sensor === "humidity" && <span>💧</span>}
                    {sensor === "light" && <span>☀️</span>}
                    {sensor === "soil moisture" && <span>🌱</span>}
                </div>
                
                {/* Value */}
                <div className="flex items-center col-span-5 mt-2">
                    <span className="text-xl font-semibold text-muted-foreground">
                        {sensor === "temperature" ? `${data.temperature}°C` : sensor === "humidity" ? `${data.humidity}%` : sensor === "light" ? `${data.light}` : sensor === "soil moisture" ? `${averageMoisture}%` : sensor.charAt(0).toUpperCase() + sensor.slice(1)}
                    </span>
                </div>
            </motion.div>
            ))}


        </div>
    );
};

export default SensorSmallCard;
