"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { addSchedule } from "@/actions/gardens/schedule.actions";
import { DAYS_OF_WEEK } from "@/constants";


function AddScheduleDialog({
  gardenId,
  fetchSchedules,
}: {
  gardenId: string;
  fetchSchedules: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [scheduleDay, setScheduleDay] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [minMoisture, setMinMoisture] = useState(20);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDay || !scheduleTime || !gardenId) return;

    try {
      await addSchedule(
        gardenId,
        scheduleDay,
        scheduleTime,
        false, // scheduleTriggered
        true, // scheduleActive
        duration,
        minMoisture
      );
      toast.success("Schedule added!");
      setScheduleDay("");
      setScheduleTime("");
      setDuration(30);
      setMinMoisture(20);
      setOpen(false);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to add schedule", err);
      toast.error("Failed to add schedule.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]">
          + Add Schedule
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Schedule
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-gray-600">
          Choose day, time, and watering conditions.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day of Week
            </label>
            <select
              value={scheduleDay}
              onChange={(e) => setScheduleDay(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            >
              <option value="" disabled>
                Select a day
              </option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              placeholder="e.g., 30"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Moisture (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={minMoisture}
              onChange={(e) => setMinMoisture(Number(e.target.value))}
              placeholder="e.g., 20"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={!scheduleDay || !scheduleTime}
              className={`w-full rounded-full px-4 py-2 text-white ${
                !scheduleDay || !scheduleTime
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#00A35B] hover:bg-[#029b56]"
              }`}
            >
              Add Schedule
            </button>
          </DialogFooter>
        </form>

        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default AddScheduleDialog;
