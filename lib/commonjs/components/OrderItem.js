"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _constants = require("../config/constants");

var _Utilities = require("../providers/Utilities");

var _theme = require("../theme");

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.TouchableOpacity`
    flex: 1;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 2px #00000020;
    border-left-width: 5px;
    padding: 10px;
    margin-bottom: 12px;
    margin-left: 3px;
    margin-right: 3px;
    margin-top: 3px;
`;
const InnerWrapper = _native.default.View`
    flex: 1;    
    flex-direction: row;    
`;
const InfoWrapper = _native.default.View`
    flex-grow: 1;
`;
const Avatar = _native.default.Image`
    width: 80px;
    height: 80px;
    resize-mode: contain;
    margin-top: 8px;
    margin-right: 8px;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
`;
const Status = _native.default.View`
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    flex-direction: row;
`;
const Address = _native.default.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`;
const OrderNumber = _native.default.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const StatusAction = _native.default.View`
    flex-grow: 1;
    flex-basis: 0;
    border: 1px solid ${_theme.colors.lightGray}
    height: 42px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
`;

const OrderItem = props => {
  const [curItem, onSelectItem] = React.useState(null);
  const [is_online, changOnline] = React.useState(props.isOnline);
  React.useEffect(() => {
    changOnline(props.isOnline);
  }, [props.isOnline]);

  let onClickItem = item => {
    props.onClick(item);
    onSelectItem(item);
  };

  return /*#__PURE__*/React.createElement(Wrapper, {
    onPress: () => onClickItem(props.data),
    style: {
      borderLeftColor: (0, _Utilities.getStatusColor)(props.data.status)
    }
  }, /*#__PURE__*/React.createElement(InnerWrapper, null, /*#__PURE__*/React.createElement(_shared.OIcon, {
    url: props.data.business.logo,
    width: 80,
    height: 80,
    style: {
      borderRadius: 10,
      borderColor: '#e5e5e5',
      borderWidth: 1,
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(InfoWrapper, null, /*#__PURE__*/React.createElement(OrderNumber, null, /*#__PURE__*/React.createElement(_shared.OText, {
    size: 22,
    weight: '600'
  }, `#${props.data.id}`), /*#__PURE__*/React.createElement(_shared.OText, {
    color: 'grey'
  }, props.data.date)), /*#__PURE__*/React.createElement(_shared.OText, {
    size: 18,
    weight: '500',
    style: {
      marginTop: -6
    }
  }, props.data.business.name), /*#__PURE__*/React.createElement(Address, null, /*#__PURE__*/React.createElement(_shared.OIcon, {
    src: require('../assets/icons/pin_outline.png'),
    width: 15,
    style: {
      marginRight: 4
    }
  }), /*#__PURE__*/React.createElement(_shared.OText, {
    isWrap: true,
    weight: '300',
    size: 12.5
  }, props.data.business.address)))), /*#__PURE__*/React.createElement(Status, null, /*#__PURE__*/React.createElement(StatusAction, null, /*#__PURE__*/React.createElement(_shared.OText, {
    color: _theme.colors.primary
  }, (0, _Utilities.getOrderStatus)(props.data.status))), props.data.status == _constants.ORDER_STATUS.PENDING ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_shared.OText, {
    style: {
      width: 10
    }
  }, ''), /*#__PURE__*/React.createElement(_shared.OButton, {
    onClick: () => {},
    style: {
      shadowColor: 'transparent',
      height: 42,
      borderRadius: 10
    },
    parentStyle: {
      flex: 1
    },
    textStyle: {
      fontSize: 14,
      color: 'white'
    },
    bgColor: _theme.colors.primary,
    borderColor: _theme.colors.primary,
    isDisabled: !is_online,
    text: 'Accept',
    imgRightSrc: null
  })) : null));
};

OrderItem.defaultProps = {};
var _default = OrderItem;
exports.default = _default;
//# sourceMappingURL=OrderItem.js.map