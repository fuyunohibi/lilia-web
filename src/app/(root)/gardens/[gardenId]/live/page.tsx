"use client";

import React, { useEffect } from "react";
import { useActuatorStore } from "@/stores/actuator-store";
import PageWrapper from "@/components/layout.tsx/page-content";
import LiveCamCard from "@/components/cards/live-cam-card";

const LiveCamPage = () => {
  const { toggleActuator, fetchActuatorState, pumpActive, fanActive } =
    useActuatorStore();

  useEffect(() => {
    fetchActuatorState();
  }, [fetchActuatorState]);

  return (
    <PageWrapper>
      <LiveCamCard
        title="🌿 Garden Live Cam"
        description="Watch your plants sway in real time"
        videoSrc="https://cdn.coverr.co/videos/coverr-garden-in-the-wind-3607/1080p.mp4"
        onWater={() => toggleActuator("pump", !pumpActive)}
        onFan={() => toggleActuator("fan", !fanActive)}
        isWaterActive={pumpActive}
        isFanActive={fanActive}
      />
    </PageWrapper>
  );
};

export default LiveCamPage;
