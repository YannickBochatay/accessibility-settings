const globalStyles = document.createElement('style');

globalStyles.innerHTML = `
  @font-face {
    font-family: open-dyslexic;
    src: url(https://fonts.cdnfonts.com/s/29616/open-dyslexic.woff);
  }
  html.dyslexic {
    font-family:open-dyslexic, sans-serif;
  }
  html.invertedColors {
    filter:invert(1);
  }
  @media (prefers-color-scheme: dark) {
    html {
      filter:invert(1);
    }
    html.invertedColors {
      filter:invert(0);
    }
  }
`;
document.head.append(globalStyles);

const STORAGE_NAME = "preferences";

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

const preferences = new Proxy(initialPrefs, {
  set(obj, prop, value) {
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

    obj[prop] = value;
    localStorage.setItem(STORAGE_NAME, JSON.stringify(obj));
    return true;
  }
});

const defaultPrefs = { ...initialPrefs };

function resetPrefs() {
  for (let key in defaultPrefs) {
    preferences[key] = defaultPrefs[key];
  }
}

const storedData = localStorage.getItem(STORAGE_NAME);

if (storedData) {
  const data = JSON.parse(storedData);

  for (let key in data) {
    preferences[key] = data[key];
  }
}

const style = `
  :host {
    font-size:18px;
    line-height:1.5;
    position:fixed;
    top:3px;
    right:5px;
  }
  details {
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    
    summary {
      transition:transform 0.3s;
      cursor:pointer;
      border:1px solid #ccc;
      background-color:#ddd;
      border-radius:50%;
      display:flex;
      svg {
        width:40px;
        height:40px;
      }
      &::marker {
        content:"";
      }
      &:hover {
        background-color:#e1e1e1;
      }
    }

    &:open summary {
      transform:rotate(90deg);
      transition:transform 0.2s;
    }

    form {
      font-size:1em;
      padding:10px 20px;
      border:1px solid #ccc;
      color:#222;
      background-color:#fafafa;
      line-height:3;
      text-align: left;
      border-radius:5px;
      
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
    }
  }
`


export class AccessibilitySettings extends HTMLElement {

  #fontField
  #colorsField
  #fontSizeField
  #lineHeightField

  constructor() {
    super();
    const root = this.attachShadow({ mode : "open" });

    root.innerHTML = `
      <style>${style}</style>
      <details part="details">
        <summary part="summary" aria-label="accessibility settings">
          <svg viewBox="0 0 389.9 389.6" part="icon">
            <circle stroke="black" fill="none" cx="250.6" cy="146.4" r="35.7" transform="matrix(.160226 -.98708 .98708 .160226 6.75 311.71)"></circle>
            <path fill="black" d="M191.4 130.7c-23.693 0-42.9-19.207-42.9-42.9s19.207-42.9 42.9-42.9 42.9 19.207 42.9 42.9a42.89 42.89 0 0 1-42.9 42.9zm0-71.5c-13.69-.038-25.498 9.605-28.197 23.026a28.68 28.68 0 0 0 17.105 32.135c12.641 5.256 27.234.846 34.848-10.531A28.68 28.68 0 0 0 211.6 67.6a29.06 29.06 0 0 0-20.2-8.4zm52.5 278.6a21.46 21.46 0 0 1-19.5-12.6l-33.1-80.3-32.7 80.1a21.41 21.41 0 0 1-37.1 4.1 21.57 21.57 0 0 1-2.1-21.5l34.4-87.5a26.63 26.63 0 0 0 1.9-10.4v-16.4a7.09 7.09 0 0 0-6.5-7.1l-60.6-5.5c-11.791-.911-20.611-11.209-19.7-23s11.209-20.611 23-19.7l75.1 6.7a97.18 97.18 0 0 0 7.7.3h33.4a99.08 99.08 0 0 0 7.7-.3l75-6.7h.1c11.791-.911 22.089 7.909 23 19.7s-7.909 22.089-19.7 23l-60.5 5.5a7.09 7.09 0 0 0-6.5 7.1v16.4a28.29 28.29 0 0 0 2 10.4l34.5 87.9a21.36 21.36 0 0 1-1.8 20.2 22.06 22.06 0 0 1-18 9.6zm-52.5-107.1a14.11 14.11 0 0 1 13.1 8.8l33 80.1a7.62 7.62 0 0 0 3.9 3.6 7.13 7.13 0 0 0 9-9.6l-34.6-88.3a42.14 42.14 0 0 1-3-15.7v-16.4c-.054-11.101 8.438-20.376 19.5-21.3l60.6-5.5a7 7 0 0 0 4.9-2.4 6.61 6.61 0 0 0 1.7-5.2 7 7 0 0 0-7.6-6.6l-74.9 6.7a88.33 88.33 0 0 1-8.9.4h-33.4a87 87 0 0 1-8.9-.4l-75-6.7a7.12 7.12 0 0 0-1 14.2l60.7 5.5c11.062.924 19.554 10.199 19.5 21.3v16.4a42.14 42.14 0 0 1-3 15.7l-34.5 87.9a7.09 7.09 0 0 0 .3 7.3 7.19 7.19 0 0 0 6.6 3.2 7 7 0 0 0 5.9-4.3l32.9-79.9a14 14 0 0 1 13.2-8.8z"></path>
          </svg>
          <slot name="icon"></slot>
        </summary>
        <form part="form">
          <div part="dislexic-font">
            <input type="checkbox" id="dyslexic-field">
            <label for="dyslexic-field">Police dyslexie</label>
          </div>
          <div part="inverted-colors">
            <input type="checkbox" id="colors-field">
            <label for="colors-field">Couleurs inversées</label>
          </div>
          <div part="font-size">
            <input type="number" id="fontSize-field">
            <label for="fontSize-field">Taille de police</label>
          </div>
          <div part="line-height">
            <input type="number" id="lineHeight-field" step="0.1">
            <label for="lineHeight-field">Interligne</label>
          </div>
          <slot name="more-options"></slot>
          <input type="button" id="reset-preferences" value="Réinitialiser"/>
          <input type="button" id="close-preferences" value="Terminer"/>
        </form>
      </details>
    `;

    this.#fontField = root.querySelector("#dyslexic-field");
    this.#colorsField = root.querySelector("#colors-field");
    this.#fontSizeField = root.querySelector("#fontSize-field");
    this.#lineHeightField = root.querySelector("#lineHeight-field");

    this.#fontField.addEventListener("change", e => preferences.dyslexicFont = e.target.checked);
    this.#colorsField.addEventListener("change", e => preferences.invertedColors = e.target.checked);
    this.#fontSizeField.addEventListener("change", e => preferences.fontSize = e.target.value);
    this.#lineHeightField.addEventListener("change", e => preferences.lineHeight = e.target.value);

    root.querySelector("#reset-preferences").addEventListener("click", () => {
      resetPrefs();
      this.#initFieldsFromPrefs();
    });
    root.querySelector("#close-preferences").addEventListener("click", () => {
      root.querySelector("details").open = false;
    });
  }

  #initFieldsFromPrefs() {
    this.#fontField.checked = preferences.dyslexicFont;
    this.#colorsField.checked = preferences.invertedColors;
    this.#fontSizeField.value = preferences.fontSize;
    this.#lineHeightField.value = preferences.lineHeight;
  }

  connectedCallback() {
    this.#initFieldsFromPrefs();
  }

}


customElements.define('accessibility-settings', AccessibilitySettings);