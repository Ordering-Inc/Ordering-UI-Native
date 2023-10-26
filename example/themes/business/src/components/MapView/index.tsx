import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout
} from 'react-native-maps';
import { useLanguage, useSession, MapView as MapViewController } from 'ordering-components/native';
import { MapViewParams } from '../../types';
import Alert from '../../providers/AlertProvider';
import { useTheme } from 'styled-components/native';
import { useLocation } from '../../hooks/useLocation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { OIcon, OText, OFab } from '../shared'
const MapViewComponent = (props: MapViewParams) => {

  const {
    isLoadingBusinessMarkers,
    markerGroups,
    customerMarkerGroups,
    alertState,
    setAlertState,
    setDriverLocation,
    onNavigationRedirect,
    getBusinessLocations,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ user }] = useSession()
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const mapRef = useRef<MapView | any>(null);
  const following = useRef<boolean>(true);
  const [isFocused, setIsFocused] = useState(false)
  const [locationSelected, setLocationSelected] = useState<any>(null)
  const {
    initialPosition,
    userLocation,
    stopFollowUserLocation,
    followUserLocation
  } = useLocation();

  const location = { lat: userLocation?.latitude, lng: userLocation?.longitude }
  const haveOrders = Object.values(markerGroups)?.length > 0 && Object.values(customerMarkerGroups)?.length > 0
  const closeAlert = () => {
    setAlertState({
      open: false,
      content: [],
    });
  };

  const fitCoordinates = (location?: any) => {
    if (mapRef.current) {
      const isSendCoordinates =
        location &&
        userLocation &&
        location.latitude !== userLocation.latitude &&
        location.longitude !== userLocation.longitude &&
        location.latitude !== 0 &&
        location.longitude !== 0 &&
        userLocation.latitude !== 0 &&
        userLocation.longitude !== 0

      isSendCoordinates && mapRef.current.fitToCoordinates(
        [location, userLocation].map(_location => ({
          latitude: _location.latitude,
          longitude: _location.longitude
        })),
        {
          edgePadding: { top: 120, right: 120, bottom: 120, left: 120 }
        },
      );
    }
  };

  const onPressZoomIn = () => {
    const lastRegion = mapRef?.current?.__lastRegion
    mapRef?.current && mapRef.current.animateToRegion({
      ...mapRef?.current?.__lastRegion,
      longitudeDelta: lastRegion?.longitudeDelta / 8,
      latitudeDelta: lastRegion?.longitudeDelta / 8
    })
  }

  const onPressZoomOut = () => {
    const lastRegion = mapRef?.current?.__lastRegion
    mapRef?.current && mapRef.current.animateToRegion({
      ...lastRegion,
      longitudeDelta: lastRegion?.longitudeDelta * 8,
      latitudeDelta: lastRegion?.longitudeDelta * 8
    })
  }

  useEffect(() => {
    fitCoordinates(locationSelected || userLocation);
  }, [userLocation, locationSelected]);


  useEffect(() => {
    if (isFocused) {
      getBusinessLocations()
    }
  }, [isFocused])

  useEffect(() => {
    followUserLocation();

    return () => {
      stopFollowUserLocation();
    };
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true)
      return () => {
        stopFollowUserLocation()
        setIsFocused(false)
        setLocationSelected(null)
      }
    }, [])
  )

  const styles = StyleSheet.create({
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
  });

  const RenderMarker = ({ marker, customer, orderIds }: { marker: any, customer?: boolean, orderIds?: Array<number> }) => {
    const markerRef = useRef<any>()

    let coordinateLat = (customer
      ? typeof marker?.customer?.location?.lat === 'number' && !Number.isNaN(marker?.customer?.location?.lat)
        ? marker?.customer?.location?.lat
        : 0
      : typeof marker?.business?.location?.lat === 'number' && !Number.isNaN(marker?.business?.location?.lat)
        ? marker?.business?.location?.lat
        : 0) ?? (initialPosition?.latitude || 0)
    let coordinateLng = (customer
      ? typeof marker?.customer?.location?.lng === 'number' && !Number.isNaN(marker?.customer?.location?.lng)
        ? marker?.customer?.location?.lng
        : 0
      : typeof marker?.business?.location?.lng === 'number' && !Number.isNaN(marker?.business?.location?.lng)
        ? marker?.business?.location?.lng
        : 0) ?? (initialPosition?.longitude || 0)

    useEffect(() => {
      if (
        markerRef?.current?.props?.coordinate?.latitude === locationSelected?.latitude &&
        markerRef?.current?.props?.coordinate?.longitude === locationSelected?.longitude
      ) {
        markerRef?.current?.showCallout()
      }
    }, [locationSelected])

    return (
      <Marker
        key={customer ? marker?.customer?.id : marker?.business?.id}
        coordinate={{
          latitude: coordinateLat,
          longitude: coordinateLng
        }}
        onPress={() =>
          setLocationSelected({
            latitude: coordinateLat,
            longitude: coordinateLng
          })
        }
        ref={(ref) => markerRef.current = ref}
      >
        <Icon
          name="map-marker"
          size={50}
          color={theme.colors.primary}
        />
        {(!!marker?.customer?.photo || !!marker?.business?.logo) && (
          <View style={styles.view}>
            <OIcon
              style={styles.image}
              src={{ uri: customer ? marker?.customer?.photo : marker?.business?.logo }}
              width={25}
              height={25}
            />
          </View>
        )}
        <Callout
          onPress={() => !!orderIds && orderIds.toString().includes(',') ? onNavigationRedirect('Orders') : onNavigationRedirect('OrderDetails', { order: marker })}
        >
          <View style={{ flex: 1, width: 200, padding: 5 }}>
            <OText weight='bold'>{customer ? `${marker?.customer?.name} ${marker?.customer?.lastname}` : marker?.business?.name}</OText>
            <OText>
              {!!orderIds && orderIds.toString().includes(',') ? (
                <>
                  {t('ORDER_NUMBERS', 'Order Numbers')} {orderIds}
                </>
              ) : (
                <>
                  {t('ORDER_NUMBER', 'Order No.')} {marker?.id}
                </>
              )}
            </OText>
            <OText>{customer ? marker?.customer?.address : marker?.business?.address}</OText>
            {((customer && marker?.customer?.city?.address_notes) || !customer) && (
              <OText>{customer ? marker?.customer?.city?.address_notes : marker?.business?.city?.name}</OText>
            )}
            {((customer && !!marker?.business?.zipcode) || (!customer && !!marker?.business?.zipcode)) && (
              <OText>{customer ? marker?.customer?.zipcode ?? '' : marker?.business?.zipcode ?? ''}</OText>
            )}
            {customer && !!marker?.customer?.internal_number && (
              <OText>{marker?.customer?.internal_number}</OText>
            )}
            <OText textDecorationLine='underline' color={theme.colors.primary}>
              {!!orderIds && orderIds.toString().includes(',') ? (
                <>
                  {t('SHOW_ORDERS', 'Show orders')}
                </>
              ) : (
                <>
                  {t('MORE_INFO', 'More info')}
                </>
              )}
            </OText>
          </View>
        </Callout>
      </Marker>
    )
  }

  useEffect(() => {
    if (userLocation?.latitude !== 0 && userLocation?.longitude !== 0) {
      const location = {
        lat: userLocation?.latitude,
        lng: userLocation?.longitude
      }
      setDriverLocation({ location })
    }
  }, [userLocation])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {!isLoadingBusinessMarkers && isFocused && (
          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: initialPosition?.latitude || 0,
                longitude: initialPosition?.longitude || 0,
                latitudeDelta: haveOrders ? 0.01 : 0.1,
                longitudeDelta: haveOrders ? 0.01 * ASPECT_RATIO : 0.1 * ASPECT_RATIO,
              }}
              style={{ flex: 1 }}
              zoomTapEnabled
              zoomEnabled
              zoomControlEnabled
              cacheEnabled
              moveOnMarkerPress
              onTouchStart={() => (following.current = false)}
            >
              <>
                {Object.values(markerGroups).map((marker: any) => (
                  <RenderMarker
                    key={marker[0]?.business_id}
                    marker={marker[0]}
                    orderIds={marker.map((order: any) => order.id).join(', ')}
                  />
                ))}
                {Object.values(customerMarkerGroups).map((marker: any) => (
                  <RenderMarker
                    key={marker[0]?.customer_id}
                    marker={marker[0]}
                    orderIds={marker.map((order: any) => order.id).join(', ')}
                    customer
                  />
                ))}
                <Marker
                  coordinate={{
                    latitude: typeof location.lat === 'number' && !Number.isNaN(location.lat) ? location.lat : 0,
                    longitude: typeof location.lng === 'number' && !Number.isNaN(location.lng) ? location.lng : 0,
                  }}
                  title={t('YOUR_LOCATION', 'Your Location')}
                >
                  <Icon
                    name="map-marker"
                    size={50}
                    color={theme.colors.primary}
                  />
                  <View style={styles.view}>
                    <OIcon
                      style={styles.image}
                      src={{ uri: user.photo }}
                      width={25}
                      height={25}
                    />
                  </View>
                </Marker>
              </>
            </MapView>
            <OFab
              materialIcon
              iconName="plus"
              onPress={() => onPressZoomIn()}
              style={{
                position: 'absolute',
                bottom: 75,
                right: 20,
              }}
            />
            <OFab
              materialIcon
              iconName="minus"
              onPress={() => onPressZoomOut()}
              style={{
                position: 'absolute',
                bottom: 35,
                right: 20,
              }}
            />
          </View>
        )}
      </View>
      <View>
        <Alert
          open={alertState.open}
          onAccept={closeAlert}
          onClose={closeAlert}
          content={alertState.content}
          title={t('ERROR', 'Error')}
        />
      </View>
    </SafeAreaView >
  );
};

export const MapViewUI = (props: any) => {
  const MapViewProps = {
    ...props,
    UIComponent: MapViewComponent
  }
  return <MapViewController {...MapViewProps} />
}
