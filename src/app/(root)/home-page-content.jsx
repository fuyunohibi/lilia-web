"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signout } from "src/actions/auth/authentication.actions";
import AddTeamDialog from "src/components/dialogs/add-team-dialog";
import AddGardenDialog from "src/components/dialogs/add-garden-dialog";
import AddSensorDialog from "src/components/dialogs/add-sensor-dialog";
// import AddPlantDialog from "src/components/dialogs/add-plant-dialog";
import {
  getCurrentUserTeams,
  getTeamDetails,
} from "src/actions/teams/teams.actions";

export default function HomePageContent({ currentUser }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);

  const plantIcons = [
    "/assets/images/plants/plant-1.png",
    "/assets/images/plants/plant-2.png",
    "/assets/images/plants/plant-3.png",
    "/assets/images/plants/plant-4.png",
  ];

  useEffect(() => {
    async function fetchTeams() {
      if (currentUser?.user_id) {
        const result = await getCurrentUserTeams(currentUser.user_id);
        if (result.data) {
          setTeams(result.data);
          if (result.data.length > 0) {
            setSelectedTeam(result.data[0]);
          }
        } else {
          console.error("Error fetching teams", result.error);
        }
      }
    }
    fetchTeams();
  }, [currentUser]);

  useEffect(() => {
    async function fetchDetails() {
      if (selectedTeam && selectedTeam.team_id) {
        const result = await getTeamDetails(selectedTeam.team_id);
        if (result.data) {
          setTeamDetails(result.data);
        } else {
          console.error("Error fetching team details", result.error);
        }
      } else {
        setTeamDetails(null);
      }
    }
    fetchDetails();
  }, [selectedTeam]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signout();
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      setLoggingOut(false);
      window.location.reload();
    }
  };

  return (
    <div className="font-serif flex min-h-screen flex-col bg-gray-50 text-gray-800 md:flex-row">
      {/* LEFT SECTION: Dashboard */}
      <section className="w-full border-b border-gray-200 p-6 md:w-1/2 md:border-b-0 md:border-r">
        <div className="mx-auto max-w-md">
          {/* Header: Greeting + Avatar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                {currentUser?.avatar_url ? (
                  <Image
                    src={currentUser.avatar_url}
                    alt="User Avatar"
                    fill
                    sizes="40px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span className="text-xs text-gray-500">No Avatar</span>
                )}
              </div>
              <h1 className="text-2xl font-bold">
                Hey {currentUser?.full_name ?? "Guest"}
              </h1>
            </div>
            {currentUser ? (
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <Link
                href="/flow/auth/signup"
                className="rounded-full bg-[#00A35B] px-4 py-2 text-white hover:bg-[#029b56]"
              >
                Sign Up
              </Link>
            )}
          </div>
          <p className="mt-2 text-gray-600">
            Welcome back to your Smart Garden!
          </p>

          {/* Cards: Home Garden, Smart Devices */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Home Garden Card */}
            <div className="flex flex-col rounded-3xl bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#00A35B]">
                  {teamDetails?.gardens && teamDetails.gardens.length > 0
                    ? teamDetails.gardens
                        .map((item) => item.garden.garden_name)
                        .join(", ")
                    : "Home Garden"}
                </h2>
                <span className="text-sm text-gray-500">
                  {plantIcons.length} Plants
                </span>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                {plantIcons.slice(0, 4).map((icon, i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                  >
                    <Image
                      src={icon}
                      alt={`Plant ${i}`}
                      width={500}
                      height={500}
                      className="object-cover rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Devices Card (Mocked) */}
            <div className="flex flex-col rounded-3xl bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#00A35B]">
                  Smart Devices
                </h2>
                <span className="text-sm text-gray-500">3 Active</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Monitor humidity, soil moisture, and temperature automatically.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex space-x-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab("today")}
              className={`${
                activeTab === "today"
                  ? "border-b-2 border-[#00A35B] text-[#00A35B]"
                  : "text-gray-500"
              } pb-1`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab("thisWeek")}
              className={`${
                activeTab === "thisWeek"
                  ? "border-b-2 border-[#00A35B] text-[#00A35B]"
                  : "text-gray-500"
              } pb-1`}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveTab("thisMonth")}
              className={`${
                activeTab === "thisMonth"
                  ? "border-b-2 border-[#00A35B] text-[#00A35B]"
                  : "text-gray-500"
              } pb-1`}
            >
              This Month
            </button>
          </div>

          {/* Tasks */}
          <div className="mt-4 space-y-3">
            {activeTab === "today" && (
              <>
                <div className="rounded-xl bg-white p-3 shadow">
                  <p className="text-sm">
                    Did you water <strong>“Plant under stairs”</strong> today?
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow">
                  <p className="text-sm">
                    Check moisture sensor readings for{" "}
                    <strong>Garden Bed #2</strong>.
                  </p>
                </div>
              </>
            )}
            {activeTab === "thisWeek" && (
              <div className="rounded-xl bg-white p-3 shadow">
                <p className="text-sm">
                  Weekly tasks and scheduled watering will appear here...
                </p>
              </div>
            )}
            {activeTab === "thisMonth" && (
              <div className="rounded-xl bg-white p-3 shadow">
                <p className="text-sm">
                  Monthly tasks and fertilizing schedule will appear here...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RIGHT SECTION: Team Selection, Members & Garden Details */}
      <section className="w-full p-6 md:w-1/2">
        <div className="mx-auto max-w-md">
          {/* Header: Team Select & Add Team */}
          <div className="flex items-center justify-between">
            <select
              value={selectedTeam?.team_id || ""}
              onChange={(e) => {
                const team = teams.find((t) => t.team_id === e.target.value);
                setSelectedTeam(team);
              }}
              className="rounded-3xl border border-gray-300 p-2 focus:border-[#00A35B] focus:outline-none"
            >
              {teams.map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
            <AddTeamDialog currentUser={currentUser} />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-medium text-gray-700">Members ({teamDetails?.team?.members?.length || 0})</h3>
            {teamDetails?.team?.members &&
            teamDetails.team.members.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {teamDetails.team.members.map((member) => (
                  <li key={member.user_id} className="flex items-center gap-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                      <Image
                        src={member.avatar_url}
                        alt={member.username}
                        fill
                        sizes="32px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      {member.username}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No members available</p>
            )}
          </div>

          {/* Garden Details for the Selected Team */}
          {teamDetails?.gardens && teamDetails.gardens.length > 0 ? (
            <div className="mt-4 border p-4 rounded-3xl shadow flex items-center justify-between">
              <p className="text-lg font-semibold text-[#00A35B]">
                {teamDetails.gardens
                  .map((item) => item.garden.garden_name)
                  .join(", ")}
              </p>
              <AddSensorDialog />
            </div>
          ) : (
            <div className="mt-4 border p-4 rounded-3xl shadow flex items-center justify-between">
              <p className="text-lg font-semibold text-[#00A35B]">
                No garden available
              </p>
              <AddSensorDialog />
            </div>
          )}

          <div className="mt-6 flex justify-center items-center">
            <AddGardenDialog teamId={selectedTeam?.team_id || ""} />
          </div>
        </div>
      </section>
    </div>
  );
}
