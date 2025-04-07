import { create } from "zustand";
import { toast } from "sonner";

type ActuatorType = "pump" | "fan";

interface ActuatorState {
  pumpActive: boolean;
  fanActive: boolean;
  toggleActuator: (
    type: ActuatorType,
    state: boolean,
    gardenId: string
  ) => Promise<void>;
  fetchActuatorState: (gardenId: string) => Promise<void>;
}

export const useActuatorStore = create<ActuatorState>((set) => ({
  pumpActive: false,
  fanActive: false,

  toggleActuator: async (type, state, gardenId) => {
    set((prev) => ({
      ...prev,
      [`${type}Active`]: state,
    }));

    try {
      const res = await fetch(`/api/actuator/${type}`, {
        method: "POST",
        body: JSON.stringify({
          command: state ? "on" : "off",
          garden_id: gardenId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Request failed");

      toast.success(
        `${type === "pump" ? "💧 Water" : "🌬️ Fan"} actuator ${
          state ? "activated" : "deactivated"
        }.`
      );
    } catch (err) {
      console.error(`❌ Failed to toggle ${type}:`, err);
      toast.error(`❌ Failed to toggle ${type}.`);
    }
  },

  fetchActuatorState: async (gardenId) => {
    try {
      // ✅ Resolve device_id first
      const deviceRes = await fetch(`/api/device?garden_id=${gardenId}`);
      const { device_id } = await deviceRes.json();

      if (!device_id) throw new Error("Device ID not found");

      // ✅ Then fetch state using the correct device_id
      const [pumpRes, fanRes] = await Promise.all([
        fetch(`/api/actuator/pump?device_id=${device_id}`),
        fetch(`/api/actuator/fan?device_id=${device_id}`),
      ]);

      const pumpData = await pumpRes.json();
      const fanData = await fanRes.json();

      set({
        pumpActive: pumpData?.state === "on",
        fanActive: fanData?.state === "on",
      });

      toast("🔄 Actuator states synced");
    } catch (err) {
      console.error("❌ Failed to fetch actuator state:", err);
      toast.error("Failed to fetch actuator state.");
    }
  },
}));
