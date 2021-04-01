import React, { useState, useEffect, useRef } from 'react'
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Geocoder from 'react-native-geocoding';
import { useLanguage, useConfig } from 'ordering-components/native'

export const GoogleMap = (props) => {

  const { location, handleChangeAddressMap, setErrors, maxLimitLocation } = props

  const [, t] = useLanguage()
  const [configState] = useConfig()
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const [markerPosition, setMarkerPosition] = useState({ latitude: location.lat, longitude: location.lng })
  const [region, setRegion] = useState({
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003 * ASPECT_RATIO
  })
  const markerRef = useRef(null)
  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value

  const center = { lat: location?.lat, lng: location?.lng }

  const geocodePosition = (pos) => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude
    }).then(({ results }) => {
      let zipcode = null
      if (results && results.length > 0) {
        for (const component of results[0].address_components) {
          const addressType = component.types[0]
          if (addressType === 'postal_code') {
            zipcode = component.short_name
            break
          }
        }
        const address = {
          address: results[0]?.formatted_address,
          location: results[0]?.geometry?.location,
          zipcode,
          place_id: results[0]?.place_id,
        }
        const details = {
          geometry: { location: { lat: pos.latitude, lng: pos.longitude } }
        }
        handleChangeAddressMap && handleChangeAddressMap(address, details)
        center.lat = address.location?.lat
        center.lng = address.location?.lng
      } else {
        setErrors && setErrors('ERROR_NOT_FOUND_ADDRESS')
      }
    }).catch(err => {
      console.log(err.message)
    })
  }

  const validateResult = (curPos) => {
    const loc1 = center
    const loc2 = curPos
    const distance = calculateDistance(loc1, loc2)

    if (!maxLimitLocation) {
      geocodePosition(curPos)
      setMarkerPosition(curPos)
      setRegion({ ...region, longitude: curPos.longitude, latitude: curPos.latitude })
      return
    }

    if (distance <= maxLimitLocation) {
      geocodePosition(curPos)
      setMarkerPosition(curPos)
      setRegion({ ...region, longitude: curPos.longitude, latitude: curPos.latitude })
    } else {
      setErrors && setErrors('ERROR_MAX_LIMIT_LOCATION')
      setMarkerPosition({latitude: center.lat, longitude: center.lng})
    }
  }

  const calculateDistance = (pointA, pointB) => {

    // http://www.movable-type.co.uk/scripts/latlong.html
    const lat1 = pointA.lat;
    const lon1 = pointA.lng;

    const lat2 = pointB.latitude;
    const lon2 = pointB.longitude;

    const R = 6371e3; // earth radius in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
      ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance; // in meters
  }

  const handleChangeMarkerPosition = (e) => {
    const curPosition = e.nativeEvent.coordinate
    validateResult(curPosition)
  }

  const handleChangeRegion = (coordinates) => {
    validateResult(coordinates)
  }

  useEffect(() => {
    Geocoder.init(googleMapsApiKey)
  }, [])

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      region={region}
      style={StyleSheet.absoluteFillObject}
      onRegionChangeComplete={handleChangeRegion}
      zoomTapEnabled
      zoomEnabled
      zoomControlEnabled
    >
      <Marker
        coordinate={markerPosition}
        title={t('YOUR_LOCATION', 'Your Location')}
        ref={markerRef}
      />
    </MapView>
  )
}
