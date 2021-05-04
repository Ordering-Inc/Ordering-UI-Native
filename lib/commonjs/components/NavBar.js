"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _shared = require("./shared");

var _theme = require("../theme");

var _reactNativeSafeAreaContext = require("react-native-safe-area-context");

var _reactNative = require("react-native");

var _constants = require("../config/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
    background-color: ${_theme.colors.white};
    padding: 44px 20px 10px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
`;
const TitleWrapper = _native.default.View`
    flex-direction: column;
    padding-horizontal: 10px;
`;
const TitleTopWrapper = _native.default.View`
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
`;

const NavBar = props => {
  const safeAreaInset = (0, _reactNativeSafeAreaContext.useSafeAreaInsets)();

  const goSupport = () => {
    props.navigation.navigate('Supports', {});
  };

  return /*#__PURE__*/React.createElement(Wrapper, {
    style: {
      paddingTop: _reactNative.Platform.OS == 'ios' ? safeAreaInset.top : 16
    }
  }, /*#__PURE__*/React.createElement(_shared.OButton, {
    imgLeftSrc: props.leftImg || _constants.IMAGES.arrow_left,
    imgRightSrc: null,
    isCircle: true,
    onClick: props.onActionLeft
  }), /*#__PURE__*/React.createElement(TitleTopWrapper, null, props.withIcon ? /*#__PURE__*/React.createElement(_shared.OIcon, {
    url: props.icon,
    style: {
      borderColor: _theme.colors.lightGray,
      borderRadius: 10,
      borderWidth: 1,
      marginLeft: 12
    },
    width: 60,
    height: 60
  }) : null, /*#__PURE__*/React.createElement(TitleWrapper, null, /*#__PURE__*/React.createElement(_shared.OText, {
    size: 22,
    weight: '600',
    style: {
      textAlign: props.titleAlign ? props.titleAlign : 'center',
      marginRight: props.showCall ? 0 : 40,
      color: props.titleColor || 'black',
      paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
      ...props.titleStyle
    }
  }, props.title || ''), props.subTitle ? props.subTitle : null)), props.showCall ? /*#__PURE__*/React.createElement(_shared.OButton, {
    isCircle: true,
    bgColor: _theme.colors.primary,
    borderColor: _theme.colors.primary,
    imgRightSrc: null,
    imgLeftStyle: {
      tintColor: 'white',
      width: 30,
      height: 30
    },
    imgLeftSrc: _constants.IMAGES.support,
    onClick: props.onRightAction || goSupport
  }) : null);
};

NavBar.defaultProps = {
  title: '',
  textAlign: 'center'
};
var _default = NavBar;
exports.default = _default;
//# sourceMappingURL=NavBar.js.map