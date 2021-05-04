"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _native = _interopRequireDefault(require("styled-components/native"));

var _theme = require("../../theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
    background-color: white;
    padding: 10px 14px;
    border-radius: 20px;
    border-width: 1px;
    border-color: ${_theme.colors.primary}
    flex-grow: 1;
    flex-basis: 0;
    align-items: center;
    justify-content: center;
`;
const InnerWrapper = _native.default.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
const SelLabel = _native.default.Text`
    flex: 1;
    font-family: 'Poppins-Regular';
    color: grey;
    flex-grow: 1;
    margin: 0 10px;
`;
const DropIcon = _native.default.Image`
    tint-color: ${_theme.colors.primary};
    resize-mode: contain;
    width: 7px;
    height: 7px;
`;
const KindIcon = _native.default.Image`
    tint-color: ${_theme.colors.primary};
    resize-mode: contain;
    width: 14px;
    height: 14px;
`;
const DropView = _native.default.View`
    position: absolute;
    box-shadow: 0 4px 3px #00000022;
    background-color: white;
    top: 42px;
    left: 20px;
    width: 100%;
    padding: 4px 5px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
`;
const DropItems = _native.default.Text`
    padding: 9px 5px;
    border-bottom-width: 1px;
    border-bottom-color: red;
    margin-bottom: 2px;
`;

const ODropDown = props => {
  const [curIndex, onSelect] = React.useState(props.selectedIndex);
  const [items, getItems] = React.useState(props.items);
  const [isOpen, onOffToggle] = React.useState(false);
  const [value, setValue] = React.useState(curIndex && items ? items[curIndex] : null);

  const onSelectItem = index => {
    props.onSelect(index);
    onSelect(index);

    if (items) {
      setValue(items[index]);
    }

    onOffToggle(false);
  };

  React.useEffect(() => {
    if (props.items) {
      onSelect(0);
    } else alert('Undefined Items');
  }, [props.items]);

  const onToggle = () => {
    onOffToggle(is_opened => !is_opened);
  };

  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props.style
  }, /*#__PURE__*/React.createElement(InnerWrapper, {
    onPress: onToggle
  }, props.kindImage ? /*#__PURE__*/React.createElement(KindIcon, {
    source: props.kindImage
  }) : null, /*#__PURE__*/React.createElement(SelLabel, {
    numberOfLines: 1,
    ellipsizeMode: 'tail'
  }, value || props.placeholder), /*#__PURE__*/React.createElement(DropIcon, {
    style: {
      tintColor: props.dropIconColor || 'grey'
    },
    source: require('../../assets/icons/drop_down.png')
  })), isOpen ? /*#__PURE__*/React.createElement(DropView, null, items ? items.map((item, index) => /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
    key: `key_${index}`,
    onPress: () => onSelectItem(index)
  }, /*#__PURE__*/React.createElement(DropItems, null, item))) : null) : null);
};

var _default = ODropDown;
exports.default = _default;
//# sourceMappingURL=ODropDown.js.map