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
import { addSchedule } from "@/actions/gardens/schedule.actions";

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

function AddScheduleDialog({ gardenId, fetchSchedules }: { gardenId: string; fetchSchedules: () => Promise<void> }) {
  const [scheduleDay, setScheduleDay] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleTriggered, setScheduleTriggered] = useState(false);
  const [scheduleActive, setScheduleActive] = useState(true);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Adding schedule");
    e.preventDefault();
    if (!scheduleDay || !scheduleTime || !gardenId) {
      console.log("Invalid inputs");
      return;
    }

    try {
      console.log("Adding schedule to database");
      await addSchedule({
        garden_id: gardenId,
        day: scheduleDay,
        time: scheduleTime,
        triggered: scheduleTriggered,
        active: scheduleActive,
      });
      fetchSchedules();

      console.log("Schedule added successfully");

      toast.success("schedule added successfully!");
      setScheduleTime("");
      setScheduleDay("");
      setScheduleTriggered(false);
      setScheduleActive(true);
      setOpen(false);
    } catch (err) {
      console.error("Failed to add schedule", err);
      toast.error("Failed to add schedule.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-green-500 flex justify-center items-center px-4 py-2 text-xl text-white font-semibold hover:bg-green-600 transition duration-200">
          + Add Schedule
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          Add Schedule
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
              type="submit"
              onClick={() => setOpen(false)}
              disabled={!scheduleDay || !scheduleTime}
              className="flex items-center justify-center h-12 px-5 rounded-full bg-green-500 text-white shadow-lg cursor-pointer hover:bg-green-600 transition duration-200"
            >
              <h1 className="text-xl font-semibold">Add</h1>
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center h-12 px-5 rounded-full bg-neutral-500 text-white shadow-lg cursor-pointer hover:bg-neutral-600 transition duration-200"
            >
              <h1 className="text-xl font-semibold">Cancel</h1>
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

export default AddScheduleDialog;
