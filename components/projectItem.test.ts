import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ProjectItem from "./projectItem.vue";

describe("ProjectItem", () => {
  it("renders properly", async () => {
    const wrapper = await mountSuspended(ProjectItem, {
      props: { lastUpdated: "2024-2-6" }
    });
    expect(wrapper.text()).toContain("2024-2-6");
  });
});
