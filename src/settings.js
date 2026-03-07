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

export class Settings {

  static bounds = {
    contrast : [50, 150],
    lineHeight : [0.8, 3],
    fontSize : [6, 40]
  }

  static initialValues = {
    dyslexicFont : false,
    invertedColors : false,
    contrast : 100,
    fontSize : getInitialFontSize(),
    lineHeight : getInitialLineHeight()
  }

  #listeners = []

  constructor() {
    const { initialValues } = this.constructor;

    Object.defineProperties(this, {
      _dyslexicFont : { writable : true, value : initialValues.dyslexicFont },
      _invertedColors : { writable : true, value : initialValues.invertedColors },
      _contrast : { writable : true, value : initialValues.contrast },
      _fontSize : { writable : true, value : initialValues.fontSize },
      _lineHeight : { writable : true, value : initialValues.lineHeight },

      dyslexicFont : {
        enumerable:true,
        get : () => this._dyslexicFont,
        set : value => this.#setBooleanValue("dyslexicFont", value)
      },
      invertedColors : {
        enumerable:true,
        get : () => this._invertedColors,
        set : value => this.#setBooleanValue("invertedColors", value)
      },
      contrast : {
        enumerable:true,
        get : () => this._contrast,
        set : value => this.#setNumberValue("contrast", value, "%")
      },
      lineHeight : {
        enumerable:true,
        get : () => this._lineHeight,
        set : value => this.#setNumberValue("lineHeight", value)
      },
      fontSize : {
        enumerable:true,
        get : () => this._fontSize,
        set : value => this.#setNumberValue("fontSize", value, "px")
      }
    })
  }

  addListener(callback) {
    this.#listeners.push(callback);
  }
  
  removeListener(callback) {
    const index = this.#listeners.indexOf(callback);
    if (index !== -1) this.#listeners.splice(index, 1);
  }

  reset() {
    const { initialValues } = this.constructor;
    for (let key in initialValues) {
      if (this[key] !== initialValues[key]) this[key] = initialValues[key];
      root.classList.remove("fontSize", "lineHeight", "contrasted");
    }
  }

  #setValue(prop, value) {
    this["_"+prop] = value;
    this.#listeners.forEach(listener => listener(prop, value));
  }

  #setBooleanValue(prop, value) {
    if (typeof value !== "boolean") throw new TypeError(`${prop} value must be a boolean`);
    
    if (value) root.classList.add(prop);
    else root.classList.remove(prop);

    this.#setValue(prop, value);
  }

  #setNumberValue(prop, value, unit="") {
    if (typeof value !== "number") throw new TypeError(`${prop} value must be a number`);

    const bounds = this.constructor.bounds[prop];
    if (value < bounds[0] || value > bounds[1]) {
      throw new RangeError(`${prop} value must be between ${bounds[0]} and ${bounds[1]}`);
    }

    root.classList.add(prop);
    root.style.setProperty(`--access-${toDashCase(prop)}`, String(value) + unit);

    this.#setValue(prop, value);
  }
}

export const settings = new Settings();