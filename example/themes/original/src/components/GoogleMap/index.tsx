import React, { useState, useEffect, useRef } from 'react'
import { Dimensions, StyleSheet, View, Platform } from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE, Marker, Region, Polygon, Circle } from 'react-native-maps'
import Geocoder from 'react-native-geocoding';
import { useLanguage, useConfig } from 'ordering-components/native'
import { GoogleMapsParams } from '../../types';
import Alert from '../../../../../src/providers/AlertProvider'
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
    locations,
    isIntGeoCoder,
    businessZones,
    delta,
    autoCompleteAddress,
    setAutoCompleteAddress,
    manualZoom
  } = props

  const [, t] = useLanguage()
  const [configState] = useConfig()
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const [markerPosition, setMarkerPosition] = useState({ latitude: locations ? locations[2].lat : location.lat, longitude: locations ? locations[2].lng : location.lng })
  const [region, setRegion] = useState({
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: delta ?? 0.0010,
    longitudeDelta: (delta ?? 0.0010) * ASPECT_RATIO
  })
  const [MARKERS, SETMARKERS] = useState(locations)
  let mapRef = useRef<any>(null)
  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value

  const center = { lat: location?.lat, lng: location?.lng }
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<string>, key?: string | null }>({ open: false, content: [], key: null })
  const mapErrors: any = {
    ERROR_NOT_FOUND_ADDRESS: 'Sorry, we couldn\'t find an address',
    ERROR_MAX_LIMIT_LOCATION: `Sorry, You can only set the position to ${maxLimitLocation}m`
  }

  const units: any = {
    mi: 1609,
    km: 1000
  }

  const types: any = [1, 2, 5]

  const fillStyles = {
    fillColor: 'rgba(44, 123, 229, 0.3)',
    strokeColor: 'rgba(44, 123, 229, 1)',
    strokeWidth: 2
  }

  const geocodePosition = (pos: { latitude: number, longitude: number }, isMovingRegion?: boolean) => {
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
          geometry: { location: { lat: pos.latitude, lng: pos.longitude } },
          address_components: results[0]?.address_components,
        }
        handleChangeAddressMap && handleChangeAddressMap(address, details)
        setSaveLocation && setSaveLocation(false)
        if (isMovingRegion) {
          handleToggleMap && handleToggleMap()
        }
      } else {
        setMapErrors && setMapErrors('ERROR_NOT_FOUND_ADDRESS')
      }
    }).catch(err => {
      setMapErrors && setMapErrors(err.message)
    })
  }

  const validateResult = (curPos: any) => {
    const loc1 = center
    const loc2 = curPos
    const distance = calculateDistance(loc1, loc2)

    if (!maxLimitLocation) {
      geocodePosition(curPos)
      setMarkerPosition(curPos)
      if (!autoCompleteAddress) {
        setRegion({ longitude: curPos?.longitude || 0, latitude: curPos?.latitude || 0, latitudeDelta: curPos?.latitudeDelta || 0.0010, longitudeDelta: curPos?.longitudeDelta || (delta ?? 0.0010) * ASPECT_RATIO })
      } else {
        setRegion({ longitude: curPos?.longitude, latitude: curPos?.latitude, latitudeDelta: delta ?? 0.0010, longitudeDelta: (delta ?? 0.0010) * ASPECT_RATIO })
      }
      return
    }

    const _maxLimitLocation = typeof maxLimitLocation === 'string' ? parseInt(maxLimitLocation, 10) : maxLimitLocation

    if (distance <= _maxLimitLocation) {
      if (!aproxEqual(curPos?.latitude, center.lat) || !aproxEqual(curPos?.longitude, center.lng)) {
        geocodePosition(curPos, true)
      }
      setMarkerPosition(curPos)
      if (!autoCompleteAddress) {
        setRegion({ longitude: curPos?.longitude || 0, latitude: curPos?.latitude || 0, latitudeDelta: curPos?.latitudeDelta || 0.0010, longitudeDelta: curPos?.longitudeDelta || (delta ?? 0.0010) * ASPECT_RATIO })
      } else {
        setRegion({ longitude: curPos?.longitude, latitude: curPos?.latitude, latitudeDelta: delta ?? 0.0010, longitudeDelta: (delta ?? 0.0010) * ASPECT_RATIO })
      }
    } else {
      setMapErrors && setMapErrors('ERROR_MAX_LIMIT_LOCATION')
      setMarkerPosition({ latitude: center.lat, longitude: center.lng })
    }
  }

  const aproxEqual = (n1: number, n2: number, epsilon = 0.000001) => {
    return Math.abs(n1 - n2) < epsilon
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
      content: !(errKey === 'ERROR_MAX_LIMIT_LOCATION')
        ? [t(errKey, mapErrors[errKey])]
        : [`${t(errKey, mapErrors[errKey])} ${maxLimitLocation} ${t('METTERS', 'meters')}`],
      key: errKey
    })
  }

  const fitAllMarkers = () => {
    mapRef.current.fitToCoordinates(MARKERS?.map(location => ({ latitude: location.lat, longitude: location.lng })), {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  }

  useEffect(() => {
    if (isIntGeoCoder) return
    Geocoder.init(googleMapsApiKey)
  }, [isIntGeoCoder])

  useEffect(() => {
    const regionConfig = {
      latitude: location?.lat,
      longitude: location?.lng,
      latitudeDelta: region?.latitudeDelta ?? delta ?? 0.0010,
      longitudeDelta: region?.longitudeDelta ?? (delta ?? 0.0010) * ASPECT_RATIO
    }

    mapRef.current.animateToRegion(autoCompleteAddress
      ? regionConfig
      : { ...region, ...regionConfig }
    )

    if (autoCompleteAddress) {
      setAutoCompleteAddress && setAutoCompleteAddress(false)
    }
  }, [location])

  useEffect(() => {
    if (saveLocation) {
      geocodePosition(markerPosition)
    }
  }, [saveLocation])

  useEffect(() => {
    const interval = setInterval(() => {
      if (mapRef.current && locations && !manualZoom) {
        fitAllMarkers()
      }
    }, 1000)
    if (locations) {
      fitAllMarkers()
      SETMARKERS(locations)
    }
    return () => clearInterval(interval)
  }, [locations])

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        style={styles.map}
        onRegionChangeComplete={!readOnly ? (coordinates) => { handleChangeRegion(coordinates) } : () => { }}
        zoomTapEnabled
        zoomEnabled
        zoomControlEnabled
        cacheEnabled
        moveOnMarkerPress
        ref={mapRef}
      >
        {locations ? (
          <>
            {MARKERS && MARKERS.map((location: { lat: number, lng: number }, i: number) => (
              <React.Fragment key={i}>
                {
                  <Marker
                    zIndex={i}
                    coordinate={{ latitude: location.lat ?? 0, longitude: location.lng ?? 0 }}
                    title={MARKERS[i]?.title}
                  >
                    <View>
                      <OIcon url={MARKERS[i].icon} width={50} height={50} />
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
        {businessZones?.length > 0 && businessZones.filter((item: any) => types.includes(item?.type)).map((businessZone: any, i: number) => (
          <React.Fragment key={i}>
            {businessZone?.type === 2 && Array.isArray(businessZone?.data) && (
              <Polygon
                coordinates={businessZone?.data.map((item: any) => ({ latitude: item.lat, longitude: item.lng }))}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
            {(businessZone.type === 1 && businessZone?.data?.center && businessZone?.data?.radio) && (
              <Circle
                center={{ latitude: businessZone?.data?.center.lat, longitude: businessZone?.data?.center.lng }}
                radius={businessZone?.data.radio * 1000}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
            {(businessZone.type === 5 && businessZone?.data?.distance) && (
              <Circle
                center={{ latitude: center.lat, longitude: center.lng }}
                radius={businessZone?.data.distance * units[businessZone?.data?.unit]}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
          </React.Fragment>
        ))}
      </MapView >
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
