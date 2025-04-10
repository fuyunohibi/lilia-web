"use client";

import { useEffect, useState } from "react";
import { useActuatorStore } from "@/stores/actuator-store";
import ActuatorCard from "../cards/actuator-card";
import SensorCard from "../cards/sensor-card";
import WaterCard from "../cards/water-card";
import SensorSmallCard from "../cards/sensor-card-small";
import useAlertWebSocket from "@/hooks/useAlertWebSocket";
import LiveCamCard from "../cards/live-cam-card";
import { getSensorDataByGardenId } from "@/actions/sensors/sensor.actions";
import AddCameraDialog from "../cameras/add-camera-dialog";


interface DashboardProps {
  gardenId: string;
}

interface CameraInfo {
  camera_ip: string;
  port: number;
  username: string;
  password: string;
  full_stream_url: string;
  device_address: string;
}


const Dashboard = ({ gardenId }: DashboardProps) => {
  const { pumpActive, fanActive, toggleActuator, fetchActuatorState } = useActuatorStore();
  const [sensorData, setSensorData] = useState<any>(null);
  const [moistureHistory, setMoistureHistory] = useState<any[]>([]);
  const [cameraInfo, setCameraInfo] = useState<CameraInfo | null>(null);
  useAlertWebSocket(gardenId);

  const fetchSensorData = async () => {
    if (!gardenId) return;
    try {
      const { data } = await getSensorDataByGardenId(gardenId);
      const latest = data[0]; 
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

  const fetchCameraInfo = async () => {
    try {
      const res = await fetch("/api/cameras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garden_id: gardenId }),
      });
  
      const { camera } = await res.json();
  
      if (camera) {
        setCameraInfo(camera);
        console.log("📷 Camera info fetched:", camera);
  
        // Try to register, but do NOT clear cameraInfo if it fails
        try {
          await fetch(`http://${camera.device_address}:5000/register_camera`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gardenId,
              ip: camera.camera_ip,
              username: camera.username,
              password: camera.password,
              port: camera.port,
            }),
          });
        } catch (err) {
          console.warn("⚠️ Failed to register camera with RTSP worker:", err);
        }
      } else {
        setCameraInfo(null); // Only clear if camera is actually null
      }
    } catch (error) {
      console.error("❌ Failed to fetch camera info from API:", error);
      setCameraInfo(null);
    }
  };

  useEffect(() => {
    if (!gardenId) return;
  
    fetchActuatorState(gardenId);
    fetchSensorData();
    fetchCameraInfo();
  
    const interval = setInterval(fetchSensorData, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, [gardenId]);
  
  

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
          <div className="grid grid-rows-3 col-start-4 col-end-6 row-span-15 gap-6">
            <WaterCard liquid_detected={sensorData?.liquid_detected} />
            <ActuatorCard
              title="Water Pump"
              description="My Water Pump"
              backgroundImage="https://tomahawk-power.com/cdn/shop/articles/wide_angle_1024x.jpg?v=1623716961"
              isActive={pumpActive}
              onToggle={(state) => toggleActuator("pump", state, gardenId)}

            />
            <ActuatorCard
              title="Fan"
              description="My Fan"
              backgroundImage="https://m.media-amazon.com/images/I/810r2WWqGoL._AC_UF894,1000_QL80_.jpg"
              isActive={fanActive}
              onToggle={(state) => toggleActuator("fan", state, gardenId)}
            />
          </div>
          <div className="row-span-14 col-span-3 gap-6">
          {cameraInfo ? (
            <LiveCamCard
              title="🌿 Garden Live Cam"
              description="Watch your plants sway in real time"
              videoSrc={cameraInfo.full_stream_url}
              gardenId={gardenId} // ✅ important
            />

          ) : (
            <div className="rounded-3xl bg-white p-6 shadow text-center flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                No camera connected
              </p>
              <AddCameraDialog
                gardenId={gardenId}
                onCameraAdded={() => {
                  // Refresh camera info after adding
                  setCameraInfo(null);
                  setTimeout(() => {
                    fetchCameraInfo(); // must move fetchCameraInfo out of useEffect
                  }, 500);
                }}
              />
            </div>
          )}
          </div>
          {/* <SensorCard data={sensorData} history={moistureHistory} /> */}
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
