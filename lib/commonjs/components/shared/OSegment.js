"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _native = _interopRequireDefault(require("styled-components/native"));

var _Responsive = require("../../providers/Responsive");

var _theme = require("../../theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
    background-color: white;
    flex-direction: row;
    justify-content: space-between;
`;
const SegItem = _native.default.View`
    background-color: grey;
    padding: 8px 8px;
    flex-direction: row;
    align-items: center;
    border-radius: 18px;
`;
const ItemIcon = _native.default.Image`
    resize-mode: contain;
    margin-right: 5px;
    width: 14px;
    height: 14px;
`;
const ItemLabel = _native.default.Text`
    font-family: 'Poppins-Regular';
`; // Props for component

const OSegment = props => {
  var [curIndex, onSelected] = React.useState(props.selectedIdx);

  const onSelectItem = idx => {
    onSelected(idx);
    props.onSelectItem(idx);
  };

  return /*#__PURE__*/React.createElement(Wrapper, null, props.items.map((item, index) => {
    var _item$text;

    return /*#__PURE__*/React.createElement(_reactNativeGestureHandler.TouchableOpacity, {
      key: `SegmentItem_${index}`,
      onPress: () => onSelectItem(index)
    }, /*#__PURE__*/React.createElement(SegItem, {
      style: {
        backgroundColor: index == curIndex ? _theme.colors.primary : 'white'
      }
    }, /*#__PURE__*/React.createElement(ItemIcon, {
      source: item.image,
      style: {
        tintColor: index == curIndex ? 'white' : '#ADADAD'
      }
    }), /*#__PURE__*/React.createElement(ItemLabel, {
      style: {
        fontSize: (0, _Responsive.normalize)(8.8),
        color: index == curIndex ? 'white' : '#ADADAD'
      }
    }, props.labelStyle == 'uppercase' ? (_item$text = item.text) === null || _item$text === void 0 ? void 0 : _item$text.toUpperCase() : item.text)));
  }));
};

OSegment.defaultProps = {
  labelStyle: 'uppercase'
};
var _default = OSegment;
exports.default = _default;
//# sourceMappingURL=OSegment.js.map