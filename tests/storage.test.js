import { settings } from "../src/settings/localStorage.js";

QUnit.module('local storage', () => {

  QUnit.test('load config should return null', assert => {
    settings.remove();
    assert.strictEqual(settings.load(), null);
  });

  QUnit.test('load config should return settings saved', assert => {
    settings.remove();
    settings.fontSize = 20;
    settings.dyslexicFont = true;
    settings.lineHeight = 1.8;
    settings.invertedColors = false;
    settings.contrast = 120;

    settings.save();
    const config = settings.load();
    assert.strictEqual(config.fontSize, 20);
    assert.strictEqual(config.dyslexicFont, true);
    assert.strictEqual(config.lineHeight, 1.8);
    assert.strictEqual(config.invertedColors, false);
    assert.strictEqual(config.contrast, 120);
  });

  QUnit.test("load config should return null after removing", assert => {
    settings.remove();
    assert.strictEqual(settings.load(), null);
  })

});