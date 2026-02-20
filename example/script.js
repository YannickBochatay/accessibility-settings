hljs.highlightAll();

const access = document.createElement("access-settings");
access.setAttribute("all","");
document.body.append(access);

const sections = document.querySelectorAll("main section[id]");

function removeAttributes() {
  for (const attr of access.attributes) {
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
  document.documentElement.lang = "fr";
  access.open = true;
  style.innerHTML = "";
  while (access.firstElementChild) access.firstElementChild.remove()
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
        access.open = false;
        break;
      case "all":
        access.setAttribute("all", "");
        break;
      case "dyslexic-font":
        access.setAttribute("dyslexic-font", "");
        break;
      case "invert-colors":
        access.setAttribute("dyslexic-font", "");
        access.setAttribute("invert-colors", "");
        break;
      case "contrast":
        access.setAttribute("dyslexic-font", "");
        access.setAttribute("invert-colors", "");
        access.setAttribute("contrast", "");
        break;
      case "font-size":
        access.setAttribute("dyslexic-font", "");
        access.setAttribute("invert-colors", "");
        access.setAttribute("contrast", "");
        access.setAttribute("font-size", "");
        break;
      case "line-height":
        access.setAttribute("dyslexic-font", "");
        access.setAttribute("invert-colors", "");
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
        document.documentElement.lang = "en";
        break;
      case "position":
        access.setAttribute("all", "");
        style.innerHTML = `
          access-settings {
            top:5px;
            right:5px;
          }
        `
        break;
      case "icon":
        access.setAttribute("all", "");
        style.innerHTML = `
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
    }
  });
}

let options = {
  root: null,
  rootMargin: "-40% 0px -60% 0px"
};

const observer = new IntersectionObserver(handleIntersect, options);

for (const section of sections) {
  observer.observe(section);
}