enum Level {
  info = "log",
  error = "error",
}

export const ServerLogger = class ServerLogger {
  module: string;
  loggerEnabled: boolean;

  constructor(module: string, loggerEnabled: boolean = true) {
    this.module = module;
    this.loggerEnabled = loggerEnabled;
  }

  info(message: string, data: any) {
    this.#buildLogByLevel(Level.info, message, data);
  }

  error(message: string, data: any) {
    this.#buildLogByLevel(Level.error, message, data);

    if (this.loggerEnabled) {
      console.trace();
    }
  }

  #buildLogByLevel(level: Level, message: string, data: any) {
    if (this.loggerEnabled) {
      console[level](this.#buildMessage(message), data);
    }
  }

  #buildMessage(message: string) {
    return this.module + ": " + message;
  }
};
