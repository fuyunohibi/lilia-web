"use client";

import React, { useEffect, useState } from "react";
import { useActuatorStore } from "@/stores/actuator-store";
import { useGardenStore } from "@/app/api/stores/garden-store";
import PageWrapper from "@/components/layout.tsx/page-content";
import LiveCamCard from "@/components/cards/live-cam-card";

interface CameraInfo {
  camera_ip: string;
  port: number;
  username: string;
  password: string;
  full_stream_url: string;
  device_address: string;
}

const LiveCamPage = () => {
  const { selectedGardenId } = useGardenStore();
  const { toggleActuator, fetchActuatorState, pumpActive, fanActive } =
    useActuatorStore();
  const [cameraInfo, setCameraInfo] = useState<CameraInfo | null>(null);

  const fetchCameraInfo = async () => {
    if (!selectedGardenId) return;

    try {
      const res = await fetch("/api/cameras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garden_id: selectedGardenId }),
      });

      const { camera } = await res.json();

      if (camera) {
        setCameraInfo(camera);

        // Optional: Register the camera with RTSP worker
        try {
          await fetch(`http://${camera.device_address}:5000/register_camera`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gardenId: selectedGardenId,
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
        setCameraInfo(null);
      }
    } catch (err) {
      console.error("❌ Failed to fetch camera info:", err);
      setCameraInfo(null);
    }
  };

  useEffect(() => {
    if (selectedGardenId) {
      fetchActuatorState(selectedGardenId);
      fetchCameraInfo();
    }
  }, [selectedGardenId]);

  const handleWaterToggle = () => {
    if (selectedGardenId) {
      toggleActuator("pump", !pumpActive, selectedGardenId);
    }
  };

  const handleFanToggle = () => {
    if (selectedGardenId) {
      toggleActuator("fan", !fanActive, selectedGardenId);
    }
  };

  return (
    <PageWrapper>
      {cameraInfo ? (
        <LiveCamCard
          title="🌿 Garden Live Cam"
          description="Watch your plants sway in real time"
          videoSrc={cameraInfo.full_stream_url}
          gardenId={selectedGardenId}
          onWater={handleWaterToggle}
          onFan={handleFanToggle}
          isWaterActive={pumpActive}
          isFanActive={fanActive}
        />
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No camera connected.
        </div>
      )}
    </PageWrapper>
  );
};

export default LiveCamPage;
