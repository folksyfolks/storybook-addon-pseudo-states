"use strict";

var _splitSelectors = require("./splitSelectors");

describe("splitSelectors", () => {
  test("handles basic selectors", () => {
    expect((0, _splitSelectors.splitSelectors)(".a")).toEqual([".a"]);
    expect((0, _splitSelectors.splitSelectors)(".a, .b")).toEqual([".a", ".b"]);
  });
  test("supports ::slotted and :is", () => {
    expect((0, _splitSelectors.splitSelectors)("::slotted(:is(button, a):active)")).toEqual(["::slotted(:is(button, a):active)"]);
    expect((0, _splitSelectors.splitSelectors)("::slotted(:is(button, a):active), ::slotted(:is(button, a):hover)")).toEqual(["::slotted(:is(button, a):active)", "::slotted(:is(button, a):hover)"]);
  });
  test("supports :host", () => {
    expect((0, _splitSelectors.splitSelectors)(":host([type='secondary']) ::slotted(:is(button, a)), :host([type='primary']) ::slotted(:is(button, a):active)")).toEqual([":host([type='secondary']) ::slotted(:is(button, a))", ":host([type='primary']) ::slotted(:is(button, a):active)"]);
    expect((0, _splitSelectors.splitSelectors)(":host([outline]) ::slotted(:is(button, a):focus-within:focus-visible:not(:active))")).toEqual([":host([outline]) ::slotted(:is(button, a):focus-within:focus-visible:not(:active))"]);
  });
});