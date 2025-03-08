"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "src/components/ui/dialog";

function DragAndDrop({ onFileAccepted, previewUrl, setPreviewUrl }) {
 const { getRootProps, getInputProps, isDragActive } = useDropzone({
   accept: { "image/*": [] },
   onDrop: (acceptedFiles) => {
     const file = acceptedFiles[0];
     if (file) {
       onFileAccepted(file);
       setPreviewUrl(URL.createObjectURL(file));
     }
   },
 });


  return (
    <div
      {...getRootProps()}
      className="border-dashed w-full rounded-2xl border border-gray-400 p-6 text-center cursor-pointer focus:border-[#00A35B] focus:outline-none"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-600">Drop the image here ...</p>
      ) : previewUrl ? (
        <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-auto" />
      ) : (
        <p className="text-gray-600">
          Drag &amp; drop an image here, or click to select one
        </p>
      )}
    </div>
  );
}

function AddPlantDialog() {
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [watering, setWatering] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileAccepted = (file) => {
    setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your addPlant action call.
    console.log("Add Plant", {
      plantName,
      description,
      sunlight,
      watering,
      imageFile,
    });
    // Reset form state
    setPlantName("");
    setDescription("");
    setSunlight("");
    setWatering("");
    setImageFile(null);
    setPreviewUrl("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]">
          + Add Plant
        </button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Plant to Garden
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Plant Icon
            </label>
            <DragAndDrop
              onFileAccepted={handleFileAccepted}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />
          </div>
          <div>
            <label
              htmlFor="plantName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Plant Name
            </label>
            <input
              id="plantName"
              type="text"
              placeholder="Plant Name"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="sunlight"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sunlight Requirement
            </label>
            <input
              id="sunlight"
              type="text"
              placeholder="Partial sunlight"
              value={sunlight}
              onChange={(e) => setSunlight(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="watering"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Watering Requirement
            </label>
            <input
              id="watering"
              type="text"
              placeholder="Twice a week"
              value={watering}
              onChange={(e) => setWatering(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>
          <DialogFooter className="">
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
