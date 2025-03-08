"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "src/components/ui/dialog";
import { sensorSchema } from "src/schemas/sensor.schemas";
// import { addSensor } from "src/actions/sensors/sensors.actions";


function AddSensorDialog() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm ({
    resolver: zodResolver(sensorSchema),
    defaultValues: { sensor_name: "", sensor_type: "", sensor_unit: "" },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Add Sensor", data);
      // await addSensor(data);
      toast.success("Sensor added!");
      reset();
    } catch (error) {
      console.error("Error adding sensor", error);
      toast.error("Failed to add sensor");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]">
          + Add Sensor
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Sensor
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="sensor_name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sensor Name
            </label>
            <input
              id="sensor_name"
              type="text"
              placeholder="Sensor Name"
              {...register("sensor_name")}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
            {errors.sensor_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.sensor_name.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="sensor_type"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sensor Type
            </label>
            <select
              id="sensor_type"
              {...register("sensor_type")}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            >
              <option value="">Select sensor type...</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="moisture">Soil Moisture</option>
              <option value="light">Light</option>
            </select>
            {errors.sensor_type && (
              <p className="mt-1 text-sm text-red-500">
                {errors.sensor_type.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="sensor_unit"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sensor Unit
            </label>
            <input
              id="sensor_unit"
              type="text"
              placeholder="e.g., °C, %, lx"
              {...register("sensor_unit")}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
            {errors.sensor_unit && (
              <p className="mt-1 text-sm text-red-500">
                {errors.sensor_unit.message}
              </p>
            )}
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
