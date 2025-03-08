"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "src/components/ui/dialog";
import { getAllUsers } from "src/actions/users/users.actions";
import { addTeam } from "src/actions/teams/teams.actions";
import { teamSchema } from "src/schemas/team.schemas";

function AddTeamDialog({ currentUser }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: { teamName: "", members: [] },
  });

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const result = await getAllUsers();
      if (result.data) {
        setAllUsers(result.data);
      } else {
        console.error("Error fetching users", result.error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const fUsers = allUsers.filter((user) => {
      const matchesSearch = user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const isNotSelf = !currentUser || user.user_id !== currentUser.user_id;
      return matchesSearch && isNotSelf;
    });
    setFilteredUsers(fUsers);
  }, [searchTerm, allUsers, currentUser]);

  const members = watch("members");

  const handleToggleUser = (user) => {
    if (members.includes(user.user_id)) {
      setValue(
        "members",
        members.filter((id) => id !== user.user_id)
      );
    } else {
      setValue("members", [...members, user.user_id]);
    }
  };

 const onSubmit = async (data) => {
   if (currentUser && !data.members.includes(currentUser.user_id)) {
     data.members.push(currentUser.user_id);
   }
   try {
     console.log("Add Team", data);
     await addTeam(data);
     toast.success("Team added!");
     reset();
     setSearchTerm("");
     setOpen(false); 
   } catch (error) {
     console.error("Error adding team", error);
   }
 };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]">
          + Add Team
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Team
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-gray-600">
          Enter team details below.
        </DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="teamName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              placeholder="Team Name"
              {...register("teamName")}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
            {errors.teamName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.teamName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="userSearch"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Search Users
            </label>
            <input
              id="userSearch"
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
          </div>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                onClick={() => handleToggleUser(user)}
                className={`flex items-center gap-2 cursor-pointer p-2 rounded-sm transition-colors ${
                  members.includes(user.user_id)
                    ? "bg-[#00A35B] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                {user.username}
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-sm text-gray-500">No users found.</p>
            )}
          </div>
          {errors.members && (
            <p className="text-sm text-red-500">{errors.members.message}</p>
          )}
          <DialogFooter>
            <button
              type="submit"
              className="w-full rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]"
            >
              Add Team
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

export default AddTeamDialog;
