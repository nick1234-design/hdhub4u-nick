
const fs = require("fs").promises;
const path = require("path");

class RedisCache {
  constructor(namespace = "default") {
    this.namespace = namespace;
    this.memory = new Map();
  }

  async getFromCache(key, suffix = "", cacheDir) {
    const cacheKey = `${this.namespace}:${key}:${suffix}`;
    const cached = this.memory.get(cacheKey);

    if (cached) {
      return cached;
    }

    if (!cacheDir) return null;

    try {
      const fileName = Buffer.from(cacheKey).toString("hex") + ".json";
      const filePath = path.join(cacheDir, fileName);
      const content = await fs.readFile(filePath, "utf8");
      const data = JSON.parse(content);

      this.memory.set(cacheKey, data);
      return data;
    } catch {
      return null;
    }
  }

  async saveToCache(key, data, suffix = "", cacheDir) {
    const cacheKey = `${this.namespace}:${key}:${suffix}`;
    this.memory.set(cacheKey, data);

    if (!cacheDir) return true;

    try {
      await fs.mkdir(cacheDir, { recursive: true });
      const fileName = Buffer.from(cacheKey).toString("hex") + ".json";
      const filePath = path.join(cacheDir, fileName);

      await fs.writeFile(
        filePath,
        JSON.stringify(data),
        "utf8"
      );
    } catch (error) {
      console.error("Cache save error:", error.message);
    }

    return true;
  }
}

module.exports = RedisCache;
