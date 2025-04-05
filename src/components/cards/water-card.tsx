"use client";

import { motion } from "framer-motion";
import { Droplet, DropletOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterCardProps {
  liquid_detected: boolean;
}

const WaterCard: React.FC<WaterCardProps> = ({ liquid_detected }) => {
  return (
    <motion.div
      className="flex flex-col justify-center items-start rounded-3xl bg-gray-100 overflow-hidden p-5 shadow-lg relative h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-sm font-semibold text-neutral-800 mb-2 z-10 relative">
        💧 Water Tank
      </h3>
      <div className="relative h-full w-full border-2 border-blue-400 rounded-xl overflow-hidden bg-white">
        <motion.div
          className={cn(
            "absolute bottom-0 left-0 w-full",
            liquid_detected ? "bg-blue-400" : "bg-red-500"
          )}
          animate={{ height: liquid_detected ? "100%" : "15%" }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-neutral-700 z-10 relative">
        {liquid_detected ? (
          <>
            <Droplet className="text-blue-500" size={16} />
            <span className="text-blue-600 font-medium">Water OK</span>
          </>
        ) : (
          <>
            <DropletOff className="text-red-500" size={16} />
            <span className="text-red-600 font-medium">Low Water</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default WaterCard;
