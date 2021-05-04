"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _shared = require("./shared");

var _OKeyButton = _interopRequireDefault(require("./shared/OKeyButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const KeyWrapper = _native.default.View`
    background-color: #F0F0F0C2;
    height: 280px;
    padding: 7px;
    margin-bottom: 64px;
`;
const KeyRow = _native.default.View`
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 7px;
`;
const BtnDel = _native.default.TouchableOpacity`
    flex: 0.32;
    height: 50px;
    align-items: center;
    justify-content: center;
`;

const NumberKey = props => {
  const onChange = val => {
    props.onChangeValue(val);
  };

  return /*#__PURE__*/React.createElement(KeyWrapper, null, /*#__PURE__*/React.createElement(KeyRow, null, /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '1',
    onClick: () => onChange(1),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '2',
    onClick: () => onChange(2),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '3',
    onClick: () => onChange(3),
    style: {
      flex: 0.32
    }
  })), /*#__PURE__*/React.createElement(KeyRow, null, /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '4',
    onClick: () => onChange(4),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '5',
    onClick: () => onChange(5),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '6',
    onClick: () => onChange(6),
    style: {
      flex: 0.32
    }
  })), /*#__PURE__*/React.createElement(KeyRow, null, /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '7',
    onClick: () => onChange(7),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '8',
    onClick: () => onChange(8),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '9',
    onClick: () => onChange(9),
    style: {
      flex: 0.32
    }
  })), /*#__PURE__*/React.createElement(KeyRow, null, /*#__PURE__*/React.createElement(_OKeyButton.default, {
    style: {
      flex: 0.32,
      backgroundColor: 'transparent'
    }
  }), /*#__PURE__*/React.createElement(_OKeyButton.default, {
    title: '0',
    onClick: () => onChange(0),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(BtnDel, {
    onPress: () => onChange(-1)
  }, /*#__PURE__*/React.createElement(_shared.OIcon, {
    src: require('../assets/icons/delete.png')
  }))));
};

var _default = NumberKey;
exports.default = _default;
//# sourceMappingURL=NumberKey.js.map