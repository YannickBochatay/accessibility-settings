import { toDashCase, getInitialFontSize, getInitialLineHeight } from "./utils.js";

const root = document.documentElement;

const listeners = [];

export const settings = {
  addListener(callback) {
    if (!listeners.includes(callback)) listeners.push(callback);
  },
  removeListener(callback) {
    const index = listeners.indexOf(callback);
    if (index !== -1) listeners.splice(index, 1);
  },
  reset() {
    for (let key in initialValues) {
      if (this[key] !== initialValues[key]) this[key] = initialValues[key];
      root.classList.remove("fontSize", "lineHeight", "contrast");
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

  const bounds = settings.bounds[prop];
  if (value < bounds[0] || value > bounds[1]) {
    throw new RangeError(`${prop} value must be between ${bounds[0]} and ${bounds[1]}`);
  }

  root.classList.add(prop);
  root.style.setProperty(`--access-${toDashCase(prop)}`, String(value) + unit);

  setValue(prop, value);
}

const initialValues = {
  dyslexicFont : false,
  invertedColors : false,
  contrast : 100,
  fontSize : getInitialFontSize(),
  lineHeight : getInitialLineHeight()
};


Object.defineProperties(settings, {
  bounds : {
    value : {
      contrast : [50, 150],
      lineHeight : [0.8, 3],
      fontSize : [6, 40]
    }
  },
  initialValues : { value : initialValues },

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
 
