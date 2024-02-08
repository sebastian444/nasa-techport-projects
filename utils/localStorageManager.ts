import nuxtStorage from "nuxt-storage";

class LocalStorageManager {
  logger;

  constructor(debug: boolean) {
    this.logger = new Logger("LocalStorage", debug);
  }
  set<T>(key: string, data: T) {
    nuxtStorage.localStorage.setData(key, JSON.stringify(data));
  }

  get<T>(key: string): T | null {
    const data = nuxtStorage.localStorage.getData(key);

    if (data === null) {
      this.logger.info(`key ${key} not found!`);
    }

    try {
      return JSON.parse(data as string);
    } catch (error) {
      this.logger.error(`Could not parse localStorage ${key} value`, error);
    }

    return null;
  }

  clear() {
    nuxtStorage.localStorage.clear();
  }
}

const debugMode = process.env.NODE_ENV !== "production";

export const localStorageManager = new LocalStorageManager(debugMode);
