// Mock Firebase implementation using localStorage for offline testing
// This simulates Firebase Realtime Database functionality for single-session testing

class MockDatabase {
  constructor() {
    this.data = {}
    this.listeners = new Map()
    this.loadFromStorage()
  }

  loadFromStorage() {
    const stored = localStorage.getItem('gumball-run-mock-db')
    if (stored) {
      this.data = JSON.parse(stored)
    }
  }

  saveToStorage() {
    localStorage.setItem('gumball-run-mock-db', JSON.stringify(this.data))
  }

  // Simulate Firebase ref() function
  ref(path) {
    return {
      path,
      toString: () => path
    }
  }

  // Simulate Firebase set() function
  async set(ref, data) {
    const pathParts = ref.path.split('/').filter(part => part !== '')
    let current = this.data
    
    // Navigate to the parent of the target
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {}
      }
      current = current[pathParts[i]]
    }
    
    // Set the data
    const key = pathParts[pathParts.length - 1]
    current[key] = data
    
    this.saveToStorage()
    this.notifyListeners(ref.path, data)
    
    return Promise.resolve()
  }

  // Simulate Firebase get() function
  async get(ref) {
    const pathParts = ref.path.split('/').filter(part => part !== '')
    let current = this.data
    
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        current = null
        break
      }
    }
    
    return {
      val: () => current
    }
  }

  // Simulate Firebase push() function
  async push(ref, data) {
    const pathParts = ref.path.split('/').filter(part => part !== '')
    let current = this.data
    
    // Navigate to the target
    for (const part of pathParts) {
      if (!current[part]) {
        current[part] = {}
      }
      current = current[part]
    }
    
    // Generate a unique key
    const key = Date.now().toString() + '_' + Math.random().toString(36).substring(2, 8)
    current[key] = data
    
    this.saveToStorage()
    this.notifyListeners(ref.path, current)
    
    return {
      key,
      toString: () => `${ref.path}/${key}`
    }
  }

  // Simulate Firebase onValue() function
  onValue(ref, callback) {
    const path = ref.path
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set())
    }
    
    this.listeners.get(path).add(callback)
    
    // Immediately call with current data
    this.get(ref).then(snapshot => {
      callback(snapshot)
    })
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(path)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          this.listeners.delete(path)
        }
      }
    }
  }

  // Simulate Firebase off() function
  off(ref, callback) {
    const path = ref.path
    const listeners = this.listeners.get(path)
    if (listeners && callback) {
      listeners.delete(callback)
    }
  }

  // Notify all listeners for a path
  notifyListeners(path, data) {
    const listeners = this.listeners.get(path)
    if (listeners) {
      listeners.forEach(callback => {
        // Get the full data at this path
        this.get({ path }).then(snapshot => {
          callback(snapshot)
        })
      })
    }
  }

  // Simulate serverTimestamp
  serverTimestamp() {
    return Date.now()
  }
}

// Create singleton instance
const mockDatabase = new MockDatabase()

// Export mock functions that match Firebase API
export const ref = (path) => mockDatabase.ref(path)
export const set = (ref, data) => mockDatabase.set(ref, data)
export const get = (ref) => mockDatabase.get(ref)
export const push = (ref, data) => mockDatabase.push(ref, data)
export const onValue = (ref, callback) => mockDatabase.onValue(ref, callback)
export const off = (ref, callback) => mockDatabase.off(ref, callback)
export const serverTimestamp = () => mockDatabase.serverTimestamp()

// Export the database instance for debugging
export const database = mockDatabase
