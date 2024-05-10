import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    exclude: [
      "cypress/**",
      "node_modules/**",
      "playwright/**",
      "tests-examples/**",
    ],
    reporters: ["verbose", "html", "json", "junit"],
    outputFile: {
      html: "reports/test-results/html",
      json: "reports/test-results.json",
      junit: "reports/test-results.xml",
    },
    setupFiles: ["./vitest.setup.js"]
  },
});

