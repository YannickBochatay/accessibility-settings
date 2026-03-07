import { saveConfig, loadConfig, removeConfig } from "../src/localStorage.js";
import { settings } from "../src/settings.js";

QUnit.module('local storage', () => {

  QUnit.test('load config should return null', assert => {
    removeConfig();
    assert.strictEqual(loadConfig(), null);
  });

  QUnit.test('load config should return settings saved', assert => {
    removeConfig();
    settings.fontSize = 20;
    settings.dyslexicFont = true;
    settings.lineHeight = 1.8;
    settings.invertedColors = false;
    settings.contrast = 120;

    saveConfig();
    const config = loadConfig();
    assert.strictEqual(config.fontSize, 20);
    assert.strictEqual(config.dyslexicFont, true);
    assert.strictEqual(config.lineHeight, 1.8);
    assert.strictEqual(config.invertedColors, false);
    assert.strictEqual(config.contrast, 120);
  });

  QUnit.test("load config should return null after removing", assert => {
    removeConfig();
    assert.strictEqual(loadConfig(), null);
  })

});