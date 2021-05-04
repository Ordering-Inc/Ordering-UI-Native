"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toast = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ToastProvider = require("../../providers/ToastProvider");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const fadeDuration = 300;
const bottomPosition = 20;

const Toast = () => {
  // const insets = useSafeAreaInsets();
  const {
    toastConfig,
    hideToast
  } = (0, _ToastProvider.useToast)();
  const opacity = React.useRef(new _reactNative.Animated.Value(0)).current;
  const fadeIn = React.useCallback(() => {
    _reactNative.Animated.timing(opacity, {
      toValue: 1,
      duration: fadeDuration,
      useNativeDriver: true
    }).start();
  }, [opacity]);
  const fadeOut = React.useCallback(() => {
    _reactNative.Animated.timing(opacity, {
      toValue: 0,
      duration: fadeDuration,
      useNativeDriver: true
    }).start(() => {
      hideToast();
    });
  }, [opacity, hideToast]);
  React.useEffect(() => {
    if (!toastConfig) {
      return;
    }

    fadeIn();
    const timer = setTimeout(fadeOut, toastConfig.duration);
    return () => clearTimeout(timer);
  }, [toastConfig, fadeIn, fadeOut]);

  if (!toastConfig) {
    return null;
  }

  const {
    type,
    message
  } = toastConfig;
  let backgroundColor;

  switch (type) {
    case _ToastProvider.ToastType.Info:
      backgroundColor = '#6ba4ff';
      break;

    case _ToastProvider.ToastType.Error:
      backgroundColor = '#ff3d3d';
      break;

    case _ToastProvider.ToastType.Success:
      backgroundColor = '#73bd24';
      break;
  }

  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    style: [styles.container, {
      bottom: bottomPosition,
      opacity
    }]
  }, /*#__PURE__*/React.createElement(_reactNative.View, {
    style: [styles.toast, {
      backgroundColor
    }]
  }, /*#__PURE__*/React.createElement(_reactNative.Text, {
    style: styles.message
  }, message)));
};

exports.Toast = Toast;

const styles = _reactNative.StyleSheet.create({
  container: {
    alignSelf: "center",
    position: "absolute",
    maxWidth: 480
  },
  toast: {
    borderRadius: 16,
    padding: 16
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: '#fff'
  }
});
//# sourceMappingURL=OToast.js.map