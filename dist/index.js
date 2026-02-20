(() => {
  // src/globalStyles.js
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
  :root.dyslexic {
    font-family:var(--access-font-family);
    h1,h2,h3,h4,h5,h6, body, header, footer, main, article, section, aside, p {
      font-family:var(--access-font-family) !important;
    }
  }
  :root.lineHeight {
    line-height:var(--access-line-height);
    body, header, footer, main, article, section, aside, p {
      line-height:var(--access-line-height) !important;
    }
  }
  :root.fontSize {
    font-size:var(--access-font-size);
    body, header, footer, main, article, section, aside, p {
      font-size:1rem !important;
    }
  }
  :root.invertedColors {
    &:not(.contrasted) {
      filter:invert(1);
    }
    &.contrasted {
      filter:invert(1) contrast(var(--access-contrast));
    }
  }
  :root.contrasted {
    &:not(.invertedColors) {
      filter:contrast(var(--access-contrast));
    }
  }
  
  @media (prefers-color-scheme: dark) {
    :root:has(access-settings[invert-colors], access-settings[all]) {
      &:not(.contrasted) {
        filter:invert(1);
      }
      &.contrasted {
        filter:invert(1) contrast(var(--access-contrast));
      }
      &.invertedColors {
        &:not(.contrasted) {
          filter:invert(0);
        }
        &.contrasted {
          filter:invert(0) contrast(var(--access-contrast));
        }
      }
    }
  }
`;
  document.head.append(globalStyles);

  // src/createState.js
  function createState(initialState) {
    const listeners = [];
    function createProxy(target) {
      return new Proxy(target, {
        set(target2, prop, value) {
          target2[prop] = value;
          listeners.forEach((callback) => callback(String(prop), value));
          return true;
        },
        get(target2, prop) {
          if (prop === "_isProxy") return true;
          if (target2[prop]?._isProxy) return target2[prop];
          if (target2[prop] && typeof target2[prop] === "object") return createProxy(target2[prop]);
          return target2[prop];
        }
      });
    }
    return {
      state: createProxy(initialState),
      onStateChange(callback) {
        listeners.push(callback);
      },
      offStateChange(callback) {
        const index = listeners.indexOf(callback);
        if (index !== -1) listeners.splice(index, 1);
      }
    };
  }

  // src/preferences.js
  var root = document.documentElement;
  function getInitialFontSize(elmt = root) {
    let fontSize = getComputedStyle(elmt).fontSize;
    let value = Number.parseInt(fontSize);
    if (Number.isNaN(value) && elmt === root) {
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
        p.style.margin = 0;
        p.style.border = "none";
        p.style.padding = 0;
        p.textContent = "toto";
        document.body.appendChild(p);
        let lineHeight2 = getInitialLineHeight(p);
        p.remove();
        return lineHeight2;
      } else {
        return elmt.getBoundingClientRect().height;
      }
    }
    return Math.round(value * 10 / getInitialFontSize()) / 10;
  }
  var initialPrefs = {
    dyslexicFont: false,
    invertedColors: false,
    contrast: 100,
    fontSize: getInitialFontSize(),
    lineHeight: getInitialLineHeight()
  };
  var { state: preferences, onStateChange, offStateChange } = createState(initialPrefs);
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
        root.style.setProperty("--access-contrast", value + "%");
        break;
      case "fontSize":
        root.classList.add("fontSize");
        root.style.setProperty("--access-font-size", value + "px");
        break;
      case "lineHeight":
        root.classList.add("lineHeight");
        root.style.setProperty("--access-line-height", value);
        break;
    }
  });
  var defaultPrefs = { ...initialPrefs };
  function resetPrefs() {
    for (let key in defaultPrefs) {
      preferences[key] = defaultPrefs[key];
      root.classList.remove("fontSize", "lineHeight", "contrasted");
      localStorage.removeItem(STORAGE_NAME);
    }
  }
  var STORAGE_NAME = "preferences";
  onStateChange(() => {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(preferences));
  });
  var storedData = localStorage.getItem(STORAGE_NAME);
  if (storedData) {
    const data = JSON.parse(storedData);
    for (let key in data) {
      preferences[key] = data[key];
    }
  }

  // src/style.js
  var style = (
    /*css*/
    `
  :host {
    font-size:18px;
    line-height:1.5;
    position:fixed;
    top:40%;
    right:5px;
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

  // src/template.js
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
        <input type="checkbox" id="dyslexic-font">
        <label for="dyslexic-font">Police dyslexie</label>
      </div>
      <div class="field" part="invert-colors">
        <input type="checkbox" id="inverted-colors">
        <label for="inverted-colors">Couleurs invers\xE9es</label>
      </div>
      <div class="field" part="contrast">
        <input type="number" step="10" id="contrast" min="50" max="150">
        <label for="contrast">Contraste</label>
      </div>
      <div class="field" part="font-size">
        <input type="number" id="font-size">
        <label for="font-size">Taille de police</label>
      </div>
      <div class="field" part="line-height">
        <input type="number" id="line-height" step="0.1">
        <label for="line-height">Interligne</label>
      </div>
      <slot name="option"></slot>
      <div part="buttons"> 
        <input type="button" id="reset" value="R\xE9initialiser" part="reset-button"/>
        <input type="button" id="close" value="Terminer" part="close-button"/>
      </div>
    </form>
  </details>
`;

  // src/languages.json
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

  // src/index.js
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
    #fontField;
    #colorsField;
    #contrastField;
    #fontSizeField;
    #lineHeightField;
    #observer;
    constructor() {
      super();
      const root2 = this.attachShadow({ mode: "open" });
      root2.append(template.content.cloneNode(true));
      this.#fontField = root2.querySelector("#dyslexic-font");
      this.#colorsField = root2.querySelector("#inverted-colors");
      this.#contrastField = root2.querySelector("#contrast");
      this.#fontSizeField = root2.querySelector("#font-size");
      this.#lineHeightField = root2.querySelector("#line-height");
      this.#fontField.addEventListener("change", (e) => preferences.dyslexicFont = e.target.checked);
      this.#colorsField.addEventListener("change", (e) => preferences.invertedColors = e.target.checked);
      this.#contrastField.addEventListener("change", (e) => preferences.contrast = e.target.value);
      this.#fontSizeField.addEventListener("change", (e) => preferences.fontSize = e.target.value);
      this.#lineHeightField.addEventListener("change", (e) => preferences.lineHeight = e.target.value);
      root2.querySelector("#reset").addEventListener("click", resetPrefs);
      root2.querySelector("#close").addEventListener("click", () => this.open = false);
      this.#observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.attributeName === "lang") this.handleLangChange();
        }
      });
    }
    get open() {
      return this.shadowRoot.querySelector("details").open;
    }
    set open(value) {
      this.shadowRoot.querySelector("details").open = value;
    }
    #handleStateChange = () => {
      this.#fontField.checked = preferences.dyslexicFont;
      this.#colorsField.checked = preferences.invertedColors;
      this.#contrastField.value = preferences.contrast;
      this.#fontSizeField.value = preferences.fontSize;
      this.#lineHeightField.value = preferences.lineHeight;
    };
    #parseLang() {
      const attr = document.documentElement.lang;
      if (!attr) return "en";
      return /^(\w+)(-\w+){0,2}$/.exec(attr)?.[1] || "en";
    }
    handleLangChange() {
      const lang = this.#parseLang();
      const { languages } = this.constructor;
      const locale = languages[lang] ?? languages.en;
      const labels = this.shadowRoot.querySelectorAll("label");
      for (let label of labels) {
        let key = label.getAttribute("for");
        if (locale[key]) label.textContent = locale[key];
      }
      for (let id of ["close", "reset"]) {
        this.shadowRoot.querySelector(`#${id}`).value = locale[id];
      }
    }
    connectedCallback() {
      this.#handleStateChange();
      this.handleLangChange();
      onStateChange(this.#handleStateChange);
      this.#observer.observe(document.documentElement, { attributes: true });
    }
    disconnectedCallback() {
      offStateChange(this.#handleStateChange);
      this.#observer.disconnect();
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
