import { suite, describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { VueWrapper } from "@vue/test-utils";
import ContactList from "./contactsList.vue";

interface LocalTestContext {
  component: VueWrapper;
}

global.ResizeObserver = require("resize-observer-polyfill");

describe("ContactList", function () {
  suite("Given title and empty contacts", function () {
    beforeEach<LocalTestContext>(async function (context) {
      context.component = await mountSuspended(ContactList, {
        props: { title: "Investigators", contacts: [] }
      });
    });

    it<LocalTestContext>("Renders type of contacts as title", async (context) => {
      const match = context.component.find(".v-list-subheader__text");

      expect(match.text()).toContain("Investigators");
    });

    it<LocalTestContext>("Doesn't render any contact item", async (context) => {
      const match = context.component.findAll(".v-list-item");

      expect(match.length).toBe(0);
    });
  });

  suite("Given title and contacts defined", function () {
    beforeEach<LocalTestContext>(async function (context) {
      context.component = await mountSuspended(ContactList, {
        props: {
          title: "Investigators",
          contacts: [
            {
              fullName: "name 1",
              primaryEmail: "name1@mail.com"
            },
            {
              fullName: "name 2",
              primaryEmail: "name2@mail.com"
            }
          ]
        }
      });
    });

    it<LocalTestContext>("Renders type of contacts as title", async (context) => {
      const match = context.component.find(".v-list-subheader__text");

      expect(match.text()).toContain("Investigators");
    });

    it<LocalTestContext>("Render every contract full name and primary email", async (context) => {
      const matches = context.component.findAll(".v-list-item");

      expect(matches.length).toBe(2);

      matches.forEach((contact, index) => {
        expect(contact.find(".v-list-item-title").text()).toBe(
          `name ${index + 1}`
        );

        expect(contact.find(".v-list-item-subtitle").text()).toBe(
          `name${index + 1}@mail.com`
        );
      });
    });
  });
});
