import { vi, suite, describe, it, expect, beforeEach, afterEach } from "vitest";
import { MemoryCache } from "./memoryCache";
import { ServerLogger } from "./serverLogger";

describe("MemoryCache", () => {
  beforeEach(() => {
    vi.spyOn(ServerLogger.prototype, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Should have name module defined", () => {
    expect(new MemoryCache("testCacheModule").name).toBe("testCacheModule");
  });

  suite(".has()", () => {
    it("Return false if there is no cache of key given", () => {
      expect(new MemoryCache("test").has("foo")).toBeFalsy();
    });

    it("Return true if there is cache found for key given", () => {
      const cacheModule = new MemoryCache("test");

      cacheModule.set("foo", 1234);

      expect(cacheModule.has("foo")).toBeTruthy();
    });
  });

  suite(".get()", () => {
    it("Return null if no cache found for ket", () => {
      expect(new MemoryCache("test").get("foo")).toBeNull();
    });

    it("Return cache value parsed if found", () => {
      const cacheModule = new MemoryCache("test");

      cacheModule.set("foo", { a: 123 });

      expect(cacheModule.get("foo")).to.eql({ a: 123 });
    });
  });

  suite(".set()", () => {
    it("Cache can be found after set", () => {
      const cacheModule = new MemoryCache("test");

      cacheModule.set("foo", 12345);

      expect(cacheModule.get("foo")).toBe(12345);
    });

    it("Log to user if cache for given key is already set", () => {
      const cacheModule = new MemoryCache("test");

      cacheModule.set("foo", 123);
      cacheModule.set("foo", 456);

      expect(ServerLogger.prototype.info).toHaveBeenNthCalledWith(
        3,
        "key: foo already existing, proceeding to overwrite!"
      );
    });
  });

  suite(".flush()", () => {
    it("remove all cache previously set", () => {
      const cacheModule = new MemoryCache("test");

      cacheModule.set("foo", 123);
      cacheModule.set("bar", 456);

      expect(cacheModule.has("foo")).toBeTruthy();
      expect(cacheModule.has("bar")).toBeTruthy();

      cacheModule.flush();

      expect(cacheModule.has("foo")).toBeFalsy();
      expect(cacheModule.has("bar")).toBeFalsy();
    });
  });
});
