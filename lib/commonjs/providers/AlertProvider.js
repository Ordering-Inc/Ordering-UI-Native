"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNativeAwesomeAlerts = _interopRequireDefault(require("react-native-awesome-alerts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const AlertProvider = () => {
  const [isShow, showAlert] = React.useState(false);

  const show = () => {
    showAlert(true);
  };

  const hide = () => {
    showAlert(false);
  };

  return /*#__PURE__*/React.createElement(_reactNativeAwesomeAlerts.default, {
    show: isShow,
    showProgress: false,
    title: "AwesomeAlert",
    message: "I have a message for you!",
    closeOnTouchOutside: true,
    closeOnHardwareBackPress: false,
    showCancelButton: true,
    showConfirmButton: true,
    cancelText: "No, cancel",
    confirmText: "Yes, delete it",
    confirmButtonColor: "#DD6B55",
    onCancelPressed: () => {
      hide();
    },
    onConfirmPressed: () => {
      hide();
    }
  });
};

var _default = AlertProvider;
exports.default = _default;
//# sourceMappingURL=AlertProvider.js.map