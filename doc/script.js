import { AccessSettings, settings } from "../dist/index.min.js";

const lang = /lang=(\w{2})/.exec(location.search)?.[1] ?? "en"

if (["fr", "en"].includes(lang)) {
  document.documentElement.lang = lang;
}



AccessSettings.languages.oc = {
  "dyslexic-font": "Poliça disléxica",
  "invert-colors": "Colors invertidas",
  "contrast": "Contraste",
  "font-size": "Talha de poliça",
  "line-height": "Nautor de linha",
  "reset": "Reïnicializar",
  "close": "Tampar"
}
const access = document.querySelector("access-settings");

const sections = document.querySelectorAll("main section:not(:first-child) section[id]");

const checkbox = document.querySelector("#myCheckBox");

checkbox.addEventListener("change", e => {
  settings.dyslexicFont = e.target.checked;
});

settings.addEventListener("change-dyslexicFont", () => {
  checkbox.checked = settings.dyslexicFont;
})

function hasEnoughSpaceForComponent() {
  const _open = access.open;
  access.style.visibility = "hidden";
  access.open = true;
  const width = access.getBoundingClientRect().width;
  const marginRight = getComputedStyle(document.querySelector("main")).marginRight;

  access.open = _open;
  access.style.visibility = "visible";

  return Number.parseInt(marginRight) > width;
}

access.addEventListener("change", e => {
  if (e.detail.prop === "fontSize") {
    document.querySelector("table-of-content").handleVisibility();
  }
})

function demoChange(e) {
  const { prop, value, preferences } = e.detail;

  alert(`Property ${prop} has changed to ${value}.
  Preferences are now ${JSON.stringify(preferences, null, 2)}.`);
}

function removeAttributes() {
  const attrs = [...access.attributes]
  for (const attr of attrs) {
    access.removeAttribute(attr.name);
  }
}
function select(selected) {
  for (let section of sections) {
    if (selected === section) section.classList.add("selected");
    else section.classList.remove("selected");
  }
}
function reset() {
  removeAttributes();
  style.innerHTML = "";
  while (access.firstElementChild) access.firstElementChild.remove();
  access.removeEventListener("change", demoChange);
  if (hasEnoughSpaceForComponent()) access.open = true;
}

const style = document.createElement("style");
document.head.append(style)

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    
    if (!entry.isIntersecting) return;

    select(entry.target);
    reset();
     
    switch (entry.target.id) {
      case "install":
        break;
      case "all":
        access.setAttribute("all", "");
        break;
      case "dyslexic-font":
        access.setAttribute("dyslexic-font", "");
        break;
      case "invert-colors":
        access.setAttribute("invert-colors", "");
        break;
      case "contrast":
        access.setAttribute("contrast", "");
        break;
      case "font-size":
        access.setAttribute("font-size", "");
        break;
      case "line-height":
        access.setAttribute("line-height", "");
        break;
      case "combinaison":
        access.setAttribute("contrast", "");
        access.setAttribute("font-size", "");
        access.setAttribute("line-height", "");
        break;
      case "side":
        access.setAttribute("all", "");
        access.setAttribute("side", "left");
        break;
      case "rounded":
        access.setAttribute("all", "");
        access.setAttribute("rounded", "");
        break;
      case "lang":
        access.setAttribute("all", "");
        access.setAttribute("lang", "es");
        break;
      case "important":
        access.setAttribute("all", "");
        access.setAttribute("important", "");
        break;
      case "add-lang":
        access.setAttribute("all", "");
        access.setAttribute("lang", "oc");
        break;
      case "position":
        access.setAttribute("all", "");
        style.innerHTML = /*css*/`
          access-settings {
            top:4rem;
            right:5px;
          }
        `
        break;
      case "icon":
        access.setAttribute("all", "");
        style.innerHTML = /*css*/`
          access-settings::part(icon) {
            background-color: brown;
            fill:white;
          }
        `
        break;
      case "slot-icon": {
        access.setAttribute("all", "");
        const icon = document.createElement("span");
        icon.setAttribute("slot","icon");
        icon.textContent = "⚙︎";
        icon.style.fontSize = "2rem";
        access.append(icon);
        break;
      }
      case "styles":
        access.setAttribute("all", "");
        style.innerHTML = /*css*/`
          access-settings::part(line-height) {
            background-color:violet;
          }
          access-settings::part(font-size-label) {
            font-weight:bold;
          }
        `;
        break;
      case "add-option": {
        access.setAttribute("all", "");
        const option = document.createElement("div");
        option.setAttribute("slot","option");
        option.innerHTML = `
          <label>
            <input type="checkbox">
            Une nouvelle option
          </label>
        `
        const input = option.querySelector("input");
        input.addEventListener("change", () => {
          if (input.checked) alert("nouvelle option cochée");
        })

        access.append(option)
        break;
      }
      case "change":
        access.setAttribute("all", "");
        access.addEventListener("change", demoChange);
        break;
      default:
        access.setAttribute("all", "");
    }
  });
}

let options = {
  root: null,
  rootMargin: "-30% 0px -70% 0px"
};

const observer = new IntersectionObserver(handleIntersect, options);

for (const section of sections) {
  observer.observe(section);
}