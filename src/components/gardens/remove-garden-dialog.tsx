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
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { removeSchedule } from "@/actions/gardens/schedule.actions";

function RemoveScheduleDialog({
  scheduleId,
  fetchSchedules,
  setSchedules,
}: {
  scheduleId: string;
  fetchSchedules: () => Promise<void>;
  setSchedules: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScheduleDelete = async () => {
    try {
      setLoading(true);
      await removeSchedule(scheduleId);
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      toast.success("✅ Schedule deleted");
      await fetchSchedules();
    } catch (error) {
      console.error("❌ Error deleting schedule:", error);
      toast.error("Failed to delete schedule");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-red-500 hover:text-red-600">
          <Trash size={18} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold">
          Remove Schedule?
        </DialogTitle>

        <DialogFooter className="mt-4 mx-auto gap-8">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-12 px-5 rounded-full bg-neutral-500 text-white hover:bg-neutral-600 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleScheduleDelete}
            className="h-12 px-5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove"}
          </button>
        </DialogFooter>

        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveScheduleDialog;
