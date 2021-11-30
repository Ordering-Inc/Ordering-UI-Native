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
import { OIcon, OText } from '../shared'

const MapViewComponent = (props: MapViewParams) => {

  const {
    onNavigationRedirect,
    isLoadingBusinessMarkers,
    getBusinessLocations,
    markerGroups,
    customerMarkerGroups
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ user }] = useSession()
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const mapRef = useRef<MapView>(null);
  const following = useRef<boolean>(true);
  const [isFocused, setIsFocused] = useState(false)
  const [locationSelected, setLocationSelected] = useState<any>(null)
  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [], key: null });

  const {
    initialPosition,
    userLocation,
    stopFollowUserLocation,
    followUserLocation
  } = useLocation();

  const location = { lat: userLocation.latitude, lng: userLocation.longitude }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: [],
    });
  };

  const fitCoordinates = (location?: any) => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: location.latitude, longitude: location.longitude },
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        ],
        {
          edgePadding: { top: 120, right: 120, bottom: 120, left: 120 },
        },
      );
    }
  };

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
  }, []);


  useFocusEffect(
    useCallback(() => {
      setIsFocused(true)
      return () => {
        stopFollowUserLocation()
        setIsFocused(false)
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
          latitude: customer ? marker?.customer?.location?.lat : marker?.business?.location?.lat,
          longitude: customer ? marker?.customer?.location?.lng : marker?.business?.location?.lng
        }}
        onPress={() =>
          setLocationSelected({
            latitude: customer ? marker?.customer?.location?.lat : marker?.business?.location?.lat,
            longitude: customer ? marker?.customer?.location?.lng : marker?.business?.location?.lng
          })
        }
        ref={(ref) => markerRef.current = ref}
      >
        <Icon
          name="map-marker"
          size={50}
          color={theme.colors.primary}
        />
        <View style={styles.view}>
          <OIcon
            style={styles.image}
            src={{ uri: customer ? marker?.customer?.photo : marker?.business?.logo }}
            width={25}
            height={25}
          />
        </View>
        <Callout
          onPress={() => orderIds && orderIds?.length > 0 ? onNavigationRedirect('Orders') : onNavigationRedirect('OrderDetails', { order: marker })}
        >
          <View style={{ flex: 1, width: 200, padding: 5 }}>
            <OText weight='bold'>{customer ? `${marker?.customer?.name} ${marker?.customer?.lastname}` : marker?.business?.name}</OText>
            <OText>
              {orderIds && orderIds?.length > 0 ? (
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
            {((customer && marker?.business?.zipcode) || (!customer && marker?.business?.zipcode)) && (
              <OText>{customer ? marker?.customer?.zipcode : marker?.business?.zipcode}</OText>
            )}
            {customer && marker?.customer?.internal_number && (
              <OText>{marker?.customer?.internal_number}</OText>
            )}
            <OText textDecorationLine='underline' color={theme.colors.primary}>
              {orderIds && orderIds?.length > 0 ? (
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {typeof initialPosition?.latitude === 'number' && !isLoadingBusinessMarkers && isFocused && (
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: initialPosition.latitude,
                longitude: initialPosition.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01 * ASPECT_RATIO,
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
                    latitude: location.lat,
                    longitude: location.lng,
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
          )}
        </View>
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