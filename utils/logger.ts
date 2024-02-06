enum Level {
  info = "log",
  error = "error",
}

export const Logger = class Logger {
  module: string;
  loggerEnabled: boolean;

  constructor(module: string, loggerEnabled: boolean = true) {
    this.module = module;
    this.loggerEnabled = loggerEnabled;
  }

  info(message, data) {
    this.#buildLogByLevel(Level.info, message, data);
  }

  error(message, data) {
    this.#buildLogByLevel(Level.error, message, data);
  }

  #buildLogByLevel(level: Level, message, data) {
    if (this.loggerEnabled) {
      console[level](this.#buildMessage(message), data);
    }
  }

  #buildMessage(message) {
    return this.module + ": " + message;
  }
};
