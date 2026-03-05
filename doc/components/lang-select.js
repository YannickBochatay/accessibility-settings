const style = document.createElement("style");

style.innerHTML = /*css*/`
  lang-select select {
    font-size:1rem;
    padding:0.3rem 0.6rem;
    vertical-align:middle;

    option::after {
      content:"🇫🇷";
    }
  }
`
document.head.append(style);

const template = document.createElement("template");

template.innerHTML = `
  <select>
    <option value="fr"></option>
    <option value="en"></option>
  </select>
`

class LangSelect extends HTMLElement {

  #select
  #observer

  constructor() {
    super();
    this.append(template.content.cloneNode(true));
    this.#select = this.querySelector("select");

    this.#observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.attributeName === 'lang') this.#updateContent();
      }
    });
  }

  #updateContent() {
    const { lang } = document.documentElement
    this.querySelector("option[value=fr]").textContent = `🇫🇷 ${lang === "fr" ? "Français" : "French"}`
    this.querySelector("option[value=en]").textContent = `🇬🇧 ${lang === "fr" ? "Anglais" : "English"}`
    if (this.#select.value !== lang) this.#select.value = lang;
  }

  #handleChange = e => {
    document.documentElement.lang = e.target.value;
  }

  connectedCallback() {
    this.#updateContent();
    this.#select.addEventListener("change", this.#handleChange);
    this.#observer.observe( document.documentElement, { attributes: true });
  }

  disconnectedCallback() {
    this.#observer.disconnect();
  }
}

customElements.define("lang-select", LangSelect);