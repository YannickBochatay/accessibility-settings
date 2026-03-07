import "./globalStyles.js";

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

export function toDashCase(str) {
  return str.replaceAll(/[A-Z]/g, m => '-' + m.toLowerCase());
}

export const bounds = {
  contrast : [50, 150],
  lineHeight : [0.8, 3],
  fontSize : [6, 40]
}

const initialValues = {
  dyslexicFont : false,
  invertedColors : false,
  contrast : 100,
  fontSize : getInitialFontSize(),
  lineHeight : getInitialLineHeight()
}

const listeners = [];

export const settings = {
  addListener(callback) {
    listeners.push(callback);
  },
  removeListener(callback) {
    const index = listeners.indexOf(callback);
    if (index !== -1) listeners.splice(index, 1);
  },
  reset() {
    for (let key in initialValues) {
      if (this[key] !== initialValues[key]) this[key] = initialValues[key];
      root.classList.remove("fontSize", "lineHeight", "contrasted");
    }
  }
};

function setValue(prop, value) {
  settings["_"+prop] = value;
  listeners.forEach(listener => listener(prop, value));
}

function setBooleanValue(prop, value) {
  if (typeof value !== "boolean") throw new TypeError(`${prop} value must be a boolean`);
  
  if (value) root.classList.add(prop);
  else root.classList.remove(prop);

  setValue(prop, value);
}

function setNumberValue(prop, value, unit="") {
  if (typeof value !== "number") throw new TypeError(`${prop} value must be a number`);

  const propBounds = bounds[prop];
  if (value < propBounds[0] || value > propBounds[1]) {
    throw new RangeError(`${prop} value must be between ${propBounds[0]} and ${propBounds[1]}`);
  }

  root.classList.add(prop);
  root.style.setProperty(`--access-${toDashCase(prop)}`, String(value) + unit);

  setValue(prop, value);
}

Object.defineProperties(settings, {
  _dyslexicFont : { writable : true, value : initialValues.dyslexicFont },
  _invertedColors : { writable : true, value : initialValues.invertedColors },
  _contrast : { writable : true, value : initialValues.contrast },
  _fontSize : { writable : true, value : initialValues.fontSize },
  _lineHeight : { writable : true, value : initialValues.lineHeight },

  dyslexicFont : {
    enumerable:true,
    get() { return this._dyslexicFont },
    set(value) { setBooleanValue("dyslexicFont", value); }
  },
  invertedColors : {
    enumerable:true,
    get() { return this._invertedColors },
    set(value) { setBooleanValue("invertedColors", value); }
  },
  contrast : {
    enumerable:true,
    get() { return this._contrast },
    set(value) { setNumberValue("contrast", value, "%"); }
  },
  lineHeight : {
    enumerable:true,
    get() { return this._lineHeight },
    set(value) { setNumberValue("lineHeight", value); }
  },
  fontSize : {
    enumerable:true,
    get() { return this._fontSize },
    set(value) { setNumberValue("fontSize", value, "px"); }
  }
});
 
