import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker
} from 'react-native-maps';
import { useLanguage, useConfig, useUtils } from 'ordering-components/native';
import { GoogleMapsParams } from '../../types';
import Alert from '../../providers/AlertProvider';
import { OIconButton, OIcon, OFab, OText, OButton } from '../shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from 'styled-components/native';
import { useLocation } from '../../hooks/useLocation';
import { FloatingButton } from '../FloatingButton';
import { Popup } from 'react-native-map-link';
import { transformDistance } from '../../utils';

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
    updateDriverPosition,
    driverUpdateLocation,
    setDriverUpdateLocation,
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
  const [{ parseDate }] = useUtils();
  const [popUp, setPopUp] = useState<boolean>(false);
  const mapErrors: any = {
    ERROR_NOT_FOUND_ADDRESS: "Sorry, we couldn't find an address",
    ERROR_MAX_LIMIT_LOCATION_TO: 'Sorry, You can only set the position to',
  };
  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [], key: null });
  const distanceUnit = configState?.configs?.distance_unit?.value
  const isHideRejectButtons = configState?.configs?.reject_orders_enabled && configState?.configs?.reject_orders_enabled?.value !== '1'

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

  useEffect(() => {
    if (isToFollow) {
      fitCoordinates();
      followUserLocation();

      return () => {
        stopFollowUserLocation();
      };
    }
  }, []);

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
    const estimatedTimeTravel = distance / userLocation.speed / 60;
    const time =
      estimatedTimeTravel > 60 ? estimatedTimeTravel / 60 : estimatedTimeTravel;
    setIsMin(estimatedTimeTravel < 60);
    const timeEstimated = userLocation.speed > 0 ? time : travelTime;
    setDistancesFromTwoPlacesKm(distanceInKm);
    setTravelTime(timeEstimated);
    return distance;
  };

  useEffect(() => {
    if (driverUpdateLocation.error) {
      stopFollowUserLocation();
      setAlertState({
        open: true,
        content: [
          `${driverUpdateLocation.error[0] || driverUpdateLocation.error}. ${t(
            'TRY_AGAIN',
            'Try Again',
          )}`,
        ],
      });
    }
  }, [driverUpdateLocation.error]);

  useEffect(() => {
    if (driverUpdateLocation.error) return;

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
    setDriverUpdateLocation?.({
      ...driverUpdateLocation,
      error: null,
      newLocation: null,
    });
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
    //BLUE
    0: theme.colors.statusOrderBlue,
    3: theme.colors.statusOrderBlue,
    4: theme.colors.statusOrderBlue,
    7: theme.colors.statusOrderBlue,
    8: theme.colors.statusOrderBlue,
    9: theme.colors.statusOrderBlue,
    13: theme.colors.statusOrderBlue,
    14: theme.colors.statusOrderBlue,
    18: theme.colors.statusOrderBlue,
    19: theme.colors.statusOrderBlue,
    20: theme.colors.statusOrderBlue,
    21: theme.colors.statusOrderBlue,
    //GREEN
    1: theme.colors.statusOrderGreen,
    11: theme.colors.statusOrderGreen,
    15: theme.colors.statusOrderGreen,
    //RED
    2: theme.colors.statusOrderRed,
    5: theme.colors.statusOrderRed,
    6: theme.colors.statusOrderRed,
    10: theme.colors.statusOrderRed,
    12: theme.colors.statusOrderRed,
    16: theme.colors.statusOrderRed,
    17: theme.colors.statusOrderRed,
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
    driverIcon: {
      height: 25,
      width: 25,
      backgroundColor: theme.colors.white,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonBack: {
      borderWidth: 0,
      maxWidth: 40,
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    },
    facContainer: {
      position: 'absolute',
      top: 0,
      zIndex: 9999,
      width: '100%',
      backgroundColor: theme.colors.white,
      paddingHorizontal: 30,
      paddingTop: 30,
    },
    facOrderStatus: {
      flexDirection: 'row',
      borderBottomWidth: 11,
      minHeight: 70,
      borderBottomColor: theme.colors.inputChat,
      paddingVertical: 5,
    },
    facDistance: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 75,
    },
    arrowDistance: {
      borderWidth: 0,
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 80,
      position: 'absolute'
    },
    showButton: {
      alignSelf: 'center',
      borderRadius: 10,
    }
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
                <Marker
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                  title={location.title}>
                  <Icon
                    name="map-marker"
                    size={50}
                    color={theme.colors.primary}
                  />
                  <View style={styles.view}>
                    <OIcon
                      style={styles.image}
                      src={typeof location.icon === 'number' ? location.icon : { uri: location.icon }}
                      width={25}
                      height={25}
                    />
                  </View>
                </Marker>
                <Marker coordinate={userLocation}>
                  <View style={styles.driverIcon}>
                    <OIcon
                      style={styles.image}
                      src={theme.images.general.driverImage}
                      width={25}
                      height={25}
                    />
                  </View>
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
        <View style={styles.facContainer}>
          <View style={styles.facOrderStatus}>
            <View
              style={{
                width: '15%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingBottom: 10,
                marginRight: 10,
              }}>
              <OIconButton
                icon={theme.images.general.close}
                iconStyle={{
                  width: 13,
                  height: 13,
                }}
                style={styles.buttonBack}
                onClick={() => handleArrowBack()}
              />
            </View>
            <View style={{ width: '85%', paddingRight: 10, paddingBottom: 10 }}>
              <OText size={12} color={theme.colors.textGray}>
                {order?.delivery_datetime_utc
                  ? parseDate(order?.delivery_datetime_utc)
                  : parseDate(order?.delivery_datetime, { utc: false })}
                {` - ${t(order?.paymethod?.name?.replace(/\s+/g, '_')?.toUpperCase(), order?.paymethod?.name)}`}
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
                width: '15%',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <OIcon
                src={theme.images.general.arrow_distance}
                style={styles.arrowDistance}
              />
              <OText size={12} numberOfLines={3}>
                {`${transformDistance(distancesFromTwoPlacesKm, distanceUnit)} ${t(distanceUnit.toUpperCase(), distanceUnit)}`}
              </OText>

            </View>
            <View style={{ width: '75%', paddingRight: 20 }}>
              <OText
                color={theme.colors.unselectText}
                size={13}
                numberOfLines={2}
                adjustsFontSizeToFit>
                {`${travelTime.toFixed(2)} - ${isMin ? t('MINNUTES', 'mins') : t('HOURS', 'hours')}`}
              </OText>
            </View>
          </View>
        </View>
        <View style={{
          ...styles.buttonContainer,
          bottom: showAcceptOrReject ? 80 : 0
        }}>
          <OButton
            imgRightSrc=''
            textStyle={{ color: theme.colors.white }}
            style={styles.showButton}
            onClick={() => setPopUp(true)}
            text={t('SHOW_IN_OTHER_MAPS', 'Show in other maps')}
          />
          <Popup
            isVisible={popUp}
            onCancelPressed={() => setPopUp(false)}
            onAppPressed={() => setPopUp(false)}
            onBackButtonPressed={() => setPopUp(false)}
            modalProps={{
              animationIn: 'slideInUp'
            }}
            options={{
              latitude: destination.latitude,
              longitude: destination.longitude,
              sourceLatitude: userLocation.latitude,
              sourceLongitude: userLocation.longitude,
              naverCallerName: 'com.deliveryapp',
              dialogTitle: t('SHOW_IN_OTHER_MAPS', 'Show in other maps'),
              dialogMessage: t('WHAT_APP_WOULD_YOU_USE', 'What app would you like to use?'),
              cancelText: t('CANCEL', 'Cancel'),
            }}
          />
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
            widthButton={isHideRejectButtons ? '100%': '45%'}
            isPadding
            isHideRejectButtons={isHideRejectButtons}
          />
        )}

        <Alert
          open={alertState.open}
          onAccept={closeAlert}
          onClose={closeAlert}
          content={alertState.content}
          title={t('ERROR', 'Error')}
        />
      </View>
    </SafeAreaView>
  );
};
