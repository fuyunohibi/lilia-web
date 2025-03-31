"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "../ui/switch";

interface ActuatorCardProps {
  title: string;
  description: string;
  backgroundImage: string;
  isActive: boolean; // ON, OFF
}

const ActuatorCard = ({
  title,
  description,
  backgroundImage,
  isActive,
}: ActuatorCardProps) => {
  const [active, setActive] = useState(isActive);

  return (
    <div className="relative h-full w-full rounded-3xl bg-gray-100 p-5 flex flex-col justify-between shadow-lg">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          filter: active ? "brightness(1)" : "brightness(0.5)",
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Light Switch */}
      <motion.div
        className="absolute top-5 right-5 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Switch
          checked={active}
          onCheckedChange={setActive} 
          className={`${
            active ? "bg-green-500" : "bg-gray-700"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        />
      </motion.div>

      {/* TITLE & DESCRIPTION */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.p className="text-lg font-semibold text-white" layout>
          {title}
        </motion.p>
        <motion.p className="text-sm font-normal text-neutral-200" layout>
          {description}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ActuatorCard;
