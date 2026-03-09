import { settings } from "./settings.js"
export { settings } from "./settings.js";

const STORAGE_NAME = "access-settings"

Object.defineProperties(settings, {
  save : {
    value : function saveConfig() {
      localStorage.setItem(STORAGE_NAME, JSON.stringify(settings));
    }
  },
  load : {
    value : function loadConfig() {
      const storedData = localStorage.getItem(STORAGE_NAME);
      const data = storedData ? JSON.parse(storedData) : null;

      if (data) {
        for (let key in data) {
          if (data[key] !== settings[key]) settings[key] = data[key];
        }
      }

      return data;
    }
  },
  remove : {
    value : function removeConfig() {
      localStorage.removeItem(STORAGE_NAME);
    }
  }
});
