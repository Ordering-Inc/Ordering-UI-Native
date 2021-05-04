"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useToast = useToast;
exports.ToastProvider = exports.ToastContext = exports.ToastType = void 0;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Defines the three kinds of message that are displayed
let ToastType; // Defines the parameters required to display the toast

exports.ToastType = ToastType;

(function (ToastType) {
  ToastType["Info"] = "INFO";
  ToastType["Error"] = "ERROR";
  ToastType["Success"] = "SUCCESS";
})(ToastType || (exports.ToastType = ToastType = {}));

// Creates the toast context
const ToastContext = /*#__PURE__*/React.createContext(null);
exports.ToastContext = ToastContext;

const ToastProvider = ({
  children
}) => {
  // Calls setToastConfig in order to control the toast
  // toastConfig is null by default so the toast is hidden
  const [toastConfig, setToastConfig] = React.useState(null);

  function showToast(type, message, duration = 4000) {
    // Calls setToastConfig to show the toast
    setToastConfig({
      type,
      message,
      duration
    });
  }

  function hideToast() {
    // Sets toast config to null in order to hide the toast
    setToastConfig(null);
  }

  return /*#__PURE__*/React.createElement(ToastContext.Provider, {
    value: {
      toastConfig,
      showToast,
      hideToast
    }
  }, children);
}; // hook context


exports.ToastProvider = ToastProvider;

function useToast() {
  return React.useContext(ToastContext);
}
//# sourceMappingURL=ToastProvider.js.map