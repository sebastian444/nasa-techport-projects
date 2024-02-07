import { defineVitestConfig } from "@nuxt/test-utils/config";
import { configDefaults } from "vitest/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    globals: true,
    exclude: [...configDefaults.exclude, "**/*.d.ts"],
    server: {
      deps: {
        inline: ["vuetify"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "**/*.config.ts",
        "**/*.d.ts",
        "**/.nuxt/**",
        "**/composables/**",
        "**/plugins/**",
      ],
    },
  },
});
