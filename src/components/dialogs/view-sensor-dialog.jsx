"use client";

import { IconEye } from "@tabler/icons-react";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "src/components/ui/dialog";

// Mock sensor data with active state
const sensors = [
  { name: "Temperature Sensor", type: "Temperature", unit: "°C", active: true },
  { name: "Humidity Sensor", type: "Humidity", unit: "%", active: false },
  { name: "Soil Moisture Sensor", type: "Moisture", unit: "%", active: true },
];

// Check if at least one sensor is active
const hasActiveSensor = sensors.some((sensor) => sensor.active);

function ViewSensorDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconEye
          size={24}
          className="hover:text-yellow-500 transition-colors duration-300"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center text-lg font-semibold text-gray-800">
          My Sensors
        </DialogTitle>

        {/* Status Message */}
        <p
          className={`text-center text-sm ${
            hasActiveSensor ? "text-green-600" : "text-gray-500"
          }`}
        >
          {hasActiveSensor
            ? "All sensors are running smoothly."
            : "No active sensors detected."}
        </p>

        {/* Sensor List */}
        <ul className="mt-4 space-y-2">
          {sensors.map((sensor, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 rounded-lg bg-gray-100 text-sm text-gray-700"
            >
              <div className="flex items-center gap-2">
                {/* Status Dot */}
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    sensor.active ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                <span>{sensor.name}</span>
              </div>
              <span className="text-gray-500">{sensor.unit}</span>
            </li>
          ))}
        </ul>

        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default ViewSensorDialog;
