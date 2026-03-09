import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/highlight.min.js";
import javascript from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/languages/javascript.min.js";
import css from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/languages/css.min.js";

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);

const template = document.createElement("template");

template.innerHTML = `
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/a11y-light.min.css"
  >
  <style>
    code {
      background-color:var(--foreground);
    }
  </style>
  <pre><code class="language-xxx" tabindex="0"></code></pre>
`

class CodeExample extends HTMLElement {

  constructor() {
    super();
    const root = this.attachShadow({ mode : "open" });
    root.append(template.content.cloneNode(true));
  }

  get language() {
    return this.getAttribute("language");
  }

  connectedCallback() {
    const content = this.innerHTML.trim();
    const highlightedCode = hljs.highlight(content, { language: this.language }).value;
    const code = this.shadowRoot.querySelector("code");    
    code.className = code.className.replace("xxx", this.language);
    code.innerHTML = highlightedCode;
  }
}

customElements.define("code-example", CodeExample);