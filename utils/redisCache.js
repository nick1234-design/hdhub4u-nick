const cache = new Map();

async function get(key) {
  const item = cache.get(key);
  if (!item || item.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

async function set(key, value, ttlSeconds = 3600) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
  return true;
}

async function del(key) {
  cache.delete(key);
  return true;
}

module.exports = { get, set, del };