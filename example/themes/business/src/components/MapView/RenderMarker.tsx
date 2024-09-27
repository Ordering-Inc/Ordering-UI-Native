import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'styled-components/native';

import { useLanguage } from 'ordering-components/native';
import { OText } from '../shared';
import { RenderMarkerParams } from '../../types'

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

export const RenderMarker = (props: RenderMarkerParams) => {
  const {
    marker,
    customer,
    orderIds,
    onNavigationRedirect,
    initialPosition,
    locationSelected,
    setLocationSelected
  } = props
  const markerRef = useRef<any>()
  const theme = useTheme()
  const [, t] = useLanguage()

  const [imageLoaded, setImageLoaded] = useState(false)

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

  const markerImage = customer ? marker?.customer?.photo ?? theme?.images?.dummies?.customerPhoto : marker?.business?.logo ?? theme?.images?.dummies?.businessLogo

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
      tracksViewChanges={!imageLoaded}
    >
      <Icon
        name="map-marker"
        size={50}
        color={theme.colors.primary}
      />
      {!!markerImage && (
        <View style={styles.view}>
          <FastImage
            style={styles.image}
            source={markerImage?.includes('https') ? {
              uri: markerImage,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable
            } : markerImage}
            resizeMode={FastImage.resizeMode.cover}
            onLoadEnd={() => setImageLoaded(true)}
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
