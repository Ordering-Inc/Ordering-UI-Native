import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { useLanguage, useConfig } from 'ordering-components/native';
import Alert from '../../providers/AlertProvider';
import { OIcon } from '../shared';
export const GoogleMap = props => {
  var _configState$configs, _configState$configs$;

  const {
    location,
    handleChangeAddressMap,
    maxLimitLocation,
    readOnly,
    markerTitle,
    saveLocation,
    setSaveLocation,
    handleToggleMap,
    locations
  } = props;
  const [, t] = useLanguage();
  const [configState] = useConfig();
  const {
    width,
    height
  } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const [markerPosition, setMarkerPosition] = useState({
    latitude: locations ? locations[2].lat : location.lat,
    longitude: locations ? locations[2].lng : location.lng
  });
  const [region, setRegion] = useState({
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: 0.0005,
    longitudeDelta: 0.0005 * ASPECT_RATIO
  });
  let mapRef = useRef(null);
  const googleMapsApiKey = configState === null || configState === void 0 ? void 0 : (_configState$configs = configState.configs) === null || _configState$configs === void 0 ? void 0 : (_configState$configs$ = _configState$configs.google_maps_api_key) === null || _configState$configs$ === void 0 ? void 0 : _configState$configs$.value;
  const center = {
    lat: location === null || location === void 0 ? void 0 : location.lat,
    lng: location === null || location === void 0 ? void 0 : location.lng
  };
  const [alertState, setAlertState] = useState({
    open: false,
    content: [],
    key: null
  });
  const mapErrors = {
    ERROR_NOT_FOUND_ADDRESS: 'Sorry, we couldn\'t find an address',
    ERROR_MAX_LIMIT_LOCATION: `Sorry, You can only set the position to ${maxLimitLocation}m`
  };
  const MARKERS = locations && locations.map(location => {
    return {
      latitude: location.lat,
      longitude: location.lng
    };
  });

  const geocodePosition = pos => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude
    }).then(({
      results
    }) => {
      let zipcode = null;

      if (results && results.length > 0) {
        var _results$, _results$2, _results$2$geometry, _results$3;

        for (const component of results[0].address_components) {
          const addressType = component.types[0];

          if (addressType === 'postal_code') {
            zipcode = component.short_name;
            break;
          }
        }

        const address = {
          address: (_results$ = results[0]) === null || _results$ === void 0 ? void 0 : _results$.formatted_address,
          location: (_results$2 = results[0]) === null || _results$2 === void 0 ? void 0 : (_results$2$geometry = _results$2.geometry) === null || _results$2$geometry === void 0 ? void 0 : _results$2$geometry.location,
          zipcode,
          place_id: (_results$3 = results[0]) === null || _results$3 === void 0 ? void 0 : _results$3.place_id
        };
        const details = {
          geometry: {
            location: {
              lat: pos.latitude,
              lng: pos.longitude
            }
          }
        };
        handleChangeAddressMap && handleChangeAddressMap(address, details);
        setSaveLocation && setSaveLocation(false);
        handleToggleMap && handleToggleMap();
      } else {
        setMapErrors && setMapErrors('ERROR_NOT_FOUND_ADDRESS');
      }
    }).catch(err => {
      setMapErrors && setMapErrors(err.message);
    });
  };

  const validateResult = curPos => {
    const loc1 = center;
    const loc2 = curPos;
    const distance = calculateDistance(loc1, loc2);

    if (!maxLimitLocation) {
      geocodePosition(curPos);
      setMarkerPosition(curPos);
      setRegion({ ...region,
        longitude: curPos.longitude,
        latitude: curPos.latitude
      });
      return;
    }

    if (distance <= maxLimitLocation) {
      setMarkerPosition(curPos);
      setRegion({ ...region,
        longitude: curPos.longitude,
        latitude: curPos.latitude
      });
    } else {
      setMapErrors && setMapErrors('ERROR_MAX_LIMIT_LOCATION');
      setMarkerPosition({
        latitude: center.lat,
        longitude: center.lng
      });
    }
  };

  const calculateDistance = (pointA, pointB) => {
    const lat1 = pointA.lat;
    const lon1 = pointA.lng;
    const lat2 = pointB.latitude;
    const lon2 = pointB.longitude;
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleChangeRegion = coordinates => {
    validateResult(coordinates);
  };

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    });
  };

  const setMapErrors = errKey => {
    setAlertState({
      open: true,
      content: !(errKey === 'ERROR_MAX_LIMIT_LOCATION') ? [t(errKey, mapErrors[errKey])] : [`${t(errKey, mapErrors[errKey])} ${maxLimitLocation} ${t('METTERS', 'meters')}`],
      key: errKey
    });
  };

  const fitAllMarkers = () => {
    mapRef.current.fitToCoordinates(MARKERS, {
      edgePadding: {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80
      },
      animated: true
    });
  };

  useEffect(() => {
    Geocoder.init(googleMapsApiKey);
  }, []);
  useEffect(() => {
    if (saveLocation) {
      geocodePosition(markerPosition);
    }
  }, [saveLocation]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (mapRef.current) {
        fitAllMarkers();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [locations]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MapView, {
    provider: PROVIDER_GOOGLE,
    initialRegion: region,
    style: styles.map,
    onRegionChangeComplete: !readOnly ? coordinates => handleChangeRegion(coordinates) : () => {},
    zoomTapEnabled: true,
    zoomEnabled: true,
    zoomControlEnabled: true,
    ref: mapRef
  }, locations ? /*#__PURE__*/React.createElement(React.Fragment, null, MARKERS && MARKERS.map((location, i) => {
    var _locations$i;

    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement(Marker, {
      coordinate: location,
      title: (_locations$i = locations[i]) === null || _locations$i === void 0 ? void 0 : _locations$i.title
    }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(OIcon, {
      url: locations[i].icon,
      width: 50,
      height: 50
    }))));
  })) : /*#__PURE__*/React.createElement(Marker, {
    coordinate: markerPosition,
    title: markerTitle || t('YOUR_LOCATION', 'Your Location')
  })), /*#__PURE__*/React.createElement(Alert, {
    open: alertState.open,
    onAccept: closeAlert,
    onClose: closeAlert,
    content: alertState.content,
    title: t('ERROR', 'Error')
  }));
};
const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject
  }
});
//# sourceMappingURL=index.js.map