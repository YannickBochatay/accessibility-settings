import { settings } from "../src/index.js";

QUnit.module('component', hooks => {

  let access;

  hooks.before(() => {
    access = document.createElement("access-settings");
    document.querySelector("#qunit-fixture").append(access);
    access.setAttribute("all", "");
    access.open = true;
  })

  hooks.beforeEach(() => settings.reset());

  hooks.after(() => access.remove());

  QUnit.test('change dyslexic font field should change preference', assert => {
    const input = access.shadowRoot.querySelector("#dyslexic-font");
    
    assert.strictEqual(settings.dyslexicFont, false);
    assert.strictEqual(input.checked, false);
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.dyslexicFont, true);
    input.checked = false;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.dyslexicFont, false);
  });

  QUnit.test('change invert colors field should change preference', assert => {
    const input = access.shadowRoot.querySelector("#inverted-colors");
    
    assert.strictEqual(settings.invertedColors, false);
    assert.strictEqual(input.checked, false);
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.invertedColors, true);
    input.checked = false;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.invertedColors, false);
  });

  QUnit.test('change contrast field should change preference', assert => {
    const input = access.shadowRoot.querySelector("#contrast");
    
    assert.strictEqual(settings.contrast, 100);
    assert.strictEqual(input.checked, false);
    input.value = 120;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.contrast, 120);
    input.value = 100;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.contrast, 100);
  });

  QUnit.test('change font size field should change preference', assert => {
    const input = access.shadowRoot.querySelector("#font-size");
    
    assert.strictEqual(settings.fontSize, 16);
    assert.strictEqual(input.checked, false);
    input.value = 18;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.fontSize, 18);
    input.value = 16;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.fontSize, 16);
  });

  QUnit.test('change line height field should change preference', assert => {
    const input = access.shadowRoot.querySelector("#line-height");
    
    assert.closeTo(settings.lineHeight, 1.2, 0.2);
    assert.strictEqual(input.checked, false);
    input.value = 2;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.lineHeight, 2);
    input.value = 1.5;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(settings.lineHeight, 1.5);
  });
});