const template = document.createElement("template");

template.innerHTML = `
  <strong class="field-name"></strong> :
  <span lang="fr">element <code>&lt;div></code> du champ</span>
  <span lang="en"><code>&lt;div></code> element of field</span>
  <span lang="fr" class="field-descript"></span>
  <span lang="en" class="field-descript"></span>
  <ul>
    <li>
      <strong><span class="field-name"></span>-input</strong> :
      <span lang="fr">element <code>&lt;input></code> du champ</span>
      <span lang="en"><code>&lt;input></code> element of field</span>
      <span lang="fr" class="field-descript"></span>
      <span lang="en" class="field-descript"></span>
    </li>
    <li>
      <strong><span class="field-name"></span>-label</strong> :
      <span lang="fr">element <code>&lt;label></code> du champ</span>
      <span lang="en"><code>&lt;label></code> element of field</span>
      <span lang="fr" class="field-descript"></span>
      <span lang="en" class="field-descript"></span>
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
    for (const node of this.querySelectorAll("[lang=fr].field-descript")) {
      node.textContent = this.getAttribute("field-descript-fr");
    }
    for (const node of this.querySelectorAll("[lang=en].field-descript")) {
      node.textContent = this.getAttribute("field-descript-en");
    }
  }
}

customElements.define("part-descript", PartDescript);