"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "src/components/ui/dialog";

function AddGardenDialog() {
  const [gardenName, setGardenName] = useState("");
  const [gardenLocation, setGardenLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your addGarden action call
    console.log("Add Garden", { gardenName, gardenLocation });
    setGardenName("");
    setGardenLocation("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]">
          + Add Garden
        </button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Garden
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="gardenName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Garden Name
            </label>
            <input
              id="gardenName"
              type="text"
              placeholder="Garden Name"
              value={gardenName}
              onChange={(e) => setGardenName(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="gardenLocation"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Garden Location
            </label>
            <input
              id="gardenLocation"
              type="text"
              placeholder="Garden Location"
              value={gardenLocation}
              onChange={(e) => setGardenLocation(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>
          <DialogFooter className="">
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