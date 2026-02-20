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

import "./globalStyles.js"
import { preferences, resetPrefs, onStateChange, offStateChange } from "./preferences.js"
import { template } from "./template.js"
import languages from "./languages.json" with { type: "json" };

export class AccessSettings extends HTMLElement {

  static languages = new Proxy(languages, {
    set(target, prop, value) {
      target[prop] = value;
      for (const component of document.querySelectorAll("access-settings")) {
        component.handleLangChange()
      }
      return true;
    }
  })

  #fontField
  #colorsField
  #contrastField
  #fontSizeField
  #lineHeightField
  #observer

  constructor() {
    super();
    const root = this.attachShadow({ mode : "open" });
    root.append(template.content.cloneNode(true));

    this.#fontField = root.querySelector("#dyslexic-font");
    this.#colorsField = root.querySelector("#inverted-colors");
    this.#contrastField = root.querySelector("#contrast");
    this.#fontSizeField = root.querySelector("#font-size");
    this.#lineHeightField = root.querySelector("#line-height");

    this.#fontField.addEventListener("change", e => preferences.dyslexicFont = e.target.checked);
    this.#colorsField.addEventListener("change", e => preferences.invertedColors = e.target.checked);
    this.#contrastField.addEventListener("change", e => preferences.contrast = e.target.value);
    this.#fontSizeField.addEventListener("change", e => preferences.fontSize = e.target.value);
    this.#lineHeightField.addEventListener("change", e => preferences.lineHeight = e.target.value);

    root.querySelector("#reset").addEventListener("click", resetPrefs);
    root.querySelector("#close").addEventListener("click", () => this.open = false);

    this.#observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.attributeName === 'lang') this.handleLangChange();
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
  }

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
    this.#observer.observe( document.documentElement, { attributes: true });
  }

  disconnectedCallback() {
    offStateChange(this.#handleStateChange);
    this.#observer.disconnect();
  }
}


customElements.define('access-settings', AccessSettings);