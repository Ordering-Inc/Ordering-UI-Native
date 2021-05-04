import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import styled from 'styled-components/native';
const Wrapper = styled.View`
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
  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(MapView, {
    style: style.map,
    mapType: Platform.OS == 'android' ? "none" : "standard",
    provider: PROVIDER_GOOGLE,
    onRegionChangeComplete: setRegion.bind(this, props.region),
    ref: mapRef
  }, props.markers.map((item, index) => /*#__PURE__*/React.createElement(Marker, {
    key: index,
    tracksViewChanges: false,
    coordinate: item.latlng,
    image: item.image
  }))));
};

const style = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject
  }
});
export default OrderMap;
//# sourceMappingURL=OrderMap.js.map