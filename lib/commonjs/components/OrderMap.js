"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeMaps = _interopRequireWildcard(require("react-native-maps"));

var _native = _interopRequireDefault(require("styled-components/native"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
    height: 100%;
`;

const OrderMap = props => {
  const mapRef = React.useRef(null);
  const [region, setRegion] = React.useState(props.region);
  React.useEffect(() => {
    if (mapRef.current && props.markers.length > 0) {
      setTimeout(() => {
        var _mapRef$current;

        (_mapRef$current = mapRef.current) === null || _mapRef$current === void 0 ? void 0 : _mapRef$current.fitToCoordinates(props.markers.map(item => item.latlng), {
          edgePadding: {
            top: 100,
            left: 50,
            right: 50,
            bottom: 300
          },
          animated: true
        });
      }, 1000);
    }
  }, []);
  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(_reactNativeMaps.default, {
    style: style.map,
    mapType: _reactNative.Platform.OS == 'android' ? "none" : "standard",
    provider: _reactNativeMaps.PROVIDER_GOOGLE,
    onRegionChangeComplete: setRegion.bind(void 0, props.region),
    ref: mapRef
  }, props.markers.map((item, index) => /*#__PURE__*/React.createElement(_reactNativeMaps.Marker, {
    key: index,
    tracksViewChanges: false,
    coordinate: item.latlng,
    image: item.image
  }))));
};

const style = _reactNative.StyleSheet.create({
  map: { ..._reactNative.StyleSheet.absoluteFillObject
  }
});

var _default = OrderMap;
exports.default = _default;
//# sourceMappingURL=OrderMap.js.map