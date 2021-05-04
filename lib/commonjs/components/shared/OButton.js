"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _theme = require("../../theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const StyledButton = _native.default.View`
  background-color: ${_theme.colors.primary};
  border-radius: 26px;
  border-width: 2px;
  height: 52px;
  border-color: ${_theme.colors.primary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 2px #00000020;
  elevation: 2;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
`;
const StyledButtonDisabled = (0, _native.default)(StyledButton)`
  background-color: ${_theme.colors.backgroundDark};
  border-color: ${_theme.colors.backgroundDark};
`;
const StyledText = _native.default.Text`
  font-size: 16px;
  color: ${_theme.colors.btnFont};
  margin-left: 10px;
  margin-right: 10px;
  font-family: 'Poppins-Regular';
`;
const StyledTextDisabled = (0, _native.default)(StyledText)`
  color: ${_theme.colors.mediumGray};
`;
const StyledImage = _native.default.Image`
  width: 24px;
  height: 24px;
  resize-mode: contain;
`;
const EndImage = _native.default.Image`
  width: 15px;
  height: 15px;
  resize-mode: contain;
  right 20px;
  position: absolute;
  right: 20px;
`;

const OButton = props => {
  var _props$style;

  if (props.isDisabled) {
    return /*#__PURE__*/React.createElement(_reactNative.View, {
      style: props.parentStyle
    }, /*#__PURE__*/React.createElement(StyledButtonDisabled, {
      style: props.style
    }, /*#__PURE__*/React.createElement(StyledTextDisabled, {
      style: props.textStyle
    }, props.text)));
  }

  if (props.isLoading) {
    return /*#__PURE__*/React.createElement(StyledButton, {
      style: props.style
    }, /*#__PURE__*/React.createElement(_reactNative.ActivityIndicator, {
      size: "small",
      color: props.indicatorColor
    }));
  }

  return /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
    testID: props.testID,
    activeOpacity: props.activeOpacity,
    onPress: props.onClick,
    style: {
      width: props.isCircle ? 52 : (_props$style = props.style) === null || _props$style === void 0 ? void 0 : _props$style.width,
      ...props.parentStyle
    }
  }, /*#__PURE__*/React.createElement(StyledButton, {
    style: props.bgColor ? { ...props.style,
      backgroundColor: props.bgColor,
      borderColor: props.borderColor
    } : props.style
  }, props.imgLeftSrc ? /*#__PURE__*/React.createElement(StyledImage, {
    style: props.imgLeftStyle,
    source: props.imgLeftSrc
  }) : null, props.text ? /*#__PURE__*/React.createElement(StyledText, {
    style: props.textStyle
  }, props.text) : null, props.imgRightSrc ? /*#__PURE__*/React.createElement(EndImage, {
    style: props.imgRightStyle,
    source: props.imgRightSrc
  }) : null));
};

OButton.defaultProps = {
  isLoading: false,
  isDisabled: false,
  indicatorColor: 'white',
  activeOpacity: 0.5,
  imgRightSrc: require('../../assets/icons/arrow_right.png')
};
var _default = OButton;
exports.default = _default;
//# sourceMappingURL=OButton.js.map