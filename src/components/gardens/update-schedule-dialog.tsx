"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { updateSchedule } from "@/actions/gardens/schedule.actions";

const daysOfWeek = [
    "No Repeat",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

function UpdateScheduleDialog({ scheduleId, schedule, fetchSchedules, handleScheduleUpdate }: { 
    scheduleId: string; 
    schedule: { id: string; day: string; time: string; triggered?: boolean; active: boolean };
    fetchSchedules: () => Promise<void>; 
    handleScheduleUpdate: (id: string, day: string, time: string, triggered: boolean, active: boolean) => void 
}) {
  const [scheduleDay, setScheduleDay] = useState(schedule.day);
  const [scheduleTime, setScheduleTime] = useState(schedule.time);
  const [scheduleTriggered, setScheduleTriggered] = useState(schedule.triggered || false);
  const [scheduleActive, setScheduleActive] = useState(schedule.active);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Updating schedule");
    e.preventDefault();
    if (!scheduleDay || !scheduleTime) {
      console.log("Invalid inputs");
      return;
    }

    try {
      console.log("Updating schedule to database");
      handleScheduleUpdate(
        scheduleId,
        scheduleDay,
        scheduleTime,
        scheduleTriggered,
        scheduleActive
      );
      fetchSchedules();

      console.log("Schedule updated successfully");

      toast.success("schedule updated successfully!");
      setScheduleTime("");
      setScheduleDay("");
      setScheduleTriggered(false);
      setScheduleActive(true);
      setOpen(false);
    } catch (err) {
      console.error("Failed to update schedule", err);
      toast.error("Failed to update schedule.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
            className="text-blue-500 hover:text-blue-600"
        >
            <Edit size={18} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          Edit Schedule
        </DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <select
            value={scheduleDay}
            onChange={(e) => setScheduleDay(e.target.value)}
            className="p-2 mx-auto rounded-md shadow-md dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-3/4"
          >
            <option value="" disabled>Select a day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          <input
            type="time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="p-2 mx-auto rounded-md shadow-md dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-3/4"
          />
    
          <DialogFooter className="mt-4 mx-auto gap-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center h-12 px-5 rounded-full bg-neutral-500 text-white shadow-lg cursor-pointer hover:bg-neutral-600 transition duration-200"
            >
              <h1 className="text-xl font-semibold">Cancel</h1>
            </button>
            <button
              type="submit"
              onClick={() => setOpen(false)}
              disabled={!scheduleDay || !scheduleTime}
              className="flex items-center justify-center h-12 px-5 rounded-full bg-green-500 text-white shadow-lg cursor-pointer hover:bg-green-600 transition duration-200"
            >
              <h1 className="text-xl font-semibold">Update</h1>
            </button>
          </DialogFooter>
        </form>

        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateScheduleDialog;
