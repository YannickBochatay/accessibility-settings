import { preferences, getInitialFontSize, getInitialLineHeight } from "../src/preferences.js";
import "../src/globalStyles.js";

QUnit.module('initial state', () => {

  const style = document.createElement("style");
  document.head.append(style);

  QUnit.test('initial font-size', assert => {

    assert.strictEqual(getInitialFontSize(), 16);

    style.innerHTML = /*css*/`:root { font-size:100%; }`;
    assert.strictEqual(getInitialFontSize(), 16);

    style.innerHTML = /*css*/`:root { font-size:small; }`;
    assert.strictEqual(getInitialFontSize(), 13);

    style.innerHTML = /*css*/`:root { font-size:16px; }`;
    assert.strictEqual(getInitialFontSize(), 16);
  });

  QUnit.test("initial line height", assert => {

    assert.closeTo(getInitialLineHeight(), 1.2, 0.2);

    style.innerHTML = /*css*/`:root { line-height:1.5; }`;
    assert.strictEqual(getInitialLineHeight(), 1.5);

    style.innerHTML = /*css*/`:root { line-height:normal; }`;
    assert.closeTo(getInitialLineHeight(), 1.2, 2);

    style.innerHTML = /*css*/`:root { line-height:normal; } p#p-access-test { line-height:normal; }`;
    assert.closeTo(getInitialLineHeight(), 1.2, 0.2);
  })
});

QUnit.module('change state', () => {

  const root = document.documentElement;
  const style = getComputedStyle(root);

  QUnit.test("change font", assert => {
    assert.strictEqual(root.classList.contains("dyslexic"), false);

    preferences.dyslexicFont = true;
    assert.strictEqual(root.classList.contains("dyslexic"), true);
    assert.strictEqual(style.fontFamily.includes("open-dyslexic"), true);

    preferences.dyslexicFont = false;
    assert.strictEqual(root.classList.contains("dyslexic"), false);
    assert.strictEqual(style.fontFamily.includes("open-dyslexic"), false);
  });

  QUnit.test("change colors", assert => {
    assert.strictEqual(root.classList.contains("invertedColors"), false);
    assert.strictEqual(style.filter.includes("invert(1)"), false);

    preferences.invertedColors = true;
    assert.strictEqual(root.classList.contains("invertedColors"), true);
    assert.strictEqual(style.filter.includes("invert(1)"), true);

    preferences.invertedColors = false;
    assert.strictEqual(root.classList.contains("invertedColors"), false);
    assert.strictEqual(style.filter.includes("invert(1)"), false);
  });

  QUnit.test("change contrast", assert => {
    assert.strictEqual(root.classList.contains("contrasted"), false);
    assert.strictEqual(style.filter.includes("contrast(1)"), false);

    preferences.contrast = 120;
    assert.strictEqual(root.classList.contains("contrasted"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-contrast"), "120%");
    assert.strictEqual(style.filter.includes("contrast(1.2)"), true);

    preferences.contrast = 100;
    assert.strictEqual(root.classList.contains("contrasted"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-contrast"), "100%");
    assert.strictEqual(style.filter.includes("contrast(1)"), true);
  });

  QUnit.test("change font size", assert => {
    assert.strictEqual(root.classList.contains("fontSize"), false);
    assert.strictEqual(style.fontSize, "16px");

    preferences.fontSize = 18;
    assert.strictEqual(root.classList.contains("fontSize"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-font-size"), "18px");
    assert.strictEqual(style.fontSize, "18px");

    preferences.fontSize = 16;
    assert.strictEqual(root.classList.contains("fontSize"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-font-size"), "16px");
    assert.strictEqual(style.fontSize, "16px");
  });

  QUnit.test("change line height", assert => {
    assert.strictEqual(root.classList.contains("lineHeight"), false);
    assert.strictEqual(style.lineHeight, "normal");

    preferences.lineHeight = 2;
    assert.strictEqual(root.classList.contains("lineHeight"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-line-height"), "2");
    assert.strictEqual(style.lineHeight, "32px");

    preferences.lineHeight = 1.5;
    assert.strictEqual(root.classList.contains("lineHeight"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-line-height"), "1.5");
    assert.strictEqual(style.lineHeight, "24px");
  });

});