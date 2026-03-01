import { createState } from "./createState.js";

const root = document.documentElement;

export function getInitialFontSize(elmt = root) {
  let fontSize = getComputedStyle(elmt).fontSize;
  return Number.parseInt(fontSize);
}

export function getInitialLineHeight(elmt = root) {
  let lineHeight = getComputedStyle(elmt).lineHeight;

  if (!isNaN(lineHeight)) return Number(lineHeight);

  let value = Number.parseInt(lineHeight);

  if (Number.isNaN(value)) {
    if (elmt === root) {
      let p = document.createElement("p");
      p.style.margin = 0;
      p.style.border = "none";
      p.style.padding = 0;
      p.textContent = "toto";
      document.body.appendChild(p);
      let lineHeight = getInitialLineHeight(p);
      p.remove();
      return lineHeight;
    } else {
      value = elmt.getBoundingClientRect().height;
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
  }
}
