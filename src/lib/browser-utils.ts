/**
 * Safely access browser APIs by checking if code is running in browser environment
 */

// Check if we're running in a browser environment
export const isBrowser = typeof window !== "undefined"

// Safely access localStorage
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser) {
      return localStorage.getItem(key)
    }
    return null
  },

  setItem: (key: string, value: string): void => {
    if (isBrowser) {
      localStorage.setItem(key, value)
    }
  },

  removeItem: (key: string): void => {
    if (isBrowser) {
      localStorage.removeItem(key)
    }
  },
}

// Safely access sessionStorage
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser) {
      return sessionStorage.getItem(key)
    }
    return null
  },

  setItem: (key: string, value: string): void => {
    if (isBrowser) {
      sessionStorage.setItem(key, value)
    }
  },

  removeItem: (key: string): void => {
    if (isBrowser) {
      sessionStorage.removeItem(key)
    }
  },
}

