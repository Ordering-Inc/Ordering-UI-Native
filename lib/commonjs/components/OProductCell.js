"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _Utilities = require("../providers/Utilities");

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
    flex: 1;
    padding-vertical: 10px;
    flex-direction: row;
    align-items: center;
`;
const PInner = _native.default.View`
    flex: 1;
    flex-grow: 1;
`;
const Price = _native.default.View`
    align-items: flex-start;
`;

const OProductCell = props => {
  const getExtras = options => {
    var str = '';
    options.map(opt => {
      str += opt.name + '\n';
      opt.suboptions.map(s => {
        str += ' ' + s.name + '\n';
      });
    });
    return str;
  };

  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(_shared.OText, {
    style: {
      marginVertical: 10,
      minWidth: 10
    },
    size: 14,
    weight: '500'
  }, props.data.quantity || '1'), /*#__PURE__*/React.createElement(_shared.OIcon, {
    url: props.data.images,
    style: {
      borderRadius: 15,
      marginHorizontal: 10
    },
    width: 80,
    height: 80
  }), /*#__PURE__*/React.createElement(PInner, null, /*#__PURE__*/React.createElement(_shared.OText, {
    size: 17,
    weight: '500'
  }, props.data.name || 'Pepperoni Pizza'), props.data.options.length > 0 ? /*#__PURE__*/React.createElement(_shared.OText, {
    size: 14,
    weight: '300'
  }, getExtras(props.data.options) || '') : null), /*#__PURE__*/React.createElement(Price, null, /*#__PURE__*/React.createElement(_shared.OText, null, `${(0, _Utilities.parsePrice)(props.data.price)}` || '$30.00')));
};

OProductCell.defaultProps = {};
var _default = OProductCell;
exports.default = _default;
//# sourceMappingURL=OProductCell.js.map