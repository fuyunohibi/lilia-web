"use client";

import React from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { useEffect, useState } from "react";

interface LiveCamCardProps {
  title: string;
  description: string;
  videoSrc: string;
  onWater: () => void;
  onFan: () => void;
  isWaterActive?: boolean;
  isFanActive?: boolean;
}


const LiveCamCard = ({
  title,
  description,
  videoSrc,
  onWater,
  onFan,
  isWaterActive = false,
  isFanActive = false,
}: LiveCamCardProps) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    const socket = io(videoSrc); // Connect to the video stream
    socket.on("frame", (data) => {
      setImageSrc(`data:image/jpeg;base64,${data.image}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [videoSrc]);

  return (
    <div className="relative h-full w-full rounded-3xl bg-gray-100 p-5 flex flex-col justify-between shadow-lg overflow-hidden">
      {/* Live Video */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <img
          src={imageSrc}
          className="object-cover rounded-3xl"
          alt="Live Camera"
        />
        {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-3xl" /> */}
      </motion.div>

      {/* Title & Description */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.p
          className="text-lg font-semibold text-white drop-shadow"
          layout
        >
          {title}
        </motion.p>
        <motion.p
          className="text-sm font-normal text-neutral-200 drop-shadow-sm"
          layout
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Actuator Buttons */}
      {/* Actuator Buttons */}
      <motion.div
        className="relative z-10 mt-4 flex gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          onClick={onWater}
          className={`px-4 py-2 text-sm rounded-full shadow-md transition-all duration-300 flex items-center gap-2 ${
            isWaterActive
              ? "bg-blue-600 ring-2 ring-blue-200"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          💧 Water
          {isWaterActive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
        </button>

        <button
          onClick={onFan}
          className={`px-4 py-2 text-sm rounded-full shadow-md transition-all duration-300 flex items-center gap-2 ${
            isFanActive
              ? "bg-indigo-600 ring-2 ring-indigo-200"
              : "bg-indigo-500 hover:bg-indigo-600"
          } text-white`}
        >
          🌬️ Fan
          {isFanActive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default LiveCamCard;
