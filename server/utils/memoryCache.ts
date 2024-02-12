import { CronJob } from "cron";
import { ServerLogger } from "./serverLogger";

export const MemoryCache = class MemoryCache {
  name: string;
  #cache: Map<string, any>;
  logger;

  constructor(name: string) {
    this.name = name;
    this.#cache = new Map();
    this.logger = new ServerLogger(`MemoryCache:${name}`);

    this.logger.info("Starting!");

    this.flushCacheJob();
  }

  has(key: string) {
    return this.#cache.has(key);
  }

  get(key: string): any {
    if (this.has(key)) {
      this.logger.info("cache found for:   ", key);
      return JSON.parse(this.#cache.get(key));
    }

    return null;
  }

  set(key: string, data: any) {
    if (this.has(key)) {
      this.logger.info(
        `key: ${key} already existing, proceeding to overwrite!`
      );
    }

    this.logger.info("setting cache for", key);

    return this.#cache.set(key, JSON.stringify(data));
  }

  flush() {
    this.logger.info("... clearing cache!");
    this.#cache.clear();
  }

  flushCacheJob() {
    this.logger.info("Starting Kronjob to clean cache every day at 03:00");

    const job = CronJob.from({
      cronTime: "0 3 * * *",
      onTick: () => {
        this.flush();
      },
      start: true
    });
  }
};
