class LocalCache {
  constructor(limit = 100) {
    this.store = new Map();
    this.limit = limit; // Max items allowed in RAM
  }

  get(key) {
    if (!this.store.has(key)) return null;

    // "Refresh" the item: delete and re-insert to move it to the "newest" position
    const value = this.store.get(key);
    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }

  set(key, value) {
    // Eviction Policy: If cache is full, delete the "Oldest" (first) item
    if (this.store.size >= this.limit) {
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
    }
    this.store.set(key, value);
  }
}

export const urlCache = new LocalCache(500);