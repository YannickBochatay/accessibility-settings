// nom pour le stockage des données dans le localStorage
const STORAGE_NAME = "preferences";

// raccourci pour l'élément racine html du document
const root = document.documentElement;

/**
 * Récupère la taille initiale de la police dans le document HTML
 * @returns {number} taille de la police en pixels
 */
function getInitialFontSize() {
  let fontSize = getComputedStyle(root).fontSize;
  return Number.parseInt(fontSize);
}

/**
 * Récupère la hauteur de ligne initiale dans le document HTML
 * @returns {number} hauteur de la ligne (ratio par rapport à la taille de police)
 */
function getInitialLineHeight() {
  let lineHeight = getComputedStyle(root).lineHeight;
  return Number.parseInt(lineHeight) / getInitialFontSize();
}

/**
 * Valeurs initiales naturelles des préférences
 */
const initialPrefs = {
  dyslexicFont : false,
  invertedColors : false,
  fontSize : getInitialFontSize(),
  lineHeight : getInitialLineHeight()
};

/**
 * Création d'un proxy pour mettre à jour le document
 * à chaque fois que l'on modifie une préférence
 */
const prefs = new Proxy(initialPrefs, {
  set(obj, prop, value) {

    if (prop === "dyslexicFont") {
      if (value) root.classList.add("dyslexic");
      else root.classList.remove("dyslexic");

    } else if (prop === "invertedColors") {
      if (value) root.classList.add("invertedColors");
      else root.classList.remove("invertedColors");

    } else if (prop === "fontSize") {
      root.style.fontSize = value + "px";

    } else if (prop === "lineHeight") {
      root.style.lineHeight = value;
    }

    obj[prop] = value;
    localStorage.setItem(STORAGE_NAME, JSON.stringify(obj));
    return true;
  }
});

// copie des préférences par défaut pour pouvoir réinitialiser les valeurs
const defaultPrefs = { ...initialPrefs };

export function resetPrefs() {
  for (let key in defaultPrefs) {
    prefs[key] = defaultPrefs[key];
  }
}

/**
 * Récupération des préférences stockées sur le localStorage
 * (en cas de visite précédente et de modifications de celles-ci)
 */
const storedData = localStorage.getItem(STORAGE_NAME);

// si des données sont récupérées on écrase les valeurs initiales
if (storedData) {
  const data = JSON.parse(storedData);

  for (let key in data) {
    prefs[key] = data[key];
  }
}

export default prefs;