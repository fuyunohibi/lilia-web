"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import PageWrapper from "@/components/layout.tsx/page-content";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CheckCircle } from "lucide-react";
import { getPlants } from "@/actions/plants/plants.actions";
import Image from "next/image";
import { Trash, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "../../../../../components/ui/switch";
import ScheduleCard from "@/components/cards/schedule-card";
import AddScheduleDialog from "@/components/gardens/add-schedule-dialog";
import { getSchedules } from "@/actions/gardens/schedule.actions";

interface Schedule {
  id: number;
  day: string;
  time: string;
  triggered?: boolean;
  active: boolean;
  created_at: string;
}


const daysOfWeek = [
  "Today",
  "Tomorrow",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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
  const fullDate = dayjs().format("dddd, MMMM D YYYY");
  const fullTime = dayjs().format("hh:mm A");

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newDay, setNewDay] = useState<string>("Today");
  const [newTime, setNewTime] = useState<string>("");

  const fetchSchedules = async () => {
    try {
      const { data } = await getSchedules(gardenId);
      setSchedules(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };
  
  const removeSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  const isScheduleTriggered = (schedule: Schedule): boolean => {
    const now = dayjs();
    const [hour, minute] = schedule.time.split(":").map(Number);
    const scheduledTime = dayjs().hour(hour).minute(minute);
  
    if (schedule.day === "Today") {
      // Use today logic
      const createdDate = dayjs(schedule.created_at);
      return (
        now.isSame(createdDate, "day") &&
        now.isSame(scheduledTime) &&
        schedule.triggered === false
      );
    }
  
    if (schedule.day === "Tomorrow") {
      const createdDate = dayjs(schedule.created_at);
      const tomorrowDate = createdDate.add(1, "day");
  
      return (
        now.isSame(tomorrowDate, "day") &&
        now.isSame(scheduledTime) &&
        schedule.triggered === false
      );
    }
  
    return false;
  };

  // Background checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const [hour, minute] = now.format("HH:mm").split(":").map(Number);
      const currentTime = dayjs().hour(hour).minute(minute);
      const currentDay = now.format("dddd");
      const isToday = currentDay === "Today";
      const isTomorrow = currentDay === "Tomorrow";


      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) => {
          if (!schedule.triggered && isScheduleTriggered(schedule)) {
            schedule.triggered = true;
            schedule.active = false;
            return { ...schedule, triggered: true };
          }
          return schedule;
        })
      );
      fetchSchedules();
    }, 60000); 
    
    console.log("all schedules:", schedules);

    return () => clearInterval(interval);
  }, []);

  // Fetch schedules
  useEffect(() => {
    if (!gardenId) return;

    fetchSchedules();
  }, [gardenId]);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex mb-6">
        <div className="flex flex-col items-left justify-start">
          <h1 className="text-2xl font-semibold mb-1">💧 Watering Schedule</h1>
          <div className="text-sm text-green-700 dark:text-green-400 font-medium">
            Today is <span className="font-semibold">{fullDate}</span> at {fullTime}
          </div>
        </div>

        {/* Schedule input */}
        <div className="flex items-center justify-end ml-auto">
          <AddScheduleDialog
            gardenId={gardenId as string}
            fetchSchedules={fetchSchedules}
          />
          {/* <select
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
            className="p-2 mx-6 rounded-md shadow-md dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="p-2 mr-8 rounded-md shadow-md dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          />
          <button
            onClick={addSchedule}
            className="flex items-center justify-between h-12 px-5 rounded-full bg-green-500 text-white shadow-lg cursor-pointer hover:bg-green-600 transition duration-200"
          >
            <h1 className="text-xl font-semibold">+ Add Schedule</h1>
          </button> */}
        </div>
      </div>

      {/* Schedule List */}
      <div className="flex flex-wrap justify-start mb-6">
        {schedules.length > 0 ? (
          [...schedules]
          .sort((a, b) => {
            const [aHour, aMinute] = a.time.split(":").map(Number);
            const [bHour, bMinute] = b.time.split(":").map(Number);
            return aHour !== bHour ? aHour - bHour : aMinute - bMinute;
          })
          .map((schedule) => {
            const triggered =
              schedule.day === "Tomorrow" || schedule.day === "Today"
                ? schedule.triggered
                : isScheduleTriggered(schedule);

            return (
              <div
                key={schedule.id}
              >
                {ScheduleCard({
                  fetchSchedules,
                  schedule,
                  removeSchedule,
                  setSchedules,
                })}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">No schedules added yet.</p>
        )}
      </div>

      {/* Plant Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {plants.map((plant) => (
          <div
            key={plant.plant_id}
            className="rounded-3xl bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md shadow-md border border-white/20 dark:border-neutral-800/40 p-5 flex flex-col gap-3 transition hover:shadow-xl"
          >
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
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-lg font-semibold">{plant.plant_name}</h2>
              <Badge className="flex items-center gap-1 bg-green-500 text-white">
                <CheckCircle className="w-4 h-4" />
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <CalendarClock className="w-4 h-4" />
              {plant.watering_time?.slice(0, 5)}
            </div>
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
      </div> */}
    </PageWrapper>
  );
};

export default WateringSchedulePage;
