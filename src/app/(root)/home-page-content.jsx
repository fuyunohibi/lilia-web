"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signout } from "src/actions/auth/authentication.actions";

import AddTeamDialog from "src/components/dialogs/add-team-dialog";
import AddGardenDialog from "src/components/dialogs/add-garden-dialog";
import AddPlantDialog from "src/components/dialogs/add-plant-dialog";

// ----------------- HomePageContent Component -----------------
export default function HomePageContent({ currentUser }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  const plantIcons = [
    "/assets/images/plants/plant-1.png",
    "/assets/images/plants/plant-2.png",
    "/assets/images/plants/plant-3.png",
    "/assets/images/plants/plant-4.png",
  ];

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
                {currentUser.avatar_url ? (
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
            <div className="flex flex-col rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#00A35B]">
                  Home Garden
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

            {/* Smart Devices Card */}
            <div className="flex flex-col rounded-lg bg-white p-4 shadow">
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
                <div className="rounded-lg bg-white p-3 shadow">
                  <p className="text-sm">
                    Did you water <strong>“Plant under stairs”</strong> today?
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow">
                  <p className="text-sm">
                    Check moisture sensor readings for{" "}
                    <strong>Garden Bed #2</strong>.
                  </p>
                </div>
              </>
            )}
            {activeTab === "thisWeek" && (
              <div className="rounded-lg bg-white p-3 shadow">
                <p className="text-sm">
                  Weekly tasks and scheduled watering will appear here...
                </p>
              </div>
            )}
            {activeTab === "thisMonth" && (
              <div className="rounded-lg bg-white p-3 shadow">
                <p className="text-sm">
                  Monthly tasks and fertilizing schedule will appear here...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RIGHT SECTION: Home Garden Details */}
      <section className="w-full p-6 md:w-1/2">
        <div className="mx-auto max-w-md">
          <h2 className="text-2xl font-bold text-[#00A35B]">Home Garden</h2>
          <p className="mt-1 text-gray-600">{plantIcons.length} Plants</p>

          {/* Plant Icons */}
          <div className="mt-4 flex flex-wrap gap-3">
            {plantIcons.map((icon, i) => (
              <div
                key={i}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
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

          {/* Selected Plant Details */}
          <div className="mt-6 rounded-lg bg-white p-4 shadow">
            <h3 className="text-xl font-semibold text-[#00A35B]">Plant Name</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>
                <strong>Description:</strong> Beautiful indoor plant
              </li>
              <li>
                <strong>Location:</strong> Near window
              </li>
              <li>
                <strong>Sunlight requirement:</strong> Partial sunlight
              </li>
              <li>
                <strong>Watering requirement:</strong> Twice a week
              </li>
              <li>
                <strong>Schedule:</strong> Monday &amp; Thursday
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Need more automation?
              </span>
              <AddPlantDialog />
            </div>
          </div>

          {/* Actions: Add Garden, Add Team */}
          <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AddGardenDialog />
            <AddTeamDialog />
          </div>
        </div>
      </section>
    </div>
  );
}
