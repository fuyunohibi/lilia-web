"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/layout.tsx/page-content";
import { IconSearch } from "@tabler/icons-react";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";

const PlantExplorerPage = () => {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch random plants on initial mount
  useEffect(() => {
    const fetchRandomPlants = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/plant-search?random=true");
        const data = await res.json();
        setPlants((data.data || []).slice(0, 10));
      } catch (error) {
        console.error("Failed to load plants", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPlants();
  }, []);

  // Search effect — debounce
  useEffect(() => {
    const fetchPlants = async (query: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/plant-search?q=${query}`);
        const data = await res.json();
        setPlants((data.data || []).slice(0, 10));
      } catch (error) {
        console.error("Failed to search plants", error);
      } finally {
        setLoading(false);
      }
    };

    const debouncedFetch = debounce((q: string) => {
      if (q.trim()) {
        fetchPlants(q.trim());
      }
    }, 400);

    if (search.trim()) {
      debouncedFetch(search);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [search]);

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="mb-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
            🌿 Explore Plants
          </h1>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search for a plant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-2 pl-10 text-sm bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {loading
          ? [...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl bg-gray-100 dark:bg-neutral-800 animate-pulse"
              />
            ))
          : plants.map((plant, index) => (
              <AnimatePresence key={plant.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all hover:shadow-xl duration-300 cursor-pointer"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        plant.default_image?.medium_url ||
                        "/placeholder-plant.jpg"
                      }
                      alt={plant.common_name}
                      fill
                      className="object-cover rounded-t-2xl"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-neutral-800 dark:text-white truncate">
                      {plant.common_name || "Unnamed Plant"}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                      {plant.scientific_name?.[0] || "Unknown"}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
      </div>
    </PageWrapper>
  );
};

export default PlantExplorerPage;
