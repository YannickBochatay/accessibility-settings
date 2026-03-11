import { settings } from "../src/settings/index.js";

QUnit.module('change state', hooks => {

  const root = document.documentElement;
  const style = getComputedStyle(root);

  hooks.before(() => settings.reset());
  hooks.after(() => settings.reset());

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

  QUnit.test("add and remove event listeners", assert => {
    let cpt = 0;

    function increment() { cpt++; }
    settings.addEventListener("change", increment);

    settings.fontSize = 13;

    assert.strictEqual(cpt, 1, "should increment");

    settings.addEventListener("change", increment);
    settings.fontSize = 14;
    assert.strictEqual(cpt, 2, "duplicate listeners should not be added");

    settings.fontSize = 14;
    assert.strictEqual(cpt, 2, "same value should not trigger event");

    settings.removeEventListener("change", increment);
    settings.fontSize = 16;
    assert.strictEqual(cpt, 2, "listeners can be removed");

    settings.addEventListener("change-inverted-colors", increment);
    settings.fontSize = 16;
    assert.strictEqual(cpt, 2, "specific listeners should not interfer others");
    settings.invertedColors = true;
    assert.strictEqual(cpt, 3, "specific listeners should work");
    settings.invertedColors = true;
    assert.strictEqual(cpt, 3, "same value should not trigger specific listener");
  });

  QUnit.test("reset prop", assert => {
    settings.fontSize = 13;
    settings.lineHeight = 1.8;
    settings.dyslexicFont = true;
    settings.contrast = 100;
    settings.invertedColors = true;

    settings.reset("fontSize");
    assert.strictEqual(settings.fontSize, settings.initialValues.fontSize);
    assert.strictEqual(settings.lineHeight, 1.8, "specific reset should not interfer with other properties");

    for (const prop in settings.initialValues) {
      settings.reset(prop);
      assert.strictEqual(settings[prop], settings.initialValues[prop]);
    }
  });

  QUnit.test("reset all", assert => {
    settings.fontSize = 13;
    settings.lineHeight = 1.8;
    settings.dyslexicFont = true;
    settings.contrast = 100;
    settings.invertedColors = true;

    settings.reset();

    for (const prop in settings.initialValues) {
      assert.strictEqual(settings[prop], settings.initialValues[prop]);
    }
  });

  QUnit.test("throw errors when wrong values", assert => {

    assert.throws(() => settings.fontSize = "13");
    assert.throws(() => settings.fontSize = "toto");
    assert.throws(() => settings.fontSize = true);
    assert.throws(() => settings.fontSize = null);
    assert.throws(() => settings.fontSize = undefined);
    assert.throws(() => settings.fontSize = {});

    assert.throws(() => settings.lineHeight = "1.3");
    assert.throws(() => settings.lineHeight = "toto");
    assert.throws(() => settings.lineHeight = true);
    assert.throws(() => settings.lineHeight = null);
    assert.throws(() => settings.lineHeight = undefined);
    assert.throws(() => settings.lineHeight = {});

    assert.throws(() => settings.contrast = "120");
    assert.throws(() => settings.contrast = "toto");
    assert.throws(() => settings.contrast = true);
    assert.throws(() => settings.contrast = null);
    assert.throws(() => settings.contrast = undefined);
    assert.throws(() => settings.contrast = {});

    assert.throws(() => settings.dyslexicFont = "true");
    assert.throws(() => settings.dyslexicFont = 1);
    assert.throws(() => settings.dyslexicFont = "toto");
    assert.throws(() => settings.dyslexicFont = null);
    assert.throws(() => settings.dyslexicFont = undefined);
    assert.throws(() => settings.dyslexicFont = {});

    assert.throws(() => settings.invertedColors = "true");
    assert.throws(() => settings.invertedColors = 1);
    assert.throws(() => settings.invertedColors = "toto");
    assert.throws(() => settings.invertedColors = null);
    assert.throws(() => settings.invertedColors = undefined);
    assert.throws(() => settings.invertedColors = {});

  });

  QUnit.test("throw errors when out of bounds", assert => {

    assert.throws(() => settings.fontSize = settings.bounds.fontSize[0] - 1);
    assert.throws(() => settings.fontSize = settings.bounds.fontSize[1] + 1);
    assert.throws(() => settings.contrast = settings.bounds.contrast[0] - 1);
    assert.throws(() => settings.contrast = settings.bounds.contrast[1] + 1);
    assert.throws(() => settings.lineHeight = settings.bounds.lineHeight[0] - 0.1);
    assert.throws(() => settings.lineHeight = settings.bounds.lineHeight[1] + 0.1);

  });

  QUnit.test("toggle class important", assert => {
    assert.strictEqual(settings.important, false);
    assert.strictEqual(root.classList.contains("important"), false);
    settings.important = true;
    assert.strictEqual(root.classList.contains("important"), true);
    settings.important = false;
    assert.strictEqual(root.classList.contains("important"), false);

    assert.throws(() => settings.important = "yes");
  })

});