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
import { updateSchedule } from "@/actions/gardens/schedule.actions";
import { update } from "lodash";

interface Schedule {
  id: string;
  day: string;
  time: string;
  triggered?: boolean;
  active: boolean;
  created_at: string;
  duration?: number;
  min_moisture?: number;
}

const WateringSchedulePage = () => {
  const { gardenId } = useParams();
  const fullDate = dayjs().format("dddd, MMMM D YYYY");
  const fullTime = dayjs().format("hh:mm A");

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const fetchSchedules = async () => {
    if (!gardenId) return;
    try {
      const { data } = await getSchedules(gardenId);
      setSchedules(data);
      console.log("fetch all schedules:", data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const isScheduleTriggered = (schedule: Schedule): boolean => {
    console.log("isTriggered:", schedule);
    const now = dayjs();
    const [hour, minute] = schedule.time.split(":").map(Number);
    const scheduledTime = dayjs(schedule.created_at)
      .hour(hour)
      .minute(minute)
      .second(0)
      .millisecond(0);

    if (schedule.day === "No Repeat") {
      return now.isSame(scheduledTime, "minute") && !schedule.triggered;
    }

    return false;
  };

  const handleScheduleUpdate = async (
    id: string,
    day: string,
    time: string,
    triggered: boolean,
    active: boolean,
    duration?: number,
    min_moisture?: number
  ) => {
    const created_at = new Date().toISOString();
    try {
      const schedules = await getSchedules(gardenId as string);
      if (!duration) {
        duration = schedules.data.find((s: Schedule) => s.id === id)?.duration;
      }
      if (!min_moisture) { 
        min_moisture = schedules.data.find((s: Schedule) => s.id === id)?.min_moisture;
      }

      await updateSchedule(id, day, time, triggered, active, duration, min_moisture, gardenId);
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, day, time, triggered, active, duration, min_moisture, created_at } : s))
      );
      fetchSchedules(); // Re-fetch after update
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) => {
          if (isScheduleTriggered(schedule)) {
            // Update the schedule on the server
            updateSchedule(
              schedule.id,
              schedule.day,
              schedule.time,
              true,
              false,
              schedule.duration,
              schedule.min_moisture,
              gardenId as string
            )
            .then(() => {
              // Update the local state after the server update
              setSchedules((prevSchedules) =>
                prevSchedules.map((s) =>
                  s.id === schedule.id ? { ...s, triggered: true, active: false } : s
                )
              );
            })
            .catch((error) => {
              console.error("Error updating schedule:", error);
            });
  
            // You can optionally return the updated schedule optimistically here
            return { ...schedule, triggered: true, active: false };
          }
          return schedule;
        })
      );
      fetchSchedules(); // Fetch schedules periodically
    }, 60000); // Check every 1 minute
  
    return () => clearInterval(interval);
  }, []);
  
  

  useEffect(() => {
    if (gardenId) {
      fetchSchedules();
    }
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
        </div>
      </div>

      {/* Schedule List */}
      <div className="flex flex-wrap justify-start mb-6">
        {schedules.length > 0 ? (
          schedules
            .sort((a, b) => {
              const [aHour, aMinute] = a.time.split(":").map(Number);
              const [bHour, bMinute] = b.time.split(":").map(Number);
              return aHour !== bHour ? aHour - bHour : aMinute - bMinute;
            })
            .map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                fetchSchedules={fetchSchedules}
                schedule={schedule}
                setSchedules={setSchedules}
                gardenId={gardenId as string}
                handleScheduleUpdate={handleScheduleUpdate}
              />
            ))
        ) : (
          <p className="text-gray-500 text-center">No schedules added yet.</p>
        )}
      </div>
    </PageWrapper>
  );
};

export default WateringSchedulePage;
