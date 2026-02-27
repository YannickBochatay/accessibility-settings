function addAccessSettings() {
  import('https://cdn.jsdelivr.net/npm/access-settings')
    .then(() => {
      const node = document.createElement('access-settings');
      node.setAttribute('all','');
      node.setAttribute('important','');
      node.style.zIndex=99999;
      document.body.append(node);
    })
    .catch(e => {
      alert(`Unable to load access settings component :\n${e.message}`);
    })
}

const style = document.createElement("style");

style.innerHTML = /*css*/`
  #bookmarklet {
    display:inline-block;
    padding:0.5rem 1rem;
    background-color:var(--link);
    color:var(--foreground);
    border-radius:5px;
    text-decoration:none;
  }
`
document.head.append(style);

class Bookmarklet extends HTMLElement {

  constructor() {
    super()
    this.innerHTML = `
      <a id="bookmarklet" href="javascript:(${addAccessSettings.toString()})()">
        Access settings
      </a>
    `
  }

  connectedCallback() {
    this.querySelector("a").addEventListener("click", e => e.preventDefault());
  }

}

customElements.define("bookmarklet-me", Bookmarklet);