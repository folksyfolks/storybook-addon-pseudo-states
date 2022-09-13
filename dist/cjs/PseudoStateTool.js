"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PseudoStateTool = void 0;

var _react = _interopRequireWildcard(require("react"));

var _api = require("@storybook/api");

var _components = require("@storybook/components");

var _theming = require("@storybook/theming");

var _constants = require("./constants");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const LinkTitle = _theming.styled.span(_ref => {
  let {
    active
  } = _ref;
  return {
    color: active ? _theming.color.secondary : "inherit"
  };
});

const LinkIcon = (0, _theming.styled)(_components.Icons)(_ref2 => {
  let {
    active
  } = _ref2;
  return {
    opacity: active ? 1 : 0,
    path: {
      fill: active ? _theming.color.secondary : "inherit"
    }
  };
});
const options = Object.keys(_constants.PSEUDO_STATES).sort();

const PseudoStateTool = () => {
  const [{
    pseudo
  }, updateGlobals] = (0, _api.useGlobals)();
  const isActive = (0, _react.useCallback)(option => (pseudo === null || pseudo === void 0 ? void 0 : pseudo[option]) === true, [pseudo]);
  const toggleOption = (0, _react.useCallback)(option => () => updateGlobals({
    pseudo: { ...pseudo,
      [option]: !isActive(option)
    }
  }), [pseudo]);
  return /*#__PURE__*/_react.default.createElement(_components.WithTooltip, {
    placement: "top",
    trigger: "click",
    tooltip: () => /*#__PURE__*/_react.default.createElement(_components.TooltipLinkList, {
      links: options.map(option => ({
        id: option,
        title: /*#__PURE__*/_react.default.createElement(LinkTitle, {
          active: isActive(option)
        }, ":", _constants.PSEUDO_STATES[option]),
        right: /*#__PURE__*/_react.default.createElement(LinkIcon, {
          icon: "check",
          width: 12,
          height: 12,
          active: isActive(option)
        }),
        onClick: toggleOption(option),
        active: isActive(option)
      }))
    })
  }, /*#__PURE__*/_react.default.createElement(_components.IconButton, {
    key: "pseudo-state",
    title: "Select CSS pseudo states",
    active: options.some(isActive)
  }, /*#__PURE__*/_react.default.createElement(_components.Icons, {
    icon: "button"
  })));
};

exports.PseudoStateTool = PseudoStateTool;