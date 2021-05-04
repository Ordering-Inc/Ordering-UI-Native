"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _constants = require("../../config/constants");

var _theme = require("../../theme");

var _OText = _interopRequireDefault(require("./OText"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
    flex: 1;
    border-radius: 35px;
    min-height: 50px;
    padding-horizontal: 25px;
    padding-vertical: 10px;
    max-width: 80%;
    margin-bottom: 14px;
`;

const OChatBubble = props => {
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props.side == _constants.DIRECTION.RIGHT ? {
      borderBottomRightRadius: 0,
      backgroundColor: props.bgColor ? props.bgColor : _theme.colors.primary,
      alignSelf: 'flex-end'
    } : {
      borderBottomLeftRadius: 0,
      backgroundColor: props.bgColor ? props.bgColor : _theme.colors.backgroundGray,
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(_OText.default, {
    color: props.textColor ? props.textColor : props.side == _constants.DIRECTION.RIGHT ? _theme.colors.white : 'black'
  }, props.contents), /*#__PURE__*/React.createElement(_OText.default, {
    color: props.textColor ? props.textColor : props.side == _constants.DIRECTION.RIGHT ? _theme.colors.white : 'black',
    style: {
      textAlign: 'right'
    },
    size: 9
  }, props.datetime));
};

var _default = OChatBubble;
exports.default = _default;
//# sourceMappingURL=OChatBubble.js.map