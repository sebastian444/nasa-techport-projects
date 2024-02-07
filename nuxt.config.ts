import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    "/api/**": { proxy: { to: "https://techport.nasa.gov/api/**" } },
  },
  devServer: {
    port: 3000,
  },
  runtimeConfig: {
    public: {
      techportToken: process.env.TECHPORT_TOKEN,
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@nuxt/test-utils/module",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({}));
      });
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
