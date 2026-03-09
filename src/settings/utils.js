const root = document.documentElement;

export function getInitialFontSize(elmt = root) {
  let fontSize = getComputedStyle(elmt).fontSize;
  return Number.parseInt(fontSize);
}

export function getInitialLineHeight(elmt = root) {
  let lineHeight = getComputedStyle(elmt).lineHeight;

  if (!isNaN(lineHeight)) return Number(lineHeight);

  let value = Number.parseInt(lineHeight);

  if (Number.isNaN(value)) {
    if (elmt === root) {
      let p = document.createElement("p");
      p.style.margin = 0;
      p.style.border = "none";
      p.style.padding = 0;
      p.textContent = "toto";
      document.body.appendChild(p);
      let lineHeight = getInitialLineHeight(p);
      p.remove();
      return lineHeight;
    } else {
      value = elmt.getBoundingClientRect().height;
    }
  }

  return Math.round(value * 10 / getInitialFontSize()) / 10;
}

export function toDashCase(str) {
  return str.replaceAll(/[A-Z]/g, m => '-' + m.toLowerCase());
}