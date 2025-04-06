"use client";

import React from "react";
import { motion } from "framer-motion";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { CalendarClock, Edit, Trash } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSchedules } from "@/actions/gardens/schedule.actions";
import { updateSchedule } from "@/actions/gardens/schedule.actions";
import RemoveScheduleDialog from "../gardens/remove-garden-dialog";

interface Schedule {
    id: number;
    day: string;
    time: string;
    triggered?: boolean;
    active: boolean;
    created_at: string;
}

interface ScheduleCardProps {
    fetchSchedules: () => Promise<void>;
    schedule: Schedule;
    removeSchedule: (id: number) => void;
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

const ScheduleCard = ({ fetchSchedules, schedule, removeSchedule, setSchedules }: ScheduleCardProps) => {

    const handleScheduleUpdate = async (id: number, day: string, time: string, triggered: boolean, active: boolean) => {
        const created_at = new Date().toISOString();
        try {
            await updateSchedule(id, { day, time, triggered, active });
            setSchedules((prev) =>
                prev.map((s) => (s.id === id ? { ...s, day, time, triggered, active, created_at} : s))
            );
            fetchSchedules();
        } catch (error) {
            console.error("Error updating schedule:", error);
        }
    };

    

    const handleSwitchChange = (id: number, active: boolean) => {
        setSchedules((prev) =>
            prev.map((s) => (s.id === id ? { ...s, active } : s))
        );
        handleScheduleUpdate(id, schedule.day, schedule.time, false, active);
        fetchSchedules();
    };

    return (
        <motion.div
            className="flex min-w-60 min-h-32 m-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow"
        >
            <div className="flex flex-col items-left justify-center gap-2">
                {/* Schedule time */}
                <div className="flex flex-row items-center gap-2">
                <CalendarClock
                    className={schedule.active ? "text-green-500" : "text-gray-400"}
                    size={20}
                />
                <p className="text-3xl font-semibold">
                    {schedule.time}
                </p>
                </div>

                {/* Schedule day */}
                <p className="text-md font-regular text-gray-500">
                {schedule.day === "No Repeat" ? "No Repeat" : "Every " + schedule.day}
                </p>
                
            </div>

            <div className="flex flex-col items-center justify-center gap-4 ml-auto">
                {/* Switch */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Switch
                    checked={schedule.active}
                    onCheckedChange={() => {
                        setSchedules((prev) =>
                        prev.map((s) =>
                            s.id === schedule.id ? { ...s, active: !s.active } : s
                        )
                        );
                        console.log("Switch toggled for schedule:", schedule.active);
                    }}
                    className={`${
                        schedule.active} ? "bg-green-500" : "bg-gray-700"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    />
                </motion.div>

                {/* Edit and Delete buttons */}
                <div className="flex gap-2">
                <button 
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => {
                        const newDay = prompt("Enter new day:", schedule.day);
                        const newTime = prompt("Enter new time:", schedule.time);
                        if (newDay && newTime) {
                            handleScheduleUpdate(schedule.id, newDay, newTime, schedule.triggered || false, schedule.active);
                        }
                    }}
                >
                    <Edit size={18} />
                </button>
                <RemoveScheduleDialog
                    scheduleId={schedule.id}
                    fetchSchedules={fetchSchedules}
                    removeSchedule={removeSchedule}
                    setSchedules={setSchedules}
                />
                
                </div>
            </div>
        </motion.div>
    );
}
export default ScheduleCard;