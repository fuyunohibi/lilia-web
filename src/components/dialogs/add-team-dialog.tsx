"use client";

import React, { useState, useEffect } from "react";
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
import Image from "next/image";

function AddTeamDialog({ currentUser }) {
  const [teamName, setTeamName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all users on component mount
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

  // Filter users based on search term and exclude the current user
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = user.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isNotSelf = !currentUser || user.user_id !== currentUser.user_id;
    return matchesSearch && isNotSelf;
  });

  const handleToggleUser = (user) => {
    if (selectedMembers.find((member) => member.user_id === user.user_id)) {
      setSelectedMembers(
        selectedMembers.filter((member) => member.user_id !== user.user_id)
      );
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your addTeam action call.
    console.log("Add Team", { teamName, members: selectedMembers });
    setTeamName("");
    setSelectedMembers([]);
    setSearchTerm("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]">
          + Add Team
        </button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="text-center text-2xl font-bold text-gray-800">
          Add Team
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-gray-600">
          Enter team details below.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-3 focus:border-[#00A35B] focus:outline-none"
            />
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
                className={`flex justify-start items-center gap-2 cursor-pointer p-2 rounded-sm transition-colors ${
                  selectedMembers.find(
                    (member) => member.user_id === user.user_id
                  )
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
          <DialogFooter className="">
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
