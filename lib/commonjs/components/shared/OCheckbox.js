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

const Wrapper = _native.default.View`

`;
const Inner = _native.default.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;
const Box = _native.default.View`
    width: 20px;
    height: 20px;
    border: 1px solid grey;
    margin-right: 8px;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
`;
const Check = _native.default.View`
    width: 12px;
    height: 7px;
    transform: rotate(-45deg);
    border: 3px solid grey;
    border-top-width: 0;
    border-right-width: 0;
    margin-top: -2px;
`;
const Title = _native.default.Text`
    font-family: 'Poppins-Regular';
`;

const OCheckbox = props => {
  const [is_checked, onChanged] = React.useState(props.checked);

  const checkToggle = state => {
    onChanged(!state);
    props.onChange(!state);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Inner, {
    onPress: () => checkToggle(is_checked || false)
  }, /*#__PURE__*/React.createElement(Box, {
    style: {
      backgroundColor: is_checked ? _theme.colors.primary : 'white',
      borderColor: is_checked ? _theme.colors.primary : props.checkColor,
      width: props.size ? props.size + 5 : 20,
      height: props.size ? props.size + 5 : 20
    }
  }, is_checked ? /*#__PURE__*/React.createElement(Check, {
    style: {
      borderColor: 'white'
    }
  }) : null), /*#__PURE__*/React.createElement(Title, {
    style: {
      color: props.textColor,
      fontSize: props.size
    }
  }, props.label ? props.label : ''))));
};

OCheckbox.defaultProps = {
  checkColor: 'grey',
  textColor: 'black'
};
var _default = OCheckbox;
exports.default = _default;
//# sourceMappingURL=OCheckbox.js.map