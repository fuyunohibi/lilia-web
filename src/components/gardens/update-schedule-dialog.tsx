"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DAYS_OF_WEEK } from "@/constants";


function UpdateScheduleDialog({
  scheduleId,
  schedule,
  fetchSchedules,
  handleScheduleUpdate,
}: {
  scheduleId: string;
  schedule: {
    id: string;
    day: string;
    time: string;
    triggered?: boolean;
    active: boolean;
  };
  fetchSchedules: () => Promise<void>;
  handleScheduleUpdate: (
    id: string,
    day: string,
    time: string,
    triggered: boolean,
    active: boolean,
    duration?: number,
    min_moisture?: number
  ) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [scheduleDay, setScheduleDay] = useState(schedule.day);
  const [scheduleTime, setScheduleTime] = useState(schedule.time);
  const [scheduleTriggered, setScheduleTriggered] = useState(
    schedule.triggered || false
  );
  const [scheduleActive, setScheduleActive] = useState(schedule.active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDay || !scheduleTime) return;

    try {
      await handleScheduleUpdate(
        scheduleId,
        scheduleDay,
        scheduleTime,
        scheduleTriggered,
        scheduleActive
      );
      toast.success("Schedule updated!");
      setOpen(false);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to update schedule", err);
      toast.error("Failed to update schedule.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-blue-500 hover:text-blue-600">
          <Edit size={18} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Edit Schedule
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-gray-600">
          Update day and time for the watering schedule.
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
              Update Schedule
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

export default UpdateScheduleDialog;
