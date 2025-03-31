"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { addPlant } from "@/actions/plants/plants.actions";

function AddPlantDialog({ gardenId }: { gardenId: string }) {
  const [open, setOpen] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [watering, setWatering] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gardenId || !plantName) return;

    try {
      await addPlant({
        garden_id: gardenId,
        plant_name: plantName,
        description,
        sunlight_requirement: sunlight,
        watering_requirement: watering,
      });

      toast.success("Plant added!");
      setOpen(false);
      setPlantName("");
      setDescription("");
      setSunlight("");
      setWatering("");
    } catch (error) {
      console.error("Error adding plant", error);
      toast.error("Failed to add plant");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-green-600 px-4 py-2 text-white hover:bg-[#029b56]">
          +
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Plant
        </DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plant Name
            </label>
            <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Enter plant name"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sunlight Requirement
            </label>
            <input
              type="text"
              value={sunlight}
              onChange={(e) => setSunlight(e.target.value)}
              placeholder="e.g., Partial Sunlight"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Watering Requirement
            </label>
            <input
              type="text"
              value={watering}
              onChange={(e) => setWatering(e.target.value)}
              placeholder="e.g., Twice a week"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              className="w-full rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]"
            >
              Add Plant
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

export default AddPlantDialog;
