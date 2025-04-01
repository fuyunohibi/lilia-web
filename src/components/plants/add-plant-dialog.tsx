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

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function AddPlantDialog({ gardenId }: { gardenId: string }) {
  const [open, setOpen] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [wateringDays, setWateringDays] = useState<string[]>([]);
  const [wateringTime, setWateringTime] = useState("06:30");
  const [imageUrl, setImageUrl] = useState("");

  const toggleDay = (day: string) => {
    setWateringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gardenId || !plantName || wateringDays.length === 0 || !wateringTime) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addPlant({
        garden_id: gardenId,
        plant_name: plantName,
        description,
        watering_days: wateringDays,
        watering_time: wateringTime + ":00", 
        image_url: imageUrl,
      });

      toast.success("🌿 Plant added!");
      setOpen(false);
      setPlantName("");
      setDescription("");
      setWateringDays([]);
      setWateringTime("06:30");
      setImageUrl("");
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
              Plant Name *
            </label>
            <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g., Basil"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
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
              placeholder="e.g., Loves morning sunlight"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Watering Days *
            </label>
            <div className="flex flex-wrap gap-2">
              {allDays.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    wateringDays.includes(day)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Watering Time *
            </label>
            <input
              type="time"
              value={wateringTime}
              onChange={(e) => setWateringTime(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              className="w-full rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
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
