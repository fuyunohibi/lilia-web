"use client";

import { useEffect, useState } from "react";
import {
  getCurrentUserTeams,
  getTeamGardens,
} from "@/actions/teams/teams.actions";
import { getCurrentUser } from "@/actions/users/users.actions";
import { getGardenPlants } from "@/actions/gardens/gardens.actions";
import { getGardenSensors } from "@/actions/sensors/sensor.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconChevronDown, IconPlant } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout.tsx/page-content";
import { cn } from "@/lib/utils";
import AddGardenDialog from "@/components/gardens/add-garden-dialog";
import AddPlantDialog from "@/components/plants/add-plant-dialog";
import AddSensorDialog from "@/components/sensors/add-sensor-dialog";
import { PlantDetailsDialog } from "@/components/plants/plant-details-dialog";
import Image from "next/image";

const GardenPage = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [gardens, setGardens] = useState<any[]>([]);
  const [gardenPlantCounts, setGardenPlantCounts] = useState<{
    [key: string]: number;
  }>({});
  const [gardenSensorCounts, setGardenSensorCounts] = useState<{
    [key: string]: number;
  }>({});
  const [gardenPlants, setGardenPlants] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [expandedGarden, setExpandedGarden] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndTeams = async () => {
      const user = await getCurrentUser();
      if (!user) return;
      setCurrentUser(user);
      const { data } = await getCurrentUserTeams(user.id);
      if (data) {
        setTeams(data);
        setSelectedTeamId(data[0]?.team_id ?? "");
      }
      setLoading(false);
    };
    loadUserAndTeams();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedTeamId) return;
      const { data } = await getTeamGardens(selectedTeamId);
      setGardens(data || []);

      const plantCounts = await Promise.all(
        (data || []).map((garden: any) =>
          getGardenPlants(garden.garden_id).then((res) => [
            garden.garden_id,
            res.data?.length || 0,
          ])
        )
      );

      const sensorCounts = await Promise.all(
        (data || []).map(async (garden: any) => {
          const res = await getGardenSensors(garden.garden_id);
          console.log("garden id:", garden.garden_id, "sensors:", res.data); // Now should be correct
          return [garden.garden_id, res.data?.length || 0];
        })
      );


      setGardenPlantCounts(Object.fromEntries(plantCounts));
      
      setGardenSensorCounts(Object.fromEntries(sensorCounts));
    };

    loadData();
  }, [selectedTeamId]);

  const toggleExpand = async (gardenId: string) => {
    if (expandedGarden === gardenId) {
      setExpandedGarden(null);
      return;
    }

    if (!gardenPlants[gardenId]) {
      const { data } = await getGardenPlants(gardenId);
      setGardenPlants((prev) => ({ ...prev, [gardenId]: data || [] }));
    }

    setExpandedGarden(gardenId);
  };

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
          🌿 My Gardens
        </h1>

        <div className="flex items-center gap-4">
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTeamId && <AddGardenDialog teamId={selectedTeamId} />}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col gap-4 w-full">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="h-24 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-800"
            />
          ))}
        </div>
      ) : gardens.length === 0 ? (
        <div className="text-neutral-500 dark:text-neutral-400 text-center mt-10">
          This team has no gardens yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gardens.map((garden) => {
            const isExpanded = expandedGarden === garden.garden_id;
            const plants = gardenPlants[garden.garden_id] ?? [];

            return (
              <motion.div
                layout
                key={garden.garden_id}
                className={cn(
                  "relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 hover:shadow-md transition"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <IconPlant className="h-6 w-6 text-black dark:text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-800 dark:text-white">
                        {garden.garden_name}
                      </h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {garden.garden_location}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full">
                          🌱 {gardenPlantCounts[garden.garden_id] || 0} plant
                          {gardenPlantCounts[garden.garden_id] === 1 ? "" : "s"}
                        </span>
                        <span className="text-sm bg-gray-600 text-white px-3 py-1 rounded-full">
                          🔧 {gardenSensorCounts[garden.garden_id] || 0} sensor
                          {gardenSensorCounts[garden.garden_id] === 1
                            ? ""
                            : "s"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <AddPlantDialog gardenId={garden.garden_id} />
                    <AddSensorDialog gardenId={garden.garden_id} />
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(garden.garden_id)}
                  className="group flex items-center justify-between mt-6 text-sm text-neutral-700 dark:text-neutral-300 hover:underline w-full"
                >
                  <span>View Details</span>
                  <IconChevronDown
                    className={cn(
                      "h-5 w-5 transform transition-transform duration-200",
                      isExpanded ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key="expand"
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                    >
                      {plants.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic dark:text-neutral-400">
                          No plants found in this garden.
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {plants.map((plant: any) => (
                            <div
                              key={plant.plant_id}
                              className="rounded-lg p-3 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">
                                  {plant.plant_name}
                                </h3>
                                <PlantDetailsDialog plant={plant} />
                              </div>
                              <div>
                                <Image
                                  src={plant.plant_image_url}
                                  alt={plant.plant_name}
                                  width={200}
                                  height={200}
                                  className="rounded-lg w-full mt-2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
};

export default GardenPage;
