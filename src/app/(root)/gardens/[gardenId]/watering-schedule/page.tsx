"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import PageWrapper from "@/components/layout.tsx/page-content";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CheckCircle } from "lucide-react";
import { getPlants } from "@/actions/plants/plants.actions";
import Image from "next/image";

interface Plant {
  plant_id: string;
  plant_name: string;
  description: string | null;
  watering_days: string[];
  watering_time: string;
  plant_image_url?: string | null;
  created_at: string;
}

const WateringSchedulePage = () => {
  const { gardenId } = useParams();
  const [plants, setPlants] = useState<Plant[]>([]);
  const today = dayjs().format("ddd"); // Mon, Tue, etc.
  const fullDate = dayjs().format("dddd, MMMM D YYYY");
  const fullTime = dayjs().format("hh:mm A");

  useEffect(() => {
    if (!gardenId) return;

    const fetchPlants = async () => {
      const res = await getPlants(gardenId as string);

      if ("data" in res && Array.isArray(res.data)) {
        setPlants(res.data);
      } else {
        console.error("Failed to load plants:", res.error || "Unknown error");
        setPlants([]);
      }
    };

    fetchPlants();
  }, [gardenId]);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">💧 Watering Schedule</h1>
        <div className="text-sm text-green-700 dark:text-green-400 font-medium">
          Today is <span className="font-semibold">{fullDate}</span> at{" "}
          {fullTime}
        </div>
      </div>

      {/* Plant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <div
            key={plant.plant_id}
            className="rounded-3xl bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md shadow-md border border-white/20 dark:border-neutral-800/40 p-5 flex flex-col gap-3 transition hover:shadow-xl"
          >
            {/* Plant Image */}
            {plant.plant_image_url && (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={plant.plant_image_url}
                  alt={plant.plant_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-lg font-semibold">{plant.plant_name}</h2>
              <Badge className="flex items-center gap-1 bg-green-500 text-white">
                <CheckCircle className="w-4 h-4" />
                Active
              </Badge>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <CalendarClock className="w-4 h-4" />
              {plant.watering_time?.slice(0, 5)}
            </div>

            {/* Days */}
            <div className="flex gap-2 flex-wrap mt-2">
              {plant.watering_days?.map((day) => {
                const isToday = today === day.slice(0, 3);
                return (
                  <span
                    key={day}
                    className={`px-2 py-1 rounded-full text-xs border ${
                      isToday
                        ? "bg-green-500 text-white border-green-600"
                        : "bg-white/50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300/20"
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default WateringSchedulePage;
