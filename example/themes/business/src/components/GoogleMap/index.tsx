import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View, SafeAreaView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region, Callout } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { useLanguage, useConfig, useUtils } from 'ordering-components/native';
import { GoogleMapsParams } from '../../types';
import Alert from '../../providers/AlertProvider';
import { OIconButton, OIcon, OText, OButton } from '../shared';
import { FloatingButton } from '../FloatingButton';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocation } from '../../hooks/useLocation';
import { showLocation } from 'react-native-map-link';

export const GoogleMap = (props: GoogleMapsParams) => {
  const {
    location,
    handleChangeAddressMap,
    maxLimitLocation,
    readOnly,
    handleViewActionOrder,
    markerTitle,
    showAcceptOrReject,
    driverLocation,
    saveLocation,
    handleOpenMapView,
    setSaveLocation,
    handleToggleMap,
    locations,
    isSetInputs,
    navigation,
  } = props;

  const {
    hasLocation,
    initialPosition,
    followUserLocation,
    getCurrentLocation,
    userLocation,
    stopFollowUserLocation,
  } = useLocation();

  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const [, t] = useLanguage();
  const [configState] = useConfig();
  const [{ optimizeImage }] = useUtils();
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const [isMapReady, setIsMapReady] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: locations ? locations[locations.length - 1].lat : location.lat,
    longitude: locations ? locations[locations.length - 1].lng : location.lng,
  });
  const [region, setRegion] = useState({
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001 * ASPECT_RATIO,
  });
  let mapRef = useRef<any>(null);
  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value;

  const center = { lat: location?.lat, lng: location?.lng };

  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [], key: null });

  const mapErrors: any = {
    ERROR_NOT_FOUND_ADDRESS: "Sorry, we couldn't find an address",
    ERROR_MAX_LIMIT_LOCATION_TO: 'Sorry, You can only set the position to',
  };

  let MARKERS =
    locations &&
    locations.map((location: { lat: number; lng: number; level: number }) => {
      return location.level === 4 && driverLocation?.lat
        ? {
          latitude: driverLocation?.lat,
          longitude: driverLocation?.lng,
        }
        : { latitude: location.lat, longitude: location.lng };
    });

  const handleArrowBack: any = () => {
    handleOpenMapView && handleOpenMapView();
  };

  const geocodePosition = (pos: { latitude: number; longitude: number }) => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude,
    })
      .then(({ results }) => {
        let zipcode = null;
        if (results && results.length > 0) {
          for (const component of results[0].address_components) {
            const addressType = component.types[0];
            if (addressType === 'postal_code') {
              zipcode = component.short_name;
              break;
            }
          }
          let data = null;
          const details = {
            geometry: { location: { lat: pos?.latitude, lng: pos?.longitude } },
          };
          if (isSetInputs) {
            data = {
              address: results[0]?.formatted_address,
              location: results[0]?.geometry?.location,
              zipcode,
              place_id: results[0]?.place_id,
            };
          }
          handleChangeAddressMap && handleChangeAddressMap(data, details);
          setSaveLocation && setSaveLocation(false);
          handleToggleMap && handleToggleMap();
        } else {
          setMapErrors && setMapErrors('ERROR_NOT_FOUND_ADDRESS');
        }
      })
      .catch(err => {
        setMapErrors && setMapErrors(err.message);
      });
  };

  const validateResult = (curPos: { latitude: number; longitude: number }) => {
    const loc1 = center;
    const loc2 = curPos;
    const distance = calculateDistance(loc1, loc2);

    if (!maxLimitLocation) {
      geocodePosition(curPos);
      setMarkerPosition(curPos);
      setRegion({
        ...region,
        longitude: curPos.longitude,
        latitude: curPos.latitude,
      });
      return;
    }

    if (distance <= maxLimitLocation) {
      setMarkerPosition(curPos);
      setRegion({
        ...region,
        longitude: curPos.longitude,
        latitude: curPos.latitude,
      });
    } else {
      setMapErrors && setMapErrors('ERROR_MAX_LIMIT_LOCATION');
      setMarkerPosition({ latitude: center.lat, longitude: center.lng });
    }
  };

  const calculateDistance = (
    pointA: { lat: number; lng: number },
    pointB: { latitude: number; longitude: number },
  ) => {
    const lat1 = pointA.lat;
    const lon1 = pointA.lng;

    const lat2 = pointB?.latitude;
    const lon2 = pointB?.longitude;

    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const handleChangeRegion = (coordinates: Region) => {
    validateResult(coordinates);
  };

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: [],
    });
  };

  const setMapErrors = (errKey: string) => {
    setAlertState({
      open: true,
      content: !(errKey === 'ERROR_MAX_LIMIT_LOCATION_TO')
        ? [t(errKey, mapErrors[errKey])]
        : [
          `${t(errKey, mapErrors[errKey])} ${maxLimitLocation} ${t(
            'METTERS',
            'meters',
          )}`,
        ],
      key: errKey,
    });
  };

  const fitAllMarkers = () => {
    mapRef.current.fitToCoordinates(MARKERS, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
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
    if (mapRef.current && locations && isMapReady) {
      fitAllMarkers();
    }
  }, [isMapReady]);
  useEffect(() => {
    if (!locations) return
    MARKERS = locations.map((location: { lat: number; lng: number; level: number }) => {
      return location.level === 4 && driverLocation?.lat
        ? {
          latitude: driverLocation?.lat,
          longitude: driverLocation?.lng,
        }
        : { latitude: location.lat, longitude: location.lng };
    })
    fitAllMarkers();
  }, [driverLocation])

  const styles = StyleSheet.create({
    map: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
    },
    image: {
      borderRadius: 50,
    },
    view: {
      width: 25,
      position: 'absolute',
      top: 6,
      left: 6,
      bottom: 0,
      right: 0,
    },
    buttonBack: {
      borderRadius: 7.6,
      borderWidth: 0,
      paddingLeft: 0,
    },
    buttonContainer: {
      position: 'absolute',
      top: 0,
      left: 15,
      marginTop: top,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          style={{ flex: 1 }}
          onRegionChangeComplete={
            !readOnly
              ? coordinates => handleChangeRegion(coordinates)
              : () => { }
          }
          zoomTapEnabled
          zoomEnabled
          zoomControlEnabled
          cacheEnabled
          moveOnMarkerPress
          ref={mapRef}
          onMapReady={() => setIsMapReady(true)}>
          {locations ? (
            <>
              {MARKERS &&
                MARKERS.map(
                  (
                    location: { latitude: number; longitude: number },
                    i: number,
                  ) => (
                    <React.Fragment key={i}>
                      <Marker
                        coordinate={location}
                        onPress={() => {
                          mapRef.current?.animateCamera({
                            center: { latitude: location?.latitude, longitude: location?.longitude },
                          })
                        }}
                      >
                        <Icon
                          name="map-marker"
                          size={50}
                          color={theme.colors.primary}
                        />
                        <View style={styles.view}>
                          <OIcon
                            style={styles.image}
                            url={optimizeImage(
                              locations[i].icon,
                              'h_300,c_limit',
                            )}
                            width={25}
                            height={25}
                          />
                        </View>
                        <Callout
                          onPress={() => {
                            showLocation({
                              latitude: location?.latitude,
                              longitude: location?.longitude,
                              sourceLatitude: userLocation?.latitude,
                              sourceLongitude: userLocation.longitude,
                              naverCallerName: 'com.businessapp',
                              dialogTitle: t('SHOW_IN_OTHER_MAPS', 'Show in other maps'),
                              dialogMessage: t('WHAT_APP_WOULD_YOU_USE', 'What app would you like to use?'),
                              cancelText: t('CANCEL', 'Cancel'),
                            })
                          }}
                        >
                          <View style={{ flex: 1, width: 250, paddingRight: 10, paddingLeft: 10, justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginBottom: 20 }}>
                              <OText size={16} weight={'bold'} style={{ paddingTop: 10, marginBottom: 10 }}>{locations[i]?.title}</OText>
                              {locations[i]?.address && (
                                <>
                                  <OText size={16} >{locations[i]?.address.addressName}</OText>
                                  <OText size={16} >{locations[i]?.address.zipcode}</OText>
                                </>
                              )}
                            </View>
                            <OButton
                              text={t('GO_TO_THIS_LOCATION', 'Go to this location')}
                              imgRightSrc={null}
                              textStyle={{
                                color: theme.colors.white,
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                fontSize: 16
                              }}
                              style={{
                                alignContent: 'center',
                                borderRadius: 10,
                                height: 35,
                                bottom: 10
                              }}
                              bgColor={theme.colors.primary}
                              borderColor={theme.colors.primary}
                            />
                          </View>
                        </Callout>
                      </Marker>
                    </React.Fragment>
                  ),
                )}
            </>
          ) : (
            <Marker
              coordinate={markerPosition}
              title={markerTitle || t('YOUR_LOCATION', 'Your Location')}
            />
          )}
        </MapView>
        <Alert
          open={alertState.open}
          onAccept={closeAlert}
          onClose={closeAlert}
          content={alertState.content}
          title={t('ERROR', 'Error')}
        />
      </View>
      {showAcceptOrReject && (
        <FloatingButton
          btnText={t('ACCEPT', 'Accept')}
          isSecondaryBtn={false}
          color={theme.colors.green}
          secondButtonClick={() =>
            handleViewActionOrder && handleViewActionOrder('accept')
          }
          firstButtonClick={() =>
            handleViewActionOrder && handleViewActionOrder('accept')
          }
          secondButton={false}
          firstColorCustom={theme.colors.red}
          secondColorCustom={theme.colors.green}
          widthButton={'100%'}
          isPadding
        />
      )}
      <View style={styles.buttonContainer}>
        <OIconButton
          icon={theme.images.general.close}
          iconStyle={{ width: 32, height: 32 }}
          style={styles.buttonBack}
          onClick={() => handleArrowBack()}
        />
      </View>
    </SafeAreaView>
  );
};
