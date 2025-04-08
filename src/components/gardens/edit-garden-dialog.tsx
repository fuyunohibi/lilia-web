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
import { updateGarden } from "@/actions/gardens/gardens.actions";
import { Switch } from "@/components/ui/switch";
import { IconDots } from "@tabler/icons-react";

type Garden = {
  garden_id: string;
  garden_name: string;
  garden_location: string;
  device_id: string;
  is_default: boolean;
};

function EditGardenDialog({
  teamId,
  garden,
  onGardenUpdated,
}: {
  teamId: string;
  garden: Garden;
  onGardenUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [gardenName, setGardenName] = useState(garden.garden_name);
  const [gardenLocation, setGardenLocation] = useState(garden.garden_location);
  const [deviceId, setDeviceId] = useState(garden.device_id);
  const [isDefault, setIsDefault] = useState(garden.is_default);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateGarden({
        garden_id: garden.garden_id,
        team_id: teamId,
        garden_name: gardenName,
        garden_location: gardenLocation,
        device_id: deviceId,
        is_default: isDefault,
      });
      toast.success("Garden updated!");
      setOpen(false);
      onGardenUpdated?.();
    } catch (error) {
      console.error("Error updating garden", error);
      toast.error("Failed to update garden");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-neutral-500 hover:text-black dark:hover:text-white underline">
          <IconDots size={24} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Edit Garden
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-gray-600">
          Modify garden details below.
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
              Device ID
            </label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Enter garden Device"
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
              disabled={!gardenName || !gardenLocation || !deviceId}
              className={`w-full rounded-full px-4 py-2 text-white ${
                !gardenName || !gardenLocation || !deviceId
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#00A35B] hover:bg-[#029b56]"
              }`}
            >
              Update Garden
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

export default EditGardenDialog;
