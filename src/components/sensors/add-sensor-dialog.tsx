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
import { addSensor } from "@/actions/sensors/sensor.actions";

function AddSensorDialog({ gardenId }: { gardenId: string }) {
  const [sensorType, setSensorType] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [sensorUnit, setSensorUnit] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sensorType || !sensorName || !sensorUnit || !gardenId) return;

    try {
      await addSensor({
        garden_id: gardenId,
        sensor_name: sensorName,
        sensor_type: sensorType,
        unit: sensorUnit,
      });

      toast.success("Sensor added successfully!");
      setSensorName("");
      setSensorType("");
      setSensorUnit("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to add sensor", err);
      toast.error("Failed to add sensor.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-neutral-600 flex justify-center items-center px-4 text-white hover:hover:bg-neutral-500">
          +
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Sensor
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sensor Name
            </label>
            <input
              type="text"
              value={sensorName}
              onChange={(e) => setSensorName(e.target.value)}
              placeholder="e.g., Soil Moisture Sensor"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sensor Type
            </label>
            <select
              value={sensorType}
              onChange={(e) => setSensorType(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            >
              <option value="">Select a type</option>
              <option value="Light">Light</option>
              <option value="Soil Moisture">Soil Moisture</option>
              <option value="Water Level">Water Level</option>
              <option value="Temperature">Temperature</option>
              <option value="Humidity">Humidity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit (e.g., %, Lux, cm)
            </label>
            <input
              type="text"
              value={sensorUnit}
              onChange={(e) => setSensorUnit(e.target.value)}
              placeholder="e.g., %, Lux, cm"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              className="w-full rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]"
            >
              Add Sensor
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

export default AddSensorDialog;
