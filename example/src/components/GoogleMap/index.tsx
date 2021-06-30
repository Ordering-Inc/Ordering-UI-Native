import React, { useState, useEffect, useRef } from 'react'
import { Dimensions, StyleSheet, View, Platform } from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE, Marker, Region, } from 'react-native-maps'
import Geocoder from 'react-native-geocoding';
import { useLanguage, useConfig } from 'ordering-components/native'
import { GoogleMapsParams } from '../../types';
import Alert from '../../providers/AlertProvider'
import { OIcon } from '../shared';

export const GoogleMap = (props: GoogleMapsParams) => {

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
  } = props

  const [, t] = useLanguage()
  const [configState] = useConfig()
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const [markerPosition, setMarkerPosition] = useState({ latitude: locations ? locations[2].lat : location.lat, longitude: locations ? locations[2].lng : location.lng })
  const [region, setRegion] = useState({
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: 0.0010,
    longitudeDelta: 0.0010 * ASPECT_RATIO
  })
  let mapRef = useRef<any>(null)
  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value

  const center = { lat: location?.lat, lng: location?.lng }
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<string>, key?: string | null }>({ open: false, content: [], key: null })
  const mapErrors: any = {
    ERROR_NOT_FOUND_ADDRESS: 'Sorry, we couldn\'t find an address',
    ERROR_MAX_LIMIT_LOCATION_TO: 'Sorry, You can only set the position to'
  }
  const MARKERS = locations && locations.map((location: { lat: number, lng: number }) => {
    return {
      latitude: location.lat,
      longitude: location.lng
    }
  })
  const geocodePosition = (pos: { latitude: number, longitude: number }) => {
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
        setSaveLocation && setSaveLocation(false)
        handleToggleMap && handleToggleMap()
      } else {
        setMapErrors && setMapErrors('ERROR_NOT_FOUND_ADDRESS')
      }
    }).catch(err => {
      setMapErrors && setMapErrors(err.message)
    })
  }

  const validateResult = (curPos: { latitude: number, longitude: number }) => {
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
      setMarkerPosition(curPos)
      setRegion({ ...region, longitude: curPos.longitude, latitude: curPos.latitude })
    } else {
      setMapErrors && setMapErrors('ERROR_MAX_LIMIT_LOCATION')
      setMarkerPosition({ latitude: center.lat, longitude: center.lng })
    }
  }

  const calculateDistance = (pointA: { lat: number, lng: number }, pointB: { latitude: number, longitude: number }) => {

    const lat1 = pointA.lat;
    const lon1 = pointA.lng;

    const lat2 = pointB.latitude;
    const lon2 = pointB.longitude;

    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
      ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  const handleChangeRegion = (coordinates: Region) => {
    validateResult(coordinates)
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  const setMapErrors = (errKey: string) => {
    setAlertState({
      open: true,
      content: !(errKey === 'ERROR_MAX_LIMIT_LOCATION_TO')
        ? [t(errKey, mapErrors[errKey])]
        : [`${t(errKey, mapErrors[errKey])} ${maxLimitLocation} ${t('METTERS', 'meters')}`],
      key: errKey
    })
  }

  const fitAllMarkers = () => {
    mapRef.current.fitToCoordinates(MARKERS, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  }

  useEffect(() => {
    Geocoder.init(googleMapsApiKey)
  }, [])


  useEffect(() => {
    if (saveLocation) {
      geocodePosition(markerPosition)
    }
  }, [saveLocation])

  useEffect(() => {
    const interval = setInterval(() => {
      if (mapRef.current && locations) {
        fitAllMarkers()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [locations])

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        style={styles.map}
        onRegionChangeComplete={!readOnly ? (coordinates) => handleChangeRegion(coordinates) : () => { }}
        zoomTapEnabled
        zoomEnabled
        zoomControlEnabled
        cacheEnabled
        moveOnMarkerPress
        ref={mapRef}
      >
        {locations ? (
          <>
            {MARKERS && MARKERS.map((location: { latitude: number, longitude: number }, i: number) => (
              <React.Fragment key={i}>
                {
                  <Marker
                    coordinate={location}
                    title={locations[i]?.title}
                  >
                    <View>
                      <OIcon url={locations[i].icon} width={50} height={50} />
                    </View>
                  </Marker>
                }
              </React.Fragment>
            ))}
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
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
})
