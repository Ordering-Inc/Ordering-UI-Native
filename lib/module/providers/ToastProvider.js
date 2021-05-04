import * as React from "react"; // Defines the three kinds of message that are displayed

export let ToastType; // Defines the parameters required to display the toast

(function (ToastType) {
  ToastType["Info"] = "INFO";
  ToastType["Error"] = "ERROR";
  ToastType["Success"] = "SUCCESS";
})(ToastType || (ToastType = {}));

// Creates the toast context
export const ToastContext = /*#__PURE__*/React.createContext(null);
export const ToastProvider = ({
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

export function useToast() {
  return React.useContext(ToastContext);
}
//# sourceMappingURL=ToastProvider.js.map