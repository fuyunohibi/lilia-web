"use client";

import { useEffect, useState } from "react";
import { useActuatorStore } from "@/stores/actuator-store";
import ActuatorCard from "../cards/actuator-card";
import SensorCard from "../cards/sensor-card";
import WaterCard from "../cards/water-card";
import SensorSmallCard from "../cards/sensor-card-small";
import LiveCamCard from "../cards/live-cam-card";

const Dashboard = () => {
  const { pumpActive, fanActive, toggleActuator, fetchActuatorState } =
    useActuatorStore();

  const [sensorData, setSensorData] = useState<any>(null);
  const [moistureHistory, setMoistureHistory] = useState<any[]>([]);

  const fetchSensorData = async () => {
    try {
      const res = await fetch("/api/sensor");
      const json = await res.json();
      const latest = json.data;
      setSensorData(latest);

      setMoistureHistory((prev) => {
        const updated = [...prev, latest];
        return updated.length > 10
          ? updated.slice(updated.length - 10)
          : updated;
      });
    } catch (err) {
      console.error("❌ Failed to fetch sensor data:", err);
    }
  };

  useEffect(() => {
    fetchActuatorState();
    fetchSensorData();

    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-1">
      <div className="flex flex-col gap-6 flex-1 w-full h-full rounded-3xl">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-6 h-full">
          <div className="grid grid-cols-3 col-start-1 col-end-4 gap-6">
            <SensorSmallCard
              data={sensorData}
              history={moistureHistory}
            />
          </div>
          <div className="grid grid-rows-3 col-start-4 col-end-5 row-span-10 h-full gap-6">
            <WaterCard liquid_detected={sensorData?.liquid_detected} />
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
          <div className="col-span-2 row-span-9">
            <LiveCamCard
              title="🌿 Garden Live Cam"
              description="Watch your plants sway in real time"
              videoSrc="http://100.84.67.85:5000"
            />
          </div>
          {/* <SensorCard data={sensorData} history={moistureHistory} /> */}
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
