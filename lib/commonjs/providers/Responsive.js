"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalize = void 0;

var _reactNative = require("react-native");

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT
} = _reactNative.Dimensions.get('window'); // based on iphone 5s's scale


const scale = SCREEN_WIDTH / 320;

const normalize = size => {
  const newSize = size * scale;

  if (_reactNative.Platform.OS === 'ios') {
    return Math.round(_reactNative.PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(_reactNative.PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

exports.normalize = normalize;
//# sourceMappingURL=Responsive.js.map