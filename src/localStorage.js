import { settings } from "./settings.js"

const STORAGE_NAME = "access-settings"

export function saveConfig() {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(settings));
}

export function loadConfig() {
  const storedData = localStorage.getItem(STORAGE_NAME);
  const data = storedData ? JSON.parse(storedData) : null;

  if (data) {
    for (let key in data) {
      if (data[key] !== settings[key]) settings[key] = data[key];
    }
  }

  return data;
}

export function removeConfig() {
  localStorage.removeItem(STORAGE_NAME);
}

settings.addListener(saveConfig);
loadConfig();
