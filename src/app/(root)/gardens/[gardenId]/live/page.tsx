"use client";

import React, { useEffect } from "react";
import { useActuatorStore } from "@/stores/actuator-store";
import { useGardenStore } from "@/app/api/stores/garden-store";
import PageWrapper from "@/components/layout.tsx/page-content";
import LiveCamCard from "@/components/cards/live-cam-card";

const LiveCamPage = () => {
  const { selectedGardenId } = useGardenStore(); // ✅ Get gardenId from Zustand
  const { toggleActuator, fetchActuatorState, pumpActive, fanActive } =
    useActuatorStore();

  useEffect(() => {
    if (selectedGardenId) {
      fetchActuatorState(selectedGardenId); // ✅ pass gardenId to fetch
    }
  }, [selectedGardenId]);

  const handleWaterToggle = () => {
    if (selectedGardenId) {
      toggleActuator("pump", !pumpActive, selectedGardenId); // ✅ pass gardenId
    }
  };

  const handleFanToggle = () => {
    if (selectedGardenId) {
      toggleActuator("fan", !fanActive, selectedGardenId); // ✅ pass gardenId
    }
  };

  return (
    <PageWrapper>
      <LiveCamCard
        title="🌿 Garden Live Cam"
        description="Watch your plants sway in real time"
        videoSrc="http://100.84.67.85:5000"
        onWater={handleWaterToggle}
        onFan={handleFanToggle}
        isWaterActive={pumpActive}
        isFanActive={fanActive}
      />
    </PageWrapper>
  );
};

export default LiveCamPage;
