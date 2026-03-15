import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/highlight.min.js"

const template = document.createElement("template");

const label = "Copy code to clipboard";

template.innerHTML = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/a11y-light.min.css">
  <style>
    :host {
      display:block;
      position:relative;

      & > div {
        overflow-x:auto;

        pre {
          margin:0;

          code.hljs {
            box-sizing:border-box;
            min-width:100%;
            width:fit-content;
          }
        }

        button {
          position:absolute;
          top:0;
          right:0;
          border:none;
          display:none;

          svg {
            stroke-width:2;
            stroke:#555;
            fill:none;
            stroke-linecap:round;
            stroke-linejoin:round;
          }
        }

        &:hover button {
          display:inline-block;
        }
      }
    }
  </style>
  <div tabindex="0">
    <pre><code class="language-xxx"></code></pre>
    <button title="Copy" aria-label="${label}">
      <svg width="24" height="24">
        <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
        <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
      </svg>
    </button>
  </div>
  <slot></slot>
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

  copyCode = async () => {
    const { textContent } = this.shadowRoot.querySelector("code");
    const btn = this.shadowRoot.querySelector("button");
    
    try {
      await navigator.clipboard.writeText(textContent);

      const icon = btn.firstElementChild;
      
      btn.textContent = 'Copied !';
      btn.setAttribute('aria-label', 'Code copied');
      
      setTimeout(() => {
          btn.replaceChildren(icon);
          btn.setAttribute('aria-label', label);
      }, 2000);

    } catch (e) {
      alert('Unable to copy code. Please copy it manually.');
    }
  }

  connectedCallback() {
    const code = this.shadowRoot.querySelector("code");
    const slot = this.shadowRoot.querySelector("slot");    
    code.className = code.className.replace("xxx", this.language);
    code.append(...slot.assignedNodes());
    slot.remove();
    hljs.highlightElement(code);

    const button = this.shadowRoot.querySelector("button");
    button.addEventListener("click", this.copyCode);
  }
}

customElements.define("code-example", CodeExample);