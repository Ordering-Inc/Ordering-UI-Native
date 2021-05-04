"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _theme = require("../theme");

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const KindItems = _native.default.View`
    flex: 1;
    padding-vertical: 10px;
`;
const KInner = _native.default.View`
    flex: 1;    
    flex-direction: row;
`;
const KInfoWrap = _native.default.View`
    flex: 1;
    padding-horizontal: 10px;
`;
const KActions = _native.default.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
`;

const OInfoCell = props => {
  return /*#__PURE__*/React.createElement(KindItems, null, /*#__PURE__*/React.createElement(_shared.OText, {
    style: {
      textTransform: 'uppercase',
      marginVertical: 10
    },
    size: 15,
    weight: '500'
  }, props.title), /*#__PURE__*/React.createElement(KInner, null, /*#__PURE__*/React.createElement(_shared.OIcon, {
    url: props.logo,
    dummy: props.dummy,
    style: {
      borderRadius: 12
    },
    width: 100,
    height: 100
  }), /*#__PURE__*/React.createElement(KInfoWrap, null, /*#__PURE__*/React.createElement(_shared.OText, {
    size: 19,
    weight: '500'
  }, props.name), /*#__PURE__*/React.createElement(_shared.OIconText, {
    icon: require('../assets/icons/pin_outline.png'),
    text: props.address
  }), /*#__PURE__*/React.createElement(KActions, null, /*#__PURE__*/React.createElement(_shared.OIconButton, {
    icon: require('../assets/icons/speech-bubble.png'),
    title: 'Chat',
    borderColor: _theme.colors.primary,
    bgColor: 'white',
    onClick: props.onChat
  }), /*#__PURE__*/React.createElement(_shared.OIconButton, {
    icon: require('../assets/icons/phone.png'),
    title: 'Call',
    borderColor: _theme.colors.primary,
    bgColor: 'white',
    style: {
      marginHorizontal: 10
    },
    onClick: props.onCall
  })))));
};

OInfoCell.defaultProps = {};
var _default = OInfoCell;
exports.default = _default;
//# sourceMappingURL=OInfoCell.js.map