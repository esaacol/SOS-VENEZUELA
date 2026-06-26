import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "org.sosvenezuela.app",
  appName: "SOS Venezuela",
  webDir: "public",
  server: {
    url: "http://191.252.110.69:3010",
    cleartext: true
  },
  android: {
    backgroundColor: "#070707"
  }
};

export default config;
