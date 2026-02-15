import { createState } from "./createState.js";

const root = document.documentElement;

function getInitialFontSize(elmt = root) {
  let fontSize = getComputedStyle(elmt).fontSize;
  let value = Number.parseInt(fontSize);

  if (Number.isNaN(value)) {
    let p = document.createElement("p");
    document.body.appendChild(p);
    value = getInitialFontSize(p);
    p.remove();
  }

  return value;
}

function getInitialLineHeight(elmt = root) {
  let lineHeight = getComputedStyle(elmt).lineHeight;

  if (!isNaN(lineHeight)) return Number(lineHeight);

  let value = Number.parseInt(lineHeight);

  if (Number.isNaN(value)) {
    if (elmt === root) {
      let p = document.createElement("p");
      p.style.margin = 0
      p.style.border = "none"
      p.style.padding = 0
      p.textContent = "toto";
      document.body.appendChild(p);
      value = getInitialLineHeight(p);
      p.remove();
    } else {
      return elmt.getBoundingClientRect().height
    }
  }

  return Math.round(value * 10 / getInitialFontSize()) / 10;
}

const initialPrefs = {
  dyslexicFont : false,
  invertedColors : false,
  contrast : 100,
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
    case "contrast":
      root.classList.add("contrasted");
      root.style.setProperty('--access-contrast', value + "%");
      break;
    case "fontSize":
      root.classList.add("fontSize");
      root.style.setProperty('--access-font-size', value + "px");
      break;
    case "lineHeight":
      root.classList.add("lineHeight");
      root.style.setProperty('--access-line-height', value);
      break;
  }
})

const defaultPrefs = { ...initialPrefs };

export function resetPrefs() {
  for (let key in defaultPrefs) {
    preferences[key] = defaultPrefs[key];
    root.classList.remove("fontSize", "lineHeight", "contrasted");
    localStorage.removeItem(STORAGE_NAME);
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
