import { create } from "zustand";
import { toast } from "sonner";

type ActuatorType = "pump" | "fan";

interface ActuatorState {
  pumpActive: boolean;
  fanActive: boolean;
  toggleActuator: (
    type: ActuatorType,
    state: boolean,
    deviceId: string
  ) => Promise<void>;
  fetchActuatorState: (deviceId: string) => Promise<void>;
}

export const useActuatorStore = create<ActuatorState>((set) => ({
  pumpActive: false,
  fanActive: false,

  toggleActuator: async (type, state, deviceId) => {
    set((prev) => ({
      ...prev,
      [`${type}Active`]: state,
    }));

    try {
      const res = await fetch(`/api/actuator/${type}`, {
        method: "POST",
        body: JSON.stringify({
          command: state ? "on" : "off",
          device_id: deviceId,
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

  fetchActuatorState: async (deviceId) => {
    try {
      const [pumpRes, fanRes] = await Promise.all([
        fetch(`/api/actuator/pump?device_id=${deviceId}`),
        fetch(`/api/actuator/fan?device_id=${deviceId}`),
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
