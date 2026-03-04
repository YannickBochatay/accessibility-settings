import { AccessSettings } from "../src/index.js";

QUnit.module('component', hooks => {

  let access;

  hooks.before(() => {
    document.documentElement.lang = "oc";
    access = document.createElement("access-settings");
    document.querySelector("#qunit-fixture").append(access);

    AccessSettings.languages.oc = {
      "dyslexic-font": "Poliça disléxica",
      "inverted-colors": "Colors invertidas",
      "contrast": "Contraste",
      "font-size": "Talha de poliça",
      "line-height": "Nautor de linha",
      "reset": "Reïnicializar",
      "close": "Tampar"
    };
  })

  hooks.after(() => access.remove());

  QUnit.test('change html lang attribute should change content', assert => {
    const input = access.shadowRoot.querySelector("div[part=dyslexic-font]");
    assert.strictEqual(input.textContent.trim(), "Poliça disléxica");
  });

});