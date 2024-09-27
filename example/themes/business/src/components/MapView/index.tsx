import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Dimensions, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import MapView, {
  PROVIDER_GOOGLE,
  Marker
} from 'react-native-maps';
import FastImage from 'react-native-fast-image'
import { useLanguage, useSession, MapView as MapViewController } from 'ordering-components/native';
import { MapViewParams } from '../../types';
import Alert from '../../providers/AlertProvider';
import { useTheme } from 'styled-components/native';
import { useLocation } from '../../hooks/useLocation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { OFab } from '../shared'
import { RenderMarker } from './RenderMarker'

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    width: 25,
    height: 25
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
    isDeliveryApp
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const {
    initialPosition,
    userLocation,
    stopFollowUserLocation,
    followUserLocation
  } = useLocation();

  const location = useMemo(() => {
    return { lat: userLocation?.latitude, lng: userLocation?.longitude }
  }, [userLocation?.latitude, userLocation?.longitude])

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

  useEffect(() => {
    if (userLocation?.latitude !== 0 && userLocation?.longitude !== 0) {
      const location = {
        lat: userLocation?.latitude,
        lng: userLocation?.longitude
      }
      setDriverLocation({ location })
    }
  }, [userLocation])

  const renderMarkerDefaultProps = {
    onNavigationRedirect: onNavigationRedirect,
    initialPosition: initialPosition,
    locationSelected: locationSelected,
    setLocationSelected: setLocationSelected
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {(isDeliveryApp || (!isLoadingBusinessMarkers && isFocused)) && !!initialPosition?.latitude && !!initialPosition?.longitude && (
          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: initialPosition?.latitude,
                longitude: initialPosition?.longitude,
                latitudeDelta: haveOrders ? 0.01 : 0.1,
                longitudeDelta: haveOrders ? 0.01 * ASPECT_RATIO : 0.1 * ASPECT_RATIO,
              }}
              style={{ flex: 1 }}
              zoomTapEnabled
              zoomEnabled
              zoomControlEnabled={!(isDeliveryApp && Platform.OS === 'android')}
              cacheEnabled={(isDeliveryApp && Platform.OS === 'android' && isFocused) || Platform.OS === 'ios' || !isDeliveryApp}
              moveOnMarkerPress
              onTouchStart={() => (following.current = false)}
            >
              <>
                {Object.values(markerGroups).map((marker: any) => (
                  <RenderMarker
                    {...renderMarkerDefaultProps}
                    key={marker[0]?.business_id}
                    marker={marker[0]}
                    orderIds={marker.map((order: any) => order.id).join(', ')}
                  />
                ))}
                {Object.values(customerMarkerGroups).map((marker: any) => (
                  <RenderMarker
                    {...renderMarkerDefaultProps}
                    key={marker[0]?.customer_id}
                    marker={marker[0]}
                    orderIds={marker.map((order: any) => order.id).join(', ')}
                    customer
                  />
                ))}
                <Marker
                  tracksViewChanges={!imageLoaded}
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
                    <FastImage
                      style={styles.image}
                      source={user.photo?.includes('https') ? {
                        uri: user.photo,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable
                      } : user.photo ?? theme?.images?.dummies?.driverPhoto}
                      resizeMode={FastImage.resizeMode.cover}
                      onLoadEnd={() => setImageLoaded(true)}
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
