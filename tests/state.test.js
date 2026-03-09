import { settings } from "../src/settings/index.js";
import { getInitialFontSize, getInitialLineHeight } from "../src/settings/utils.js"

QUnit.module('initial state', hooks => {

  let style

  hooks.before(() => {
    style = document.createElement("style");
    document.head.append(style);
  });

  hooks.beforeEach(() => settings.reset());

  hooks.after(() => style.remove());

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

QUnit.module('change state', hooks => {

  const root = document.documentElement;
  const style = getComputedStyle(root);

  hooks.before(() => settings.reset());

  QUnit.test("change font", assert => {
    assert.strictEqual(root.classList.contains("dyslexicFont"), false);

    settings.dyslexicFont = true;
    assert.strictEqual(root.classList.contains("dyslexicFont"), true);
    assert.strictEqual(style.fontFamily.includes("open-dyslexic"), true);

    settings.dyslexicFont = false;
    assert.strictEqual(root.classList.contains("dyslexicFont"), false);
    assert.strictEqual(style.fontFamily.includes("open-dyslexic"), false);
  });

  QUnit.test("change colors", assert => {
    assert.strictEqual(root.classList.contains("invertedColors"), false);
    assert.strictEqual(style.filter.includes("invert(1)"), false);

    settings.invertedColors = true;
    assert.strictEqual(root.classList.contains("invertedColors"), true);
    assert.strictEqual(style.filter.includes("invert(1)"), true);

    settings.invertedColors = false;
    assert.strictEqual(root.classList.contains("invertedColors"), false);
    assert.strictEqual(style.filter.includes("invert(1)"), false);
  });

  QUnit.test("change contrast", assert => {
    assert.strictEqual(root.classList.contains("contrast"), false);
    assert.strictEqual(style.filter.includes("contrast(1)"), false);

    settings.contrast = 120;
    assert.strictEqual(root.classList.contains("contrast"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-contrast"), "120%");
    assert.strictEqual(style.filter.includes("contrast(1.2)"), true);

    settings.contrast = 100;
    assert.strictEqual(root.classList.contains("contrast"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-contrast"), "100%");
    assert.strictEqual(style.filter.includes("contrast(1)"), true);
  });

  QUnit.test("change font size", assert => {
    assert.strictEqual(root.classList.contains("fontSize"), false);
    assert.strictEqual(style.fontSize, "16px");

    settings.fontSize = 18;
    assert.strictEqual(root.classList.contains("fontSize"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-font-size"), "18px");
    assert.strictEqual(style.fontSize, "18px");

    settings.fontSize = 16;
    assert.strictEqual(root.classList.contains("fontSize"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-font-size"), "16px");
    assert.strictEqual(style.fontSize, "16px");
  });

  QUnit.test("change line height", assert => {
    assert.strictEqual(root.classList.contains("lineHeight"), false);
    assert.strictEqual(style.lineHeight, "normal");

    settings.lineHeight = 2;
    assert.strictEqual(root.classList.contains("lineHeight"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-line-height"), "2");
    assert.strictEqual(style.lineHeight, "32px");

    settings.lineHeight = 1.5;
    assert.strictEqual(root.classList.contains("lineHeight"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-line-height"), "1.5");
    assert.strictEqual(style.lineHeight, "24px");
  });

});