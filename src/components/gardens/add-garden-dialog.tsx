"use client";

import React, { useState } from "react";
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
import { addGarden } from "@/actions/gardens/gardens.actions";
import { Switch } from "@/components/ui/switch";

function AddGardenDialog({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [gardenName, setGardenName] = useState("");
  const [gardenLocation, setGardenLocation] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !gardenName || !gardenLocation) return;

    try {
      await addGarden({
        team_id: teamId,
        garden_name: gardenName,
        garden_location: gardenLocation,
        is_default: isDefault,
      });
      toast.success("Garden added!");
      setOpen(false);
      setGardenName("");
      setGardenLocation("");
      setIsDefault(false);
    } catch (error) {
      console.error("Error adding garden", error);
      toast.error("Failed to add garden");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]">
          + Add Garden
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Garden
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-gray-600">
          Fill in the garden details below.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Garden Name
            </label>
            <input
              type="text"
              value={gardenName}
              onChange={(e) => setGardenName(e.target.value)}
              placeholder="Enter garden name"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Garden Location
            </label>
            <input
              type="text"
              value={gardenLocation}
              onChange={(e) => setGardenLocation(e.target.value)}
              placeholder="Enter garden location"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="is_default"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Set as default garden
            </label>
            <Switch
              id="is_default"
              checked={isDefault}
              onCheckedChange={(checked: boolean) => setIsDefault(checked)}
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={!teamId || !gardenName || !gardenLocation}
              className={`w-full rounded-full px-4 py-2 text-white ${
                !teamId || !gardenName || !gardenLocation
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#00A35B] hover:bg-[#029b56]"
              }`}
            >
              Add Garden
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

export default AddGardenDialog;
