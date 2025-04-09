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

interface AddCameraDialogProps {
  gardenId: string;
  onCameraAdded?: () => void;
}

const AddCameraDialog = ({ gardenId, onCameraAdded }: AddCameraDialogProps) => {
  const [open, setOpen] = useState(false);
  const [cameraIp, setCameraIp] = useState("");
  const [port, setPort] = useState("5000");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAddCamera = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/cameras/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garden_id: gardenId,
          camera_ip: cameraIp,
          port: parseInt(port),
          username,
          password,
        }),
      });

      if (!res.ok) throw new Error("Failed to add camera");

      toast.success("✅ Camera added!");
      setOpen(false);
      setCameraIp("");
      setPort("5000");
      setUsername("");
      setPassword("");
      onCameraAdded?.();
    } catch (err) {
      console.error("Error adding camera:", err);
      toast.error("❌ Failed to add camera");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition">
          ➕ Add Camera
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Camera
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-gray-600">
          Fill in your camera configuration
        </DialogDescription>

        <form onSubmit={handleAddCamera} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Camera IP / Endpoint
            </label>
            <input
              type="text"
              value={cameraIp}
              onChange={(e) => setCameraIp(e.target.value)}
              placeholder="e.g. /video or /cam"
              required
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Port
            </label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="e.g. 554"
              required
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Camera username"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Camera password"
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-green-600 focus:outline-none"
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={!cameraIp || !port}
              className={`w-full rounded-full px-4 py-2 text-white ${
                !cameraIp || !port
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Save Camera
            </button>
          </DialogFooter>
        </form>

        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AddCameraDialog;
