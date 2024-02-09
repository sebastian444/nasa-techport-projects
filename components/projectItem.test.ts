import { suite, describe, it, expect, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { VueWrapper } from "@vue/test-utils";
import ProjectItem from "./projectItem.vue";
import { afterEach } from "node:test";
import { vi } from "vitest";
import { RouterLink } from "vue-router";

interface LocalTestContext {
  component: VueWrapper;
}

global.ResizeObserver = require("resize-observer-polyfill");

const { useProjectsDetailsMock } = vi.hoisted(() => {
  return {
    useProjectsDetailsMock: vi.fn().mockImplementation(() => {
      return { value: [] };
    })
  };
});

mockNuxtImport("useProjectsDetails", () => {
  return useProjectsDetailsMock;
});

describe("ProjectItem", () => {
  suite("Given not match in projectDetails for given projectId", function () {
    beforeEach<LocalTestContext>(async function (context) {
      context.component = await mountSuspended(ProjectItem, {
        props: { lastUpdated: "2024-2-6", projectId: 1234 }
      });
    });

    afterEach(function () {
      clearNuxtState();
    });

    it<LocalTestContext>("Renders type of contact", async (context) => {
      const match = context.component.find(".v-card-subtitle");

      expect(match.text()).toContain("2024-2-6");
    });

    it<LocalTestContext>("Should not render website button", async (context) => {
      const match = context.component.find(".v-card-actions");

      // console.log("----------------> HTML", context.component.html());
      // console.log("----------------> MATCH", match);
      expect(match.exists()).toBe(false);
    });

    it<LocalTestContext>("Should render loader", async (context) => {
      const match = context.component.find(".v-skeleton-loader");
      expect(match.exists()).toBe(true);
    });
  });

  suite("Given not match in projectDetails for given projectId", function () {
    beforeEach<LocalTestContext>(async function (context) {
      useProjectsDetailsMock.mockImplementation(() => {
        return { value: [{ projectId: 1234, title: "mock title" }] };
      });

      context.component = await mountSuspended(ProjectItem, {
        props: { lastUpdated: "2024-2-6", projectId: 1234 },
        global: {
          components: {
            RouterLink
          }
        }
      });
    });

    afterEach(function () {
      clearNuxtState();
    });

    it<LocalTestContext>("Renders type of contact", async (context) => {
      const match = context.component.find(".v-card-subtitle");

      expect(match.text()).toContain("2024-2-6");
    });

    it<LocalTestContext>("Renders title", async (context) => {
      const match = context.component.find(".v-card-title");

      expect(match.text()).toContain("mock title");
    });

    it<LocalTestContext>("Should render website button", async (context) => {
      const match = context.component.find(".v-card-actions .v-btn");

      expect(match.exists()).toBe(true);
      expect(match.attributes("href")).toBe("/details/1234");
    });

    it<LocalTestContext>("Should not render loader", async (context) => {
      const match = context.component.find(".v-skeleton-loader");
      expect(match.exists()).toBe(false);
    });
  });
});
