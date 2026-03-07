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

import { settings } from "./settings.js"
import { template } from "./template.js"
import languages from "./languages.json" with { type: "json" };
import { removeConfig } from "./localStorage.js";

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

  static observedAttributes = ["lang"]

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

    this.#fontField.addEventListener("change", e => settings.dyslexicFont = e.target.checked);
    this.#colorsField.addEventListener("change", e => settings.invertedColors = e.target.checked);
    this.#contrastField.addEventListener("change", this.#handleChangeNumValue("contrast"));
    this.#fontSizeField.addEventListener("change", this.#handleChangeNumValue("fontSize"));
    this.#lineHeightField.addEventListener("change", this.#handleChangeNumValue("lineHeight"));

    root.querySelector("#reset").addEventListener("click", () => {
      settings.reset();
      removeConfig();
    });
    root.querySelector("#close").addEventListener("click", () => this.open = false);

    this.#observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.attributeName === 'lang') this.handleLangChange();
      }
    });
  }

  #handleChangeNumValue(prop) {
    return e => {
      if (e.target.checkValidity()) settings[prop] = Number(e.target.value)
    }
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
  }

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

  connectedCallback() {
    this.#handleStateChange();
    this.handleLangChange();
    settings.addListener(this.#handleStateChange);
    this.#observer.observe( document.documentElement, { attributes: true });
  }

  disconnectedCallback() {
    settings.removeListener(this.#handleStateChange);
    this.#observer.disconnect();
  }

  attributeChangedCallback(prop) {
    if (prop === "lang") this.handleLangChange();
  }
}


customElements.define('access-settings', AccessSettings);