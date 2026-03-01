import { saveConfig, loadConfig, removeConfig } from "../src/localStorage.js";
import { preferences } from "../src/preferences.js";

QUnit.module('local storage', () => {

  QUnit.test('load config should return null', assert => {
    removeConfig();
    assert.strictEqual(loadConfig(), null);
  });

  QUnit.test('load config should return preferences saved', assert => {
    removeConfig();
    preferences.fontSize = 20;
    preferences.dyslexicFont = true;
    preferences.lineHeight = 1.8;
    preferences.invertedColors = false;
    preferences.contrast = 120;

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