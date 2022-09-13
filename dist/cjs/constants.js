"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOOL_ID = exports.PSEUDO_STATES = exports.ADDON_ID = void 0;
const ADDON_ID = "storybook/pseudo-states";
exports.ADDON_ID = ADDON_ID;
const TOOL_ID = `${ADDON_ID}/tool`; // Dynamic pseudo-classes
// @see https://www.w3.org/TR/2018/REC-selectors-3-20181106/#dynamic-pseudos

exports.TOOL_ID = TOOL_ID;
const PSEUDO_STATES = {
  hover: "hover",
  active: "active",
  focusVisible: "focus-visible",
  focusWithin: "focus-within",
  focus: "focus",
  // must come after its alternatives
  visited: "visited",
  link: "link",
  target: "target"
};
exports.PSEUDO_STATES = PSEUDO_STATES;