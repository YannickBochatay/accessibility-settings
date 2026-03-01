import { getInitialFontSize, getInitialLineHeight } from "../src/preferences.js";

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