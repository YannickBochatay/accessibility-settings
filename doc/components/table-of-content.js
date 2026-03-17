const style = document.createElement("style");

style.innerHTML = /*css*/ `
  #table-of-content {
    position:fixed;
    left:5px;
    top:0.5rem;
    z-index:1;
    &.right {
      left:unset;
      right:5px;
    }
    summary {
      cursor:pointer;
      font-size: 1.5rem;
      &::marker {
        content:"";
      }
    }
    nav {
      border-radius:5px;
      border:1px solid var(--border);
      background-color: var(--foreground);
      max-height:90vh;
      overflow-y:auto;
      > ul {
        padding-left: 2rem;
        margin-right: 1rem;
        > li {
          font-weight:bold;
          margin-top:1rem;
        }
        ul {
          font-weight:normal;
          padding-left: 1rem;
        }
      }
    }
    &.extended {
      left:0;
      top: 3.3rem;
      summary {
        display:none;
      }
      nav {
        border-radius:0;
        height:calc(100vh - 3.2rem);
        max-height:unset;
        background-color: var(--background);
      }
    }
  }
`

document.head.append(style);

const template = document.createElement("template");

template.innerHTML = `
  <details id="table-of-content">
    <summary>☰</summary>
    <nav>
      <ul>
      </ul>
    </nav>
  </details>
`

class TableOfContent extends HTMLElement {

  #observer

  constructor() {
    super();
    this.append(template.content.cloneNode(true))

    this.#observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.attributeName === 'lang') this.#updateContent();
      }
    });
  }

  #updateContent() {
    const sections = document.querySelectorAll("section[id]:has(h2)");
    const mainUl = document.querySelector("details nav ul");
    this.#updateItems(2, sections, mainUl);
  }

  #updateItems(level, sections, parent) {
    const lang = document.documentElement.lang;

    for (const [index, section] of sections.entries()) {
      const li = parent.children[index] ?? document.createElement("li");
      
      const a = li.firstElementChild ?? document.createElement("a");
      a.href = "#" + section.id;
      a.textContent = section.querySelector(`h${level}:lang(${lang})`).textContent;
      if (!a.parentNode) li.append(a);
      
      if (!li.parentNode) parent.append(li);
      
      const subSections = section.querySelectorAll(`section[id]:has(h${level+1})`)
      
      if (subSections?.length) {
        const ul = li.querySelector("ul") ?? document.createElement("ul");
        if (!ul.parentNode) li.append(ul)
        this.#updateItems(level + 1, subSections, ul);
      }
    }
  }

  handleVisibility = () => {
    const details = this.querySelector("details");
    details.style.visibility = "hidden";
    details.open = true;
    const width = details.getBoundingClientRect().width;
    const marginLeft = getComputedStyle(document.querySelector("main")).marginLeft;
    const hasEnoughSpace = Number.parseInt(marginLeft) > width;

    details.open = hasEnoughSpace;
    details.classList[hasEnoughSpace ? "add" : "remove"]("extended");
    details.style.visibility = "visible";
  }

  connectedCallback() {
    this.#updateContent();
    this.handleVisibility();
    window.addEventListener("resize", this.handleVisibility);
    this.#observer.observe( document.documentElement, { attributes: true });
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleVisibility);
    this.#observer.disconnect();
  }
}

customElements.define("table-of-content", TableOfContent);