
const NodeCache = require("node-cache");
const cache = new NodeCache();

// Function to set data in the cache with a specified key and expiration time in seconds
const setCache = (key, data, ttlSeconds) => {
    cache.set(key, data, ttlSeconds);
};

// Function to get data from the cache by key
const getCache = (key) => {
    return cache.get(key);
};

// Function to delete data from the cache by key
const deleteCache = (key) => {
    cache.del(key);
};

module.exports = {
    setCache,
    getCache,
    deleteCache,
};
