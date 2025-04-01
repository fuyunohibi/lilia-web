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
import { CalendarClock } from "lucide-react";
import dayjs from "dayjs";

export function PlantDetailsDialog({ plant }: { plant: any }) {
  const [open, setOpen] = useState(false);

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

        {/* Details */}
        <div className="-mt-4 p-6 space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          {/* Title */}
          <DialogTitle className="text-center text-2xl font-bold text-neutral-800 dark:text-white">
            {plant.plant_name}
          </DialogTitle>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-1">🌱 Description</h4>
            <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
              {plant.description || "No description provided."}
            </p>
          </div>

          {/* Watering Schedule */}
          <div>
            <h4 className="font-medium mb-1">💧 Watering Schedule</h4>
            <div className="flex items-center gap-2 text-sm">
              <CalendarClock className="w-4 h-4 text-green-600" />
              {plant.watering_time
                ? dayjs(`2023-01-01T${plant.watering_time}`).format("hh:mm A")
                : "Not scheduled"}
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {plant.watering_days?.map((day: string) => (
                <span
                  key={day}
                  className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 rounded-full text-xs font-medium"
                >
                  {day}
                </span>
              )) || (
                <span className="text-xs text-neutral-500">
                  No days scheduled
                </span>
              )}
            </div>
          </div>
        </div>

        <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
