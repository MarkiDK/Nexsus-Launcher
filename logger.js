// Opret en ny fil: logger.js
class Logger {
  static log(type, message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
    // Gem til fil
  }
}
