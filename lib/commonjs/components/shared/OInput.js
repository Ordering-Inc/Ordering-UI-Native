"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _OIcon = _interopRequireDefault(require("./OIcon"));

var _theme = require("../../theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
    background-color: ${_theme.colors.backgroundLight};
    border-radius: 25px;
    border-width: 1px;
    padding-horizontal: 16px;
    height: 50px;
    flex-direction: row;
    align-items: center;
`;
const Input = _native.default.TextInput`
    flex-grow: 1;
    min-height: 30px;
    font-size: 15px;
    font-family: 'Poppins-Regular';
`;

const OInput = props => {
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: {
      backgroundColor: props.bgColor,
      borderColor: props.borderColor,
      ...props.style
    }
  }, props.icon ? /*#__PURE__*/React.createElement(_OIcon.default, {
    src: props.icon,
    color: props.iconColor,
    width: 20,
    height: 20,
    style: {
      marginHorizontal: 10
    }
  }) : null, /*#__PURE__*/React.createElement(Input, {
    secureTextEntry: props.isSecured,
    onChangeText: txt => props.onChange(txt),
    defaultValue: props.value,
    placeholder: props.placeholder ? props.placeholder : ''
  }));
};

OInput.defaultProps = {
  iconColor: '#959595',
  bgColor: 'white',
  borderColor: 'white'
};
var _default = OInput;
exports.default = _default;
//# sourceMappingURL=OInput.js.map