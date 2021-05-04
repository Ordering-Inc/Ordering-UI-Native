"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
    flex-direction: row;
`;
const Icon = _native.default.Image`
    resize-mode: contain;
    tint-color: black;
    margin-right: 3px;
`;
const Label = _native.default.Text`
    flex-wrap: wrap;
    color: black;
    font-size: 14px;
    font-family: 'Poppins-Regular';
`;

const OIconText = props => {
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props.style
  }, props.icon ? /*#__PURE__*/React.createElement(Icon, {
    source: props.icon,
    style: {
      width: props.size ? props.size : 18,
      height: props.size ? props.size : 18,
      tintColor: props.color,
      ...props.imgStyle
    }
  }) : null, /*#__PURE__*/React.createElement(Label, {
    style: {
      fontSize: props.size ? props.size : 14,
      color: props.color,
      ...props.textStyle
    }
  }, props.text));
};

OIconText.defaultProps = {};
var _default = OIconText;
exports.default = _default;
//# sourceMappingURL=OIconText.js.map