import { settings } from "../settings/index.js"
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

  static observedAttributes = ["lang", "important"]

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
      settings.remove();
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

    settings.save();
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

  #handleImportantChange() {
    settings.important = this.hasAttribute("important");
  }

  connectedCallback() {
    this.#handleStateChange();
    this.#handleImportantChange();
    this.handleLangChange();
    settings.addEventListener("change", this.#handleStateChange);
    settings.load();
    this.#observer.observe( document.documentElement, { attributes: true });
  }

  disconnectedCallback() {
    settings.removeEventListener("change", this.#handleStateChange);
    this.#observer.disconnect();
  }

  attributeChangedCallback(prop) {
    if (prop === "lang") this.handleLangChange();
    else if (prop === "important") this.#handleImportantChange();
  }
}


customElements.define('access-settings', AccessSettings);

export default AccessSettings;