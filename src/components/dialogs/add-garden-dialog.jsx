"use client";

import React, { useState } from "react";
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
import { gardenSchema } from "src/schemas/garden.schemas";
import { addGarden } from "src/actions/gardens/gardens.actions";


function AddGardenDialog({ teamId }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm ({
    resolver: zodResolver(gardenSchema),
    defaultValues: { team_id: teamId, garden_name: "", garden_location: "" },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Add Garden", data);
      await addGarden(data);
      toast.success("Garden added!");
      reset();
      setOpen(false); // close dialog on success
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Hidden input for team_id */}
          <input type="hidden" {...register("team_id")} value={teamId} />
          <div>
            <label
              htmlFor="garden_name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Garden Name
            </label>
            <input
              id="garden_name"
              type="text"
              placeholder="Garden Name"
              {...register("garden_name")}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
            {errors.garden_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.garden_name.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="garden_location"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Garden Location
            </label>
            <input
              id="garden_location"
              type="text"
              placeholder="Garden Location"
              {...register("garden_location")}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
            {errors.garden_location && (
              <p className="mt-1 text-sm text-red-500">
                {errors.garden_location.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <button
              type="submit"
              className="w-full rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]"
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
