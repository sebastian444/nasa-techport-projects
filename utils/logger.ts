enum Level {
  info = "log",
  error = "error"
}

export const Logger = class Logger {
  module: string;
  loggerEnabled: boolean;

  constructor(module: string, loggerEnabled: boolean = true) {
    this.module = module;
    this.loggerEnabled = loggerEnabled;
  }

  info(message: string, data?: any) {
    this.#buildLogByLevel(Level.info, message, data);
  }

  error(message: string, data?: any) {
    this.#buildLogByLevel(Level.error, message, data);

    if (this.loggerEnabled) {
      console.trace();
    }
  }

  #buildLogByLevel(level: Level, message: string, data?: any) {
    if (this.loggerEnabled) {
      const args = [this.#buildMessage(message)];

      if (data) {
        args.push(data);
      }

      console[level].apply(null, args);
    }
  }

  #buildMessage(message: string) {
    return this.module + ": " + message;
  }
};
