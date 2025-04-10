"use client";
import { useEffect, useState } from "react";
import { useNotificationStore } from "@/stores/notification-store";

const useAlertWebSocket = (gardenId: string) => {
  const addAlert = useNotificationStore((s) => s.addAlert);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (!gardenId) return;

    const fetchDeviceId = async () => {
      try {
        const res = await fetch("/api/alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ garden_id: gardenId }),
        });
        const json = await res.json();
        setDeviceId(json.device_id);
      } catch (err) {
        console.error("❌ Failed to fetch device_id from garden_id:", err);
      }
    };

    fetchDeviceId();
  }, [gardenId]);

  useEffect(() => {
    if (!deviceId) return;

    // Step 2: Connect to WebSocket using deviceId
    const ws = new WebSocket("ws://100.65.162.25:8080");

    ws.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data);
        console.log("📥 WS Received:", alert);
        if (alert.device_id === deviceId) {
          addAlert({ ...alert, timestamp: new Date().toISOString() });
        }
      } catch (err) {
        console.error("❌ Failed to parse alert:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => ws.close();
  }, [deviceId]);
};

export default useAlertWebSocket;
