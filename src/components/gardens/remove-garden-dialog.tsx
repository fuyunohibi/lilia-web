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
import { removeSchedule } from "@/actions/gardens/schedule.actions";
import { Trash } from "lucide-react";


function RemoveScheduleDialog({ scheduleId, fetchSchedules, setSchedules }: { 
    scheduleId: number; 
    fetchSchedules: () => Promise<void>; 
    removeSchedule: (id: number) => void;
    setSchedules: React.Dispatch<React.SetStateAction<any[]>>;

 }) {
  const [scheduleDay, setScheduleDay] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [open, setOpen] = useState(false);

  const handleScheduleDelete = async (id: number) => {
    try {
        await removeSchedule(id);
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        fetchSchedules();
    } catch (error) {
        console.error("Error deleting schedule:", error);
    }
};

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Adding schedule");
    e.preventDefault();
    if (!scheduleDay || !scheduleTime || !scheduleId) {
      console.log("Invalid inputs");
      return;
    }

    try {
      console.log("Adding schedule to database");
      await removeSchedule(scheduleId);
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
        fetchSchedules();
    } catch (error) {
        console.error("Error deleting schedule:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
            onClick={() => removeSchedule(scheduleId)} 
            className="text-red-500 hover:text-red-600"
        >
            <Trash size={18} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          Remove Schedule?
        </DialogTitle>
    
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
                className="flex items-center justify-center h-12 px-5 rounded-full bg-red-500 text-white shadow-lg cursor-pointer hover:bg-red-600 transition duration-200"
            >
                <h1 className="text-xl font-semibold">Remove</h1>
            </button>
        </DialogFooter>

        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveScheduleDialog;
