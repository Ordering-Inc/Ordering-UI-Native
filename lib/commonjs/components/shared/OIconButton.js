"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _theme = require("../../theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.TouchableOpacity`
    height: 40px;
    border-radius: 20px;
    flex-direction: row;
    border: 1px solid white;
    padding-horizontal: 20px;
    align-items: center;
    justify-content: center;
`;
const DisabledWrapper = _native.default.View`
    height: 40px;
    border-radius: 20px;
    flex-direction: row;
    border: 1px solid white;
    padding-horizontal: 20px;
    align-items: center;
    justify-content: center;
`;
const Icon = _native.default.Image`
    resize-mode: contain;
    width: 22px;
    height: 22px;
`;
const Title = _native.default.Text`
    font-size: 16px;
    margin-horizontal: 7px;
`;

const OIconButton = props => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, !props.disabled ? /*#__PURE__*/React.createElement(Wrapper, {
    onPress: props.onClick,
    style: {
      borderColor: props.borderColor || props.color,
      backgroundColor: props.isOutline ? 'white' : props.bgColor || props.color,
      height: props.height || 40,
      borderRadius: props.height ? props.height * 0.5 : 20,
      ...props.style
    }
  }, props.icon ? /*#__PURE__*/React.createElement(Icon, {
    source: props.icon,
    style: {
      tintColor: props.iconColor,
      ...props.iconStyle
    }
  }) : null, props.title ? /*#__PURE__*/React.createElement(Title, {
    style: {
      color: props.textColor || props.color,
      ...props.textStyle
    }
  }, props.title) : null) : /*#__PURE__*/React.createElement(DisabledWrapper, {
    style: {
      borderColor: _theme.colors.backgroundDark,
      backgroundColor: _theme.colors.backgroundDark,
      height: props.height || 40,
      borderRadius: props.height ? props.height * 0.5 : 20,
      ...props.style
    }
  }, props.icon ? /*#__PURE__*/React.createElement(Icon, {
    source: props.icon,
    style: {
      tintColor: props.iconColor,
      ...props.iconStyle
    }
  }) : null, props.title ? /*#__PURE__*/React.createElement(Title, {
    style: {
      color: props.textColor || props.color,
      ...props.textStyle
    }
  }, props.title) : null));
};

OIconButton.defaultProps = {};
var _default = OIconButton;
exports.default = _default;
//# sourceMappingURL=OIconButton.js.map