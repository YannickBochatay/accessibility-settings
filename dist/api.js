(() => {
  // src/settings/globalStyles.js
  var globalStyles = document.createElement("style");
  globalStyles.id = "access-settings-css-rules";
  globalStyles.innerHTML = /*css*/
  `
  @font-face {
    font-family: open-dyslexic;
    src: url(https://fonts.cdnfonts.com/s/29616/open-dyslexic.woff);
  }
  :root {
    --access-font-family:open-dyslexic, sans-serif;
    --access-line-height:1.5;
    --access-font-size:16px;
    --access-contrast:100%;
  }
  :root.dyslexicFont {
    font-family:var(--access-font-family);
    h1,h2,h3,h4,h5,h6, body, header, footer, main, article, section, aside, p {
      font-family:var(--access-font-family);
    }
    &.important {
      h1,h2,h3,h4,h5,h6, body, header, footer, main, article, section, aside, p {
        font-family:var(--access-font-family) !important;
      }
    }
  }
  :root.lineHeight {
    line-height:var(--access-line-height);
    body, header, footer, main, article, section, aside, p {
      line-height:var(--access-line-height);
    }
    &.important {
      body, header, footer, main, article, section, aside, p {
        line-height:var(--access-line-height) !important;
      }
    }
  }
  :root.fontSize {
    font-size:var(--access-font-size);
    body, header, footer, main, article, section, aside, p {
      font-size:var(--access-font-size);
    }
    &.important {
      body, header, footer, main, article, section, aside, p {
        font-size:var(--access-font-size) !important;
      }
    }
  }
  :root.invertedColors {
    &:not(.contrast) {
      filter:invert(1);
    }
    &.contrast {
      filter:invert(1) contrast(var(--access-contrast));
    }
  }
  :root.contrast {
    &:not(.invertedColors) {
      filter:contrast(var(--access-contrast));
    }
  }
  
  @media (prefers-color-scheme: dark) {
    :root:has(access-settings[invert-colors], access-settings[all]) {
      &:not(.contrast) {
        filter:invert(1);
      }
      &.contrasted {
        filter:invert(1) contrast(var(--access-contrast));
      }
      &.invertedColors {
        &:not(.contrast) {
          filter:invert(0);
        }
        &.contrast {
          filter:invert(0) contrast(var(--access-contrast));
        }
      }
    }
  }
`;
  document.head.append(globalStyles);

  // src/settings/utils.js
  var root = document.documentElement;
  function getInitialFontSize(elmt = root) {
    let fontSize = getComputedStyle(elmt).fontSize;
    return Number.parseInt(fontSize);
  }
  function getInitialLineHeight(elmt = root) {
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
        let lineHeight2 = getInitialLineHeight(p);
        p.remove();
        return lineHeight2;
      } else {
        value = elmt.getBoundingClientRect().height;
      }
    }
    return Math.round(value * 10 / getInitialFontSize()) / 10;
  }
  function toDashCase(str) {
    return str.replaceAll(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  }

  // src/settings/settings.js
  var root2 = document.documentElement;
  var settings = new EventTarget();
  settings.reset = function() {
    for (let key in initialValues) {
      if (this[key] !== initialValues[key]) this[key] = initialValues[key];
      root2.classList.remove("fontSize", "lineHeight", "contrast");
    }
  };
  function setValue(prop, value) {
    settings["_" + prop] = value;
    settings.dispatchEvent(new Event("change"));
    settings.dispatchEvent(new CustomEvent(`change-${prop}`));
  }
  function setBooleanValue(prop, value) {
    if (typeof value !== "boolean") throw new TypeError(`${prop} value must be a boolean`);
    if (value) root2.classList.add(prop);
    else root2.classList.remove(prop);
    setValue(prop, value);
  }
  function setNumberValue(prop, value, unit = "") {
    if (typeof value !== "number") throw new TypeError(`${prop} value must be a number`);
    const bounds = settings.bounds[prop];
    if (value < bounds[0] || value > bounds[1]) {
      throw new RangeError(`${prop} value must be between ${bounds[0]} and ${bounds[1]}`);
    }
    root2.classList.add(prop);
    root2.style.setProperty(`--access-${toDashCase(prop)}`, String(value) + unit);
    setValue(prop, value);
  }
  var initialValues = {
    dyslexicFont: false,
    invertedColors: false,
    contrast: 100,
    fontSize: getInitialFontSize(),
    lineHeight: getInitialLineHeight()
  };
  Object.defineProperties(settings, {
    bounds: {
      value: {
        contrast: [50, 150],
        lineHeight: [0.8, 3],
        fontSize: [6, 40]
      }
    },
    initialValues: { value: initialValues },
    _dyslexicFont: { writable: true, value: initialValues.dyslexicFont },
    _invertedColors: { writable: true, value: initialValues.invertedColors },
    _contrast: { writable: true, value: initialValues.contrast },
    _fontSize: { writable: true, value: initialValues.fontSize },
    _lineHeight: { writable: true, value: initialValues.lineHeight },
    _important: { writable: true, value: false },
    important: {
      get() {
        return this._important;
      },
      set(value) {
        if (typeof value !== "boolean") throw new TypeError("value important must be a boolean");
        this._important = value;
        root2.classList[value ? "add" : "remove"]("important");
      }
    },
    dyslexicFont: {
      enumerable: true,
      get() {
        return this._dyslexicFont;
      },
      set(value) {
        setBooleanValue("dyslexicFont", value);
      }
    },
    invertedColors: {
      enumerable: true,
      get() {
        return this._invertedColors;
      },
      set(value) {
        setBooleanValue("invertedColors", value);
      }
    },
    contrast: {
      enumerable: true,
      get() {
        return this._contrast;
      },
      set(value) {
        setNumberValue("contrast", value, "%");
      }
    },
    lineHeight: {
      enumerable: true,
      get() {
        return this._lineHeight;
      },
      set(value) {
        setNumberValue("lineHeight", value);
      }
    },
    fontSize: {
      enumerable: true,
      get() {
        return this._fontSize;
      },
      set(value) {
        setNumberValue("fontSize", value, "px");
      }
    }
  });

  // src/settings/localStorage.js
  var STORAGE_NAME = "access-settings";
  Object.defineProperties(settings, {
    save: {
      value: function saveConfig() {
        localStorage.setItem(STORAGE_NAME, JSON.stringify(settings));
      }
    },
    load: {
      value: function loadConfig() {
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
    remove: {
      value: function removeConfig() {
        localStorage.removeItem(STORAGE_NAME);
      }
    }
  });
})();
