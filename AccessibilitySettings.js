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

    if (prop === "dyslexicFont") {
      if (value) root.classList.add("dyslexic");
      else root.classList.remove("dyslexic");

    } else if (prop === "invertedColors") {
      if (value) root.classList.add("invertedColors");
      else root.classList.remove("invertedColors");
    } else if (prop === "contrast") {
      root.style.fontSize = value + "px";
    } else if (prop === "fontSize") {
      root.style.fontSize = value + "px";

    } else if (prop === "lineHeight") {
      root.style.lineHeight = value;
    }

    obj[prop] = value;
    localStorage.setItem(STORAGE_NAME, JSON.stringify(obj));
    return true;
  }
});

const defaultPrefs = { ...initialPrefs };

export function resetPrefs() {
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


export class AccessibilitySettings extends HTMLElement {

  #fontField
  #colorsField
  #fontSizeField
  #lineHeightField

  constructor() {
    super();
    const root = this.attachShadow({ mode : "open" });

    root.innerHTML = `
      <style>
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
            height:40px;
            &::marker {
              content:url(data:image/svg+xml;base64,DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDM4OS45IDM4OS42IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPg0KICA8Y2lyY2xlIHN0cm9rZT0iYmxhY2siIGZpbGw9Im5vbmUiIGN4PSIyNTAuNiIgY3k9IjE0Ni40IiByPSIzNS43IiB0cmFuc2Zvcm09Im1hdHJpeCguMTYwMjI2IC0uOTg3MDggLjk4NzA4IC4xNjAyMjYgNi43NSAzMTEuNzEpIj48L2NpcmNsZT4NCiAgPHBhdGggZmlsbD0iYmxhY2siIGQ9Ik0xOTEuNCAxMzAuN2MtMjMuNjkzIDAtNDIuOS0xOS4yMDctNDIuOS00Mi45czE5LjIwNy00Mi45IDQyLjktNDIuOSA0Mi45IDE5LjIwNyA0Mi45IDQyLjlhNDIuODkgNDIuODkgMCAwIDEtNDIuOSA0Mi45em0wLTcxLjVjLTEzLjY5LS4wMzgtMjUuNDk4IDkuNjA1LTI4LjE5NyAyMy4wMjZhMjguNjggMjguNjggMCAwIDAgMTcuMTA1IDMyLjEzNWMxMi42NDEgNS4yNTYgMjcuMjM0Ljg0NiAzNC44NDgtMTAuNTMxQTI4LjY4IDI4LjY4IDAgMCAwIDIxMS42IDY3LjZhMjkuMDYgMjkuMDYgMCAwIDAtMjAuMi04LjR6bTUyLjUgMjc4LjZhMjEuNDYgMjEuNDYgMCAwIDEtMTkuNS0xMi42bC0zMy4xLTgwLjMtMzIuNyA4MC4xYTIxLjQxIDIxLjQxIDAgMCAxLTM3LjEgNC4xIDIxLjU3IDIxLjU3IDAgMCAxLTIuMS0yMS41bDM0LjQtODcuNWEyNi42MyAyNi42MyAwIDAgMCAxLjktMTAuNHYtMTYuNGE3LjA5IDcuMDkgMCAwIDAtNi41LTcuMWwtNjAuNi01LjVjLTExLjc5MS0uOTExLTIwLjYxMS0xMS4yMDktMTkuNy0yM3MxMS4yMDktMjAuNjExIDIzLTE5LjdsNzUuMSA2LjdhOTcuMTggOTcuMTggMCAwIDAgNy43LjNoMzMuNGE5OS4wOCA5OS4wOCAwIDAgMCA3LjctLjNsNzUtNi43aC4xYzExLjc5MS0uOTExIDIyLjA4OSA3LjkwOSAyMyAxOS43cy03LjkwOSAyMi4wODktMTkuNyAyM2wtNjAuNSA1LjVhNy4wOSA3LjA5IDAgMCAwLTYuNSA3LjF2MTYuNGEyOC4yOSAyOC4yOSAwIDAgMCAyIDEwLjRsMzQuNSA4Ny45YTIxLjM2IDIxLjM2IDAgMCAxLTEuOCAyMC4yIDIyLjA2IDIyLjA2IDAgMCAxLTE4IDkuNnptLTUyLjUtMTA3LjFhMTQuMTEgMTQuMTEgMCAwIDEgMTMuMSA4LjhsMzMgODAuMWE3LjYyIDcuNjIgMCAwIDAgMy45IDMuNiA3LjEzIDcuMTMgMCAwIDAgOS05LjZsLTM0LjYtODguM2E0Mi4xNCA0Mi4xNCAwIDAgMS0zLTE1Ljd2LTE2LjRjLS4wNTQtMTEuMTAxIDguNDM4LTIwLjM3NiAxOS41LTIxLjNsNjAuNi01LjVhNyA3IDAgMCAwIDQuOS0yLjQgNi42MSA2LjYxIDAgMCAwIDEuNy01LjIgNyA3IDAgMCAwLTcuNi02LjZsLTc0LjkgNi43YTg4LjMzIDg4LjMzIDAgMCAxLTguOS40aC0zMy40YTg3IDg3IDAgMCAxLTguOS0uNGwtNzUtNi43YTcuMTIgNy4xMiAwIDAgMC0xIDE0LjJsNjAuNyA1LjVjMTEuMDYyLjkyNCAxOS41NTQgMTAuMTk5IDE5LjUgMjEuM3YxNi40YTQyLjE0IDQyLjE0IDAgMCAxLTMgMTUuN2wtMzQuNSA4Ny45YTcuMDkgNy4wOSAwIDAgMCAuMyA3LjMgNy4xOSA3LjE5IDAgMCAwIDYuNiAzLjIgNyA3IDAgMCAwIDUuOS00LjNsMzIuOS03OS45YTE0IDE0IDAgMCAxIDEzLjItOC44eiI+PC9wYXRoPg0KPC9zdmc+);
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
      </style>
      <details part="details">
        <summary part="summary" aria-label="accessibility settings"></summary>
        <form part="form">
          <div>
            <input type="checkbox" id="dyslexic-field">
            <label for="dyslexic-field">Police dyslexie</label>
          </div>
          <div>
            <input type="checkbox" id="colors-field">
            <label for="colors-field">Couleurs inversées</label>
          </div>
          <div>
            <input type="number" id="fontSize-field">
            <label for="fontSize-field">Taille de police</label>
          </div>
          <div>
            <input type="number" id="lineHeight-field" step="0.1">
            <label for="lineHeight-field">Interligne</label>
          </div>
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