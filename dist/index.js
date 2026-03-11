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
    const bounds2 = settings.bounds[prop];
    if (value < bounds2[0] || value > bounds2[1]) {
      throw new RangeError(`${prop} value must be between ${bounds2[0]} and ${bounds2[1]}`);
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

  // src/component/style.js
  var style = (
    /*css*/
    `
  :host {
    font-size:18px;
    line-height:1.5;
    position:fixed;
    top:40%;
    right:5px;
    left:unset;
  }
  :host([side="left"]) {
    right:unset;
    left:5px;
    details {
      align-items: flex-start;
    }
  }
  :host([all]), :host([dyslexic-font]) {
    form .field[part=dyslexic-font] {
      display:block;
    }
  }
  :host([all]), :host([invert-colors]) {
    form .field[part=invert-colors] {
      display:block;
    }
  }
  :host([all]), :host([contrast]) {
    form .field[part=contrast] {
      display:block;
    }
  }
  :host([all]), :host([font-size]) {
    form .field[part=font-size] {
      display:block;
    }
  }
  :host([all]), :host([line-height]) {
    form .field[part=line-height] {
      display:block;
    }
  }
  :host([rounded]) ::slotted([slot=icon]), :host([rounded]) #default-icon {
    border-radius:50%;
  }

  details {
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    
    summary {
      cursor:pointer;
      display:flex;
      align-items:center;
      
      #default-icon {
        border:1px solid #ccc;
        background-color:#ddd;
        border-radius:5px;
        width:40px;
        height:40px;
        &:hover {
          background-color:#e1e1e1;
        }
      }
      ::slotted([slot=icon]) {
        border:1px solid #ccc;
        background-color:#ddd;
        border-radius:5px;
        padding:0 8px;
        font-size:30px;
      }
    }

    form {
      font-size:1em;
      border:1px solid #ccc;
      color:#222;
      background-color:#fafafa;
      line-height:2.5;
      text-align: left;
      border-radius:5px;

      .field, ::slotted([slot=option])  {
        padding: 0 25px 0 15px;
        display:block;
        &:hover {
          background-color:#eee;
        }
      }

      .field {
        display:none;
      }

      input {
        font-size:1em;
        font-family:unset;
      }

      input[type=number] {
        width:5ch;
        border:1px solid #ccc;
        border-radius:5px;
        padding:3px;
      }

      [part=buttons] {
        text-align:center;
        margin:0 15px;
      }
    }
  }
`
  );

  // src/component/template.js
  var { bounds } = settings;
  var template = document.createElement("template");
  template.innerHTML = `
  <style>${style}</style>
  <details part="details">
    <summary part="summary" aria-label="accessibility settings">
      <slot name="icon">
        <svg viewBox="0 0 389.9 389.6" part="icon" id="default-icon">
          <circle fill="none" cx="250.6" cy="146.4" r="35.7" transform="matrix(.160226 -.98708 .98708 .160226 6.75 311.71)"></circle>
          <path d="M191.4 130.7c-23.693 0-42.9-19.207-42.9-42.9s19.207-42.9 42.9-42.9 42.9 19.207 42.9 42.9a42.89 42.89 0 0 1-42.9 
            42.9zm0-71.5c-13.69-.038-25.498 9.605-28.197 23.026a28.68 28.68 0 0 0 17.105 32.135c12.641 5.256 27.234.846 34.848-10.531A28.68 
            28.68 0 0 0 211.6 67.6a29.06 29.06 0 0 0-20.2-8.4zm52.5 278.6a21.46 21.46 0 0 1-19.5-12.6l-33.1-80.3-32.7 80.1a21.41 21.41 0 0 
            1-37.1 4.1 21.57 21.57 0 0 1-2.1-21.5l34.4-87.5a26.63 26.63 0 0 0 1.9-10.4v-16.4a7.09 7.09 0 0 0-6.5-7.1l-60.6-5.5c-11.791
            -.911-20.611-11.209-19.7-23s11.209-20.611 23-19.7l75.1 6.7a97.18 97.18 0 0 0 7.7.3h33.4a99.08 99.08 0 0 0 7.7-.3l75-6.7h.1c11.791
            -.911 22.089 7.909 23 19.7s-7.909 22.089-19.7 23l-60.5 5.5a7.09 7.09 0 0 0-6.5 7.1v16.4a28.29 28.29 0 0 0 2 10.4l34.5 87.9a21.36
            21.36 0 0 1-1.8 20.2 22.06 22.06 0 0 1-18 9.6zm-52.5-107.1a14.11 14.11 0 0 1 13.1 8.8l33 80.1a7.62 7.62 0 0 0 3.9 3.6 7.13 7.13 
            0 0 0 9-9.6l-34.6-88.3a42.14 42.14 0 0 1-3-15.7v-16.4c-.054-11.101 8.438-20.376 19.5-21.3l60.6-5.5a7 7 0 0 0 4.9-2.4 6.61 6.61 
            0 0 0 1.7-5.2 7 7 0 0 0-7.6-6.6l-74.9 6.7a88.33 88.33 0 0 1-8.9.4h-33.4a87 87 0 0 1-8.9-.4l-75-6.7a7.12 7.12 0 0 0-1 14.2l60.7
              5.5c11.062.924 19.554 10.199 19.5 21.3v16.4a42.14 42.14 0 0 1-3 15.7l-34.5 87.9a7.09 7.09 0 0 0 .3 7.3 7.19 7.19 0 0 0 6.6 3.2 
              7 7 0 0 0 5.9-4.3l32.9-79.9a14 14 0 0 1 13.2-8.8z">
          </path>
        </svg>
      </slot>
    </summary>
    <form part="form">
      <div class="field" part="dyslexic-font">
        <input type="checkbox" id="dyslexic-font" part="dyslexic-font-input">
        <label for="dyslexic-font" part="dyslexic-font-label">Police dyslexie</label>
      </div>
      <div class="field" part="invert-colors">
        <input type="checkbox" id="inverted-colors" part="invert-colors-input">
        <label for="inverted-colors" part="invert-colors-label">Couleurs invers\xE9es</label>
      </div>
      <div class="field" part="contrast">
        <input type="number" step="10" id="contrast" min="${bounds.contrast[0]}" max="${bounds.contrast[1]}" part="contrast-input">
        <label for="contrast" part="contrast-label">Contraste</label>
      </div>
      <div class="field" part="font-size">
        <input type="number" id="font-size" part="font-size-input" min="${bounds.fontSize[0]}" max="${bounds.fontSize[1]}">
        <label for="font-size" part="font-size-label">Taille de police</label>
      </div>
      <div class="field" part="line-height">
        <input type="number" id="line-height" step="0.1" part="line-height-input" min="${bounds.lineHeight[0]}" max="${bounds.lineHeight[1]}">
        <label for="line-height" part="line-height-label">Interligne</label>
      </div>
      <slot name="option"></slot>
      <div part="buttons"> 
        <input type="button" id="reset" value="R\xE9initialiser" part="reset-button"/>
        <input type="button" id="close" value="Terminer" part="close-button"/>
      </div>
    </form>
  </details>
`;

  // src/component/languages.json
  var languages_default = {
    fr: {
      "dyslexic-font": "Police dyslexie",
      "inverted-colors": "Couleurs invers\xE9es",
      contrast: "Contraste",
      "font-size": "Taille de police",
      "line-height": "Hauteur de ligne",
      reset: "R\xE9initialiser",
      close: "Terminer"
    },
    en: {
      "dyslexic-font": "Dyslexic font",
      "inverted-colors": "Inverted colors",
      contrast: "Contrast",
      "font-size": "Font size",
      "line-height": "Line height",
      reset: "Reset",
      close: "Close"
    },
    es: {
      "dyslexic-font": "Fuente disl\xE9xica",
      "inverted-colors": "Colores invertidos",
      contrast: "Contraste",
      "font-size": "Tama\xF1o de fuente",
      "line-height": "Altura de l\xEDnea",
      reset: "Restablecer",
      close: "Cerrar"
    }
  };

  // src/component/index.js
  var AccessSettings = class extends HTMLElement {
    static languages = new Proxy(languages_default, {
      set(target, prop, value) {
        target[prop] = value;
        for (const component of document.querySelectorAll("access-settings")) {
          component.handleLangChange();
        }
        return true;
      }
    });
    static observedAttributes = ["lang", "important"];
    #fontField;
    #colorsField;
    #contrastField;
    #fontSizeField;
    #lineHeightField;
    #observer;
    constructor() {
      super();
      const root3 = this.attachShadow({ mode: "open" });
      root3.append(template.content.cloneNode(true));
      this.#fontField = root3.querySelector("#dyslexic-font");
      this.#colorsField = root3.querySelector("#inverted-colors");
      this.#contrastField = root3.querySelector("#contrast");
      this.#fontSizeField = root3.querySelector("#font-size");
      this.#lineHeightField = root3.querySelector("#line-height");
      this.#fontField.addEventListener("change", (e) => settings.dyslexicFont = e.target.checked);
      this.#colorsField.addEventListener("change", (e) => settings.invertedColors = e.target.checked);
      this.#contrastField.addEventListener("change", this.#handleChangeNumValue("contrast"));
      this.#fontSizeField.addEventListener("change", this.#handleChangeNumValue("fontSize"));
      this.#lineHeightField.addEventListener("change", this.#handleChangeNumValue("lineHeight"));
      root3.querySelector("#reset").addEventListener("click", () => {
        settings.reset();
        settings.remove();
      });
      root3.querySelector("#close").addEventListener("click", () => this.open = false);
      this.#observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.attributeName === "lang") this.handleLangChange();
        }
      });
    }
    #handleChangeNumValue(prop) {
      return (e) => {
        if (e.target.checkValidity()) settings[prop] = Number(e.target.value);
      };
    }
    #triggerEvent(prop, value) {
      const event = new CustomEvent("change", {
        detail: {
          prop,
          value,
          settings
        }
      });
      this.dispatchEvent(event);
    }
    get open() {
      return this.shadowRoot.querySelector("details").open;
    }
    set open(value) {
      this.shadowRoot.querySelector("details").open = value;
    }
    get lang() {
      return this.getAttribute("lang") || document.documentElement.lang || "en";
    }
    #handleStateChange = (prop, value) => {
      this.#fontField.checked = settings.dyslexicFont;
      this.#colorsField.checked = settings.invertedColors;
      this.#contrastField.value = String(settings.contrast);
      this.#fontSizeField.value = String(settings.fontSize);
      this.#lineHeightField.value = String(settings.lineHeight);
      if (prop) this.#triggerEvent(prop, value);
      settings.save();
    };
    #parseLang(attr) {
      return /^(\w+)(-\w+){0,2}$/.exec(attr)?.[1] || "en";
    }
    handleLangChange() {
      const { languages } = this.constructor;
      const locale = languages[this.lang] ?? languages[this.#parseLang(this.lang)] ?? languages.en;
      const labels = this.shadowRoot.querySelectorAll("label");
      for (let label of labels) {
        let key = label.getAttribute("for");
        if (locale[key]) label.textContent = locale[key];
      }
      for (let id of ["close", "reset"]) {
        this.shadowRoot.querySelector(`#${id}`).value = locale[id];
      }
    }
    #handleImportantChange() {
      settings.important = this.hasAttribute("important");
    }
    connectedCallback() {
      this.#handleStateChange();
      this.#handleImportantChange();
      this.handleLangChange();
      settings.addEventListener("change", this.#handleStateChange);
      settings.load();
      this.#observer.observe(document.documentElement, { attributes: true });
    }
    disconnectedCallback() {
      settings.removeEventListener("change", this.#handleStateChange);
      this.#observer.disconnect();
    }
    attributeChangedCallback(prop) {
      if (prop === "lang") this.handleLangChange();
      else if (prop === "important") this.#handleImportantChange();
    }
  };
  customElements.define("access-settings", AccessSettings);
})();
/**
 * @license
 * MIT License

Copyright (c) 2026 Yannick Bochatay https://github.com/YannickBochatay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/
