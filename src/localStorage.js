import { preferences, onStateChange } from "./preferences.js"

const STORAGE_NAME = "preferences"

export function saveConfig() {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(preferences));
}

export function loadConfig() {
  const storedData = localStorage.getItem(STORAGE_NAME);
  const data = storedData ? JSON.parse(storedData) : null;

  if (data) {
    for (let key in data) {
      if (data[key] !== preferences[key]) preferences[key] = data[key];
    }
  }
}

export function removeConfig() {
  localStorage.removeItem(STORAGE_NAME);
}

onStateChange(saveConfig);
loadConfig();
