"use client";

import { useState, useEffect } from "react";
import ActuatorCard from "../cards/actuator-card";
import SensorCard from "../cards/sensor-card";
import WaterCard from "../cards/water-card";

const Dashboard = () => {
  const [pumpActive, setPumpActive] = useState(false);
  const [fanActive, setFanActive] = useState(false);
  const [sensorData, setSensorData] = useState<any>(null);
  const [moistureHistory, setMoistureHistory] = useState<any[]>([]);

  const fetchActuatorState = async () => {
    try {
      const [pumpRes, fanRes] = await Promise.all([
        fetch("/api/actuator/pump"),
        fetch("/api/actuator/fan"),
      ]);
      const pumpData = await pumpRes.json();
      const fanData = await fanRes.json();

      if (pumpData?.state) setPumpActive(pumpData.state === "on");
      if (fanData?.state) setFanActive(fanData.state === "on");
    } catch (err) {
      console.error("❌ Failed to fetch actuator state:", err);
    }
  };

  const fetchSensorData = async () => {
    try {
      const res = await fetch("/api/sensor");
      const json = await res.json();
      const latest = json.data;
      setSensorData(latest);

      // Keep only last 10 history points
      setMoistureHistory((prev) => {
        const updated = [...prev, latest];
        return updated.length > 10 ? updated.slice(updated.length - 10) : updated;
      });
    } catch (err) {
      console.error("❌ Failed to fetch sensor data:", err);
    }
  };

  useEffect(() => {
    fetchActuatorState();
    fetchSensorData();

    const interval = setInterval(fetchSensorData, 5000); // auto refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const toggleActuator = async (type: "pump" | "fan", state: boolean) => {
    if (type === "pump") setPumpActive(state);
    if (type === "fan") setFanActive(state);

    try {
      await fetch(`/api/actuator/${type}`, {
        method: "POST",
        body: JSON.stringify({ command: state ? "on" : "off" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(`❌ Failed to toggle ${type}:`, err);
    }
  };

  return (
    <div className="flex flex-1 ml-10 my-6 mr-6">
      <div className="flex flex-col gap-6 flex-1 w-full h-full rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Water Display */}
            <WaterCard liquid_detected={sensorData?.liquid_detected} />
            {/*  Actuator OverView */}
            <ActuatorCard
              title="Water Pump"
              description="My Water Pump"
              backgroundImage="https://tomahawk-power.com/cdn/shop/articles/wide_angle_1024x.jpg?v=1623716961"
              isActive={pumpActive}
              onToggle={(state) => toggleActuator("pump", state)}
            />
            <ActuatorCard
              title="Fan"
              description="My Fan"
              backgroundImage="https://m.media-amazon.com/images/I/810r2WWqGoL._AC_UF894,1000_QL80_.jpg"
              isActive={fanActive}
              onToggle={(state) => toggleActuator("fan", state)}
            />
          </div>
          {/* Sensor Overview Display */}
          <SensorCard data={sensorData} history={moistureHistory} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
