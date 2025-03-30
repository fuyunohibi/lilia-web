"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

export function PlantDetailsDialog({ plant }: { plant: any }) {
  const [open, setOpen] = useState(false);
  console.log(plant);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-green-600 hover:text-green-700 hover:underline underline-offset-4 transition">
          View
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 max-w-md">
        {/* Plant Image */}
        {plant.plant_image_url && (
          <div className="w-full h-72 overflow-hidden rounded-t-xl">
            <Image
              src={plant.plant_image_url}
              alt={plant.plant_name}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Description */}
        <div className="-mt-4 p-6 space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          {/* Title */}
          <DialogTitle className="text-center text-2xl font-bold text-neutral-800 dark:text-white">
            {plant.plant_name}
          </DialogTitle>
          <div>
            <h4 className="font-medium mb-1">🌱 Description</h4>
            <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
              {plant.description || "No description provided."}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-1">🔅 Sunlight Requirement</h4>
            <p className="text-neutral-600 dark:text-neutral-400">
              {plant.sunlight_requirement || "Not specified"}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-1">💧 Watering Requirement</h4>
            <p className="text-neutral-600 dark:text-neutral-400">
              {plant.watering_requirement || "Not specified"}
            </p>
          </div>
        </div>

        <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
