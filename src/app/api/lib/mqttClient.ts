import mqtt from 'mqtt';

let client: mqtt.MqttClient | null = null;

export const getMqttClient = () => {
  if (!client) {
    client = mqtt.connect('ws://localhost:9001');
    client.on('connect', () => {
      console.log('📡 MQTT connected (shared)');
    });
  }
  return client;
};
