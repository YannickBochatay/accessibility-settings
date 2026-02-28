const template = document.createElement("template");

template.innerHTML = `
  <strong class="field-name"></strong> : conteneur du champ <span class="field-descript"></span>
  <ul>
    <li>
      <strong><span class="field-name"></span>-input</strong> :
      champ <code>&lt;input></code> du champ <span class="field-descript"></span>
    </li>
    <li>
      <strong><span class="field-name"></span>-label</strong> :
      libellé du champ <span class="field-descript"></span>
    </li>
  </ul>
`

class PartDescript extends HTMLElement {

  constructor() {
    super();
    this.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    for (const node of this.querySelectorAll(".field-name")) {
      node.textContent = this.getAttribute("field-name");
    }
    for (const node of this.querySelectorAll(".field-descript")) {
      node.textContent = this.getAttribute("field-descript");
    }
  }
}

customElements.define("part-descript", PartDescript);