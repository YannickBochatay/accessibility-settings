const style = document.createElement("style");

style.innerHTML = /*css*/ `
  #table-of-content {
    position:absolute;
    left:5px;
    top:0.5rem;
    &.extended {
      left:0;
      top: 3.2rem;
      summary {
        display:none;
      }
      nav {
        border-radius:0;
        border-top:none;
        height:calc(100vh - 3.2rem);
        max-height:unset;
      }
    }
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

  constructor() {
    super();
    this.append(template.content.cloneNode(true))
  }

  #addItems(level, sections, parent) {
    for (const section of sections) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + section.id;
      a.textContent = section.querySelector(`h${level}`).textContent;
      li.append(a);
      parent.append(li);
      const subSections = section.querySelectorAll(`section[id]:has(h${level+1})`)
      if (subSections?.length) {
        const ul = document.createElement("ul");
        li.append(ul)
        this.#addItems(level + 1, subSections, ul);
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
    const sections = document.querySelectorAll("section[id]:has(h2)");
    const mainUl = document.querySelector("details nav ul");
    this.#addItems(2, sections, mainUl);
    this.handleVisibility();
    window.addEventListener("resize", this.handleVisibility);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleVisibility);
  }
}

customElements.define("table-of-content", TableOfContent);