"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withPseudoState = void 0;

var _addons = require("@storybook/addons");

var _coreEvents = require("@storybook/core-events");

var _constants = require("./constants");

var _rewriteStyleSheet = require("./rewriteStyleSheet");

/* eslint-env browser */
const channel = _addons.addons.getChannel();

const shadowHosts = new Set(); // Drops any existing pseudo state classnames that carried over from a previously viewed story
// before adding the new classnames. We do this the old-fashioned way, for IE compatibility.

const applyClasses = (element, classnames) => {
  element.className = element.className.split(" ").filter(classname => classname && classname.indexOf("pseudo-") !== 0).concat(...classnames).join(" ");
};

const applyParameter = (rootElement, parameter) => {
  const map = new Map([[rootElement, new Set()]]);

  const add = (target, state) => map.set(target, new Set([...(map.get(target) || []), state]));

  Object.entries(parameter || {}).forEach(_ref => {
    let [state, value] = _ref;

    if (typeof value === "boolean") {
      // default API - applying pseudo class to root element.
      add(rootElement, value && state);
    } else if (typeof value === "string") {
      // explicit selectors API - applying pseudo class to a specific element
      rootElement.querySelectorAll(value).forEach(el => add(el, state));
    } else if (Array.isArray(value)) {
      // explicit selectors API - we have an array (of strings) recursively handle each one
      value.forEach(sel => rootElement.querySelectorAll(sel).forEach(el => add(el, state)));
    }
  });
  map.forEach((states, target) => {
    const classnames = [];
    states.forEach(key => _constants.PSEUDO_STATES[key] && classnames.push(`pseudo-${_constants.PSEUDO_STATES[key]}`));
    applyClasses(target, classnames);
  });
}; // Traverses ancestry to collect relevant pseudo classnames, and applies them to the shadow host.
// Shadow DOM can only access classes on its host. Traversing is needed to mimic the CSS cascade.


const updateShadowHost = shadowHost => {
  const classnames = new Set();

  for (let element = shadowHost.parentElement; element; element = element.parentElement) {
    if (!element.className) continue;
    element.className.split(" ").filter(classname => classname.indexOf("pseudo-") === 0).forEach(classname => classnames.add(classname));
  }

  applyClasses(shadowHost, classnames);
}; // Global decorator that rewrites stylesheets and applies classnames to render pseudo styles


const withPseudoState = (StoryFn, _ref2) => {
  let {
    viewMode,
    parameters,
    id,
    globals: globalsArgs
  } = _ref2;
  const {
    pseudo: parameter
  } = parameters;
  const {
    pseudo: globals
  } = globalsArgs; // Sync parameter to globals, used by the toolbar (only in canvas as this
  // doesn't make sense for docs because many stories are displayed at once)

  (0, _addons.useEffect)(() => {
    if (parameter !== globals && viewMode === "story") {
      channel.emit(_coreEvents.UPDATE_GLOBALS, {
        globals: {
          pseudo: parameter
        }
      });
    }
  }, [parameter, viewMode]); // Convert selected states to classnames and apply them to the story root element.
  // Then update each shadow host to redetermine its own pseudo classnames.

  (0, _addons.useEffect)(() => {
    const timeout = setTimeout(() => {
      const element = document.getElementById(viewMode === "docs" ? `story--${id}` : `root`);
      applyParameter(element, globals || parameter);
      shadowHosts.forEach(updateShadowHost);
    }, 0);
    return () => clearTimeout(timeout);
  }, [globals, parameter, viewMode]);
  return StoryFn();
}; // Rewrite CSS rules for pseudo-states on all stylesheets to add an alternative selector


exports.withPseudoState = withPseudoState;

const rewriteStyleSheets = shadowRoot => {
  var _shadowRoot$adoptedSt;

  let styleSheets = shadowRoot ? shadowRoot.styleSheets : document.styleSheets;
  if (shadowRoot !== null && shadowRoot !== void 0 && (_shadowRoot$adoptedSt = shadowRoot.adoptedStyleSheets) !== null && _shadowRoot$adoptedSt !== void 0 && _shadowRoot$adoptedSt.length) styleSheets = shadowRoot.adoptedStyleSheets;
  Array.from(styleSheets).forEach(sheet => (0, _rewriteStyleSheet.rewriteStyleSheet)(sheet, shadowRoot, shadowHosts));
}; // Only track shadow hosts for the current story


channel.on(_coreEvents.STORY_CHANGED, () => shadowHosts.clear()); // Reinitialize CSS enhancements every time the story changes

channel.on(_coreEvents.STORY_RENDERED, () => rewriteStyleSheets()); // Reinitialize CSS enhancements every time a docs page is rendered

channel.on(_coreEvents.DOCS_RENDERED, () => rewriteStyleSheets()); // IE doesn't support shadow DOM

if (Element.prototype.attachShadow) {
  // Monkeypatch the attachShadow method so we can handle pseudo styles inside shadow DOM
  Element.prototype._attachShadow = Element.prototype.attachShadow;

  Element.prototype.attachShadow = function attachShadow(init) {
    // Force "open" mode, so we can access the shadowRoot
    const shadowRoot = this._attachShadow({ ...init,
      mode: "open"
    }); // Wait for it to render and apply its styles before rewriting them


    requestAnimationFrame(() => {
      rewriteStyleSheets(shadowRoot);
      updateShadowHost(shadowRoot.host);
    });
    return shadowRoot;
  };
}