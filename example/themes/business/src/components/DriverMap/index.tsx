import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Region,
  Polyline,
} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { useLanguage, useConfig, useUtils } from 'ordering-components/native';
import { GoogleMapsParams } from '../../types';
import Alert from '../../providers/AlertProvider';
import { OIconButton, OIcon, OFab, OText } from '../shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from 'styled-components/native';
import { useLocation } from '../../hooks/useLocation';
// import MapViewDirections from 'react-native-maps-directions';
import { FloatingButton } from '../FloatingButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const DriverMap = (props: GoogleMapsParams) => {
  const {
    location,
    maxLimitLocation,
    markerTitle,
    handleOpenMapView,
    showAcceptOrReject,
    saveLocation,
    setSaveLocation,
    order,
    isSetInputs,
    orderStatus,
    isBusinessMarker,
    isToFollow,
    handleViewActionOrder,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [configState] = useConfig();
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const mapRef = useRef<MapView>(null);
  const following = useRef<boolean>(true);
  const autoFit = useRef<boolean>(true);
  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value;
  const [travelTime, setTravelTime] = useState(0);
  const [distancesFromTwoPlacesKm, setDistancesFromTwoPlacesKm] = useState(0);
  const [isMin, setIsMin] = useState(false);
  const [infoRealTime, setInfoRealTime] = useState({ formatted_address: '' });
  const [{ parseDate }] = useUtils();
  const mapErrors: any = {
    ERROR_NOT_FOUND_ADDRESS: "Sorry, we couldn't find an address",
    ERROR_MAX_LIMIT_LOCATION_TO: 'Sorry, You can only set the position to',
  };
  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [], key: null });

  const {
    hasLocation,
    initialPosition,
    followUserLocation,
    getCurrentLocation,
    userLocation,
    stopFollowUserLocation,
  } = useLocation();

  const origin = {
    latitude: initialPosition.latitude,
    longitude: initialPosition.longitude,
  };
  const destination = { latitude: location.lat, longitude: location.lng };

  const { top } = useSafeAreaInsets();

  useEffect(() => {
    if (isToFollow) {
      fitCoordinates();
      followUserLocation();

      return () => {
        stopFollowUserLocation();
      };
    }
  }, []);

  useEffect(() => {
    Geocoder.init(googleMapsApiKey);
  }, []);

  useEffect(() => {
    geocodePosition({ latitude: location.lat, longitude: location.lng });
  }, []);

  const geocodePosition = (pos: { latitude: number; longitude: number }) => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude,
    })
      .then(({ results }: any) => {
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
            geometry: { location: { lat: pos.latitude, lng: pos.longitude } },
          };
          if (isSetInputs) {
            data = {
              address: results[0]?.formatted_address,
              location: results[0]?.geometry?.location,
              zipcode,
              place_id: results[0]?.place_id,
            };
          }
          setInfoRealTime(results[0]);
        } else {
          setMapErrors && setMapErrors('ERROR_NOT_FOUND_ADDRESS');
        }
      })
      .catch((err: any) => {
        setMapErrors && setMapErrors(err.message);
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

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: [],
    });
  };

  const calculateDistance = (
    pointA: { lat: number; lng: number },
    pointB: { latitude: number; longitude: number },
  ) => {
    const lat1 = pointA.lat;
    const lon1 = pointA.lng;

    const lat2 = pointB.latitude;
    const lon2 = pointB.longitude;

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
    const distanceInKm = distance / 1000;
    const estimatedTimeTravel = distance / userLocation.speed;
    const time =
      estimatedTimeTravel > 60 ? estimatedTimeTravel / 60 : estimatedTimeTravel;
    setIsMin(estimatedTimeTravel < 60);
    const timeEstimated = userLocation.speed > 0 ? time : travelTime;
    setDistancesFromTwoPlacesKm(distanceInKm);
    setTravelTime(timeEstimated);
    return distance;
  };

  useEffect(() => {
    calculateDistance(
      { lat: userLocation.latitude, lng: userLocation.longitude },
      destination,
    );
    // geocodePosition(userLocation);

    if (!following.current) return;
    fitCoordinates();

    const { latitude, longitude } = userLocation;

    mapRef.current?.animateCamera({
      center: { latitude, longitude },
    });
  }, [userLocation]);

  const handleArrowBack: any = () => {
    handleOpenMapView && handleOpenMapView();
  };

  const centerPosition = async () => {
    const { latitude, longitude } = await getCurrentLocation();

    following.current = true;
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001 * ASPECT_RATIO,
        },
        2000,
      );

      // mapRef.current?.animateCamera({
      //   center: { latitude, longitude },
      // });
    }
  };

  const colors: any = {
    0: theme.colors.statusOrderBlue,
    3: theme.colors.statusOrderBlue,
    5: theme.colors.statusOrderRed,
    7: theme.colors.StatusOrderBlue,
    8: theme.colors.statusOrderBlue,
    9: theme.colors.statusOrderBlue,
    11: theme.colors.statusOrderGreen,
    12: theme.colors.statusOrderRed,
  };

  const fitCoordinates = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: location.lat, longitude: location.lng },
          {
            latitude: initialPosition.latitude,
            longitude: initialPosition.longitude,
          },
        ],
        {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        },
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (initialPosition.latitude !== 0 && autoFit.current) {
        if (mapRef.current) {
          fitCoordinates();
          autoFit.current = false;
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [initialPosition]);

  const fitCoordinatesZoom = () => {
    following.current = false;
    fitCoordinates();
  };

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
      borderWidth: 0,
      maxWidth: 100,
    },
    facOrderStatus: {
      position: 'absolute',
      height: 120,
      top: 0,
      zIndex: 9999,
      width: '100%',
      flexDirection: 'row',
      backgroundColor: theme.colors.white,
      paddingHorizontal: 20,
      borderWidth: 0,
      paddingTop: top,
      borderBottomWidth: 10,
      borderBottomColor: theme.colors.inputChat,
    },
    facDistance: {
      position: 'absolute',
      height: 60,
      top: 120,
      zIndex: 9999,
      width: '100%',
      flexDirection: 'row',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      paddingHorizontal: 20,
      borderWidth: 0,
    },
    arrowDistance: {
      borderWidth: 0,
    },
  });

  const handleChangeRegion = (coordinates: Region) => {
    validateResult(coordinates);
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: initialPosition.latitude,
            longitude: initialPosition.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001 * ASPECT_RATIO,
          }}
          style={{ flex: 1 }}
          // showsUserLocation

          zoomTapEnabled
          // onRegionChangeComplete={
          //   !readOnly
          //     ? coordinates => handleChangeRegion(coordinates)
          //     : () => {}
          // }
          zoomEnabled
          zoomControlEnabled
          cacheEnabled
          moveOnMarkerPress
          onTouchStart={() => (following.current = false)}>
          {location ? (
            <>
              <Polyline
                coordinates={[
                  { latitude: location.lat, longitude: location.lng },
                  {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  },
                ]}
                strokeColor="blue"
                strokeWidth={3}
              />
              <Marker
                coordinate={{ latitude: location.lat, longitude: location.lng }}
                title={location.title}>
                <Icon
                  name="map-marker"
                  size={50}
                  color={theme.colors.primary}
                />
                <View style={styles.view}>
                  <OIcon
                    style={styles.image}
                    url={location.icon}
                    width={25}
                    height={25}
                  />
                </View>
              </Marker>
              <Marker coordinate={userLocation}>
                <OIcon
                  style={styles.image}
                  src={theme.images.general.driverImage}
                  width={40}
                  height={40}
                />
              </Marker>
            </>
          ) : (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title={markerTitle || t('YOUR_LOCATION', 'Your Location')}
            />
          )}
        </MapView>
      </View>

      <OFab
        iconName="globe-sharp"
        onPress={fitCoordinatesZoom}
        style={{
          position: 'absolute',
          bottom: showAcceptOrReject ? 115 : 75,
          right: 20,
        }}
      />
      <OFab
        iconName="car-sport-sharp"
        onPress={centerPosition}
        style={{
          position: 'absolute',
          bottom: showAcceptOrReject ? 80 : 35,
          right: 20,
        }}
      />

      <View style={styles.facOrderStatus}>
        <View
          style={{
            width: '25%',
            justifyContent: 'center',
          }}>
          <OIconButton
            icon={theme.images.general.close}
            iconStyle={{
              width: 32,
              height: 25,
            }}
            style={styles.buttonBack}
            onClick={() => handleArrowBack()}
          />
        </View>
        <View style={{ width: '75%' }}>
          <OText size={12} color={theme.colors.textGray}>
            {order?.delivery_datetime_utc
              ? parseDate(order?.delivery_datetime_utc)
              : parseDate(order?.delivery_datetime, { utc: false })}
            {` - ${order?.paymethod?.name}`}
          </OText>
          <OText weight="bold">
            {t('INVOICE_ORDER_NO', 'Order No.')} {order?.id}
            {` ${t('IS', 'is')} `}
            <OText
              size={16}
              numberOfLines={2}
              color={colors[order?.status] || theme.colors.statusOrderBlue}>
              {`${orderStatus}`}
            </OText>
          </OText>
        </View>
      </View>

      <View style={styles.facDistance}>
        <View
          style={{
            width: '25%',
            alignItems: 'center',
          }}>
          <OIcon
            src={theme.images.general.arrow_distance}
            style={styles.arrowDistance}
          />
          <OText size={13} numberOfLines={1} adjustsFontSizeToFit space>{`${(
            distancesFromTwoPlacesKm * 3280.84
          ).toFixed(0)} ${t('FT', 'Ft')}`}</OText>
        </View>

        <View style={{ width: '75%' }}>
          <OText
            color={theme.colors.unselectText}
            size={13}
            numberOfLines={2}
            adjustsFontSizeToFit>
            {`${travelTime.toFixed(2)} - ${
              isMin ? t('MINNUTES', 'mins') : t('HOURS', 'hours')
            } ${distancesFromTwoPlacesKm.toFixed(2)} km`}
          </OText>
          <OText size={13} numberOfLines={3} adjustsFontSizeToFit>
            {infoRealTime?.formatted_address}
          </OText>
        </View>
      </View>

      {showAcceptOrReject && (
        <FloatingButton
          btnText={t('REJECT', 'Reject')}
          isSecondaryBtn={false}
          secondButtonClick={() =>
            handleViewActionOrder && handleViewActionOrder('accept')
          }
          firstButtonClick={() =>
            handleViewActionOrder && handleViewActionOrder('reject')
          }
          secondBtnText={t('ACCEPT', 'Accept')}
          secondButton={true}
          firstColorCustom={theme.colors.red}
          secondColorCustom={theme.colors.green}
        />
      )}
      <Alert
        open={alertState.open}
        onAccept={closeAlert}
        onClose={closeAlert}
        content={alertState.content}
        title={t('ERROR', 'Error')}
      />
    </>
  );
};
