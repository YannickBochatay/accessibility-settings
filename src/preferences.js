import { createState } from "./createState.js";

const root = document.documentElement;

function getInitialFontSize() {
  let fontSize = getComputedStyle(root).fontSize;
  return Number.parseInt(fontSize);
}

function getInitialLineHeight() {
  let lineHeight = getComputedStyle(root).lineHeight;
  return Number.parseInt(lineHeight) / getInitialFontSize();
}

const initialPrefs = {
  dyslexicFont : false,
  invertedColors : false,
  contraste : 100,
  fontSize : getInitialFontSize(),
  lineHeight : getInitialLineHeight()
};

export const { state : preferences, onStateChange, offStateChange } = createState(initialPrefs);

onStateChange((prop, value) => {
  switch (prop) {
    case "dyslexicFont":
      if (value) root.classList.add("dyslexic");
      else root.classList.remove("dyslexic");
      break;
    case "invertedColors":
      if (value) root.classList.add("invertedColors");
      else root.classList.remove("invertedColors");
      break;
    case "fontSize":
      root.style.fontSize = value + "px";
      break;
    case "lineHeight":
      root.style.lineHeight = value;
      break;
  }
})

const defaultPrefs = { ...initialPrefs };

export function resetPrefs() {
  for (let key in defaultPrefs) {
    preferences[key] = defaultPrefs[key];
  }
}

const STORAGE_NAME = "preferences"

onStateChange(() => {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(preferences));
})

const storedData = localStorage.getItem(STORAGE_NAME);

if (storedData) {
  const data = JSON.parse(storedData);

  for (let key in data) {
    preferences[key] = data[key];
  }
}
