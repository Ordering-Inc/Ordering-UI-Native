import React, { useEffect, useState } from 'react'
import { getTrackingStatus } from 'react-native-tracking-transparency'
import Geolocation from '@react-native-community/geolocation'
import Geocoder from 'react-native-geocoding'
import { GpsButtonStyle } from './styles'
import { View } from 'react-native'
import { OText } from '../shared'
import { ActivityIndicator } from 'react-native-paper'

export const GPSButton = (props: any) => {
  const {
    handleGPS,
		apiKey,
    googleReady,
    IconButton,
    IconLoadingButton
  } = props

	const [isLoading, setLoading] = useState(false);

	const geoCodePosition = (pos: { latitude: number, longitude: number }) => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude
    }).then(({ results }: any) => {
      let zipcode = null
      if (results && results.length > 0) {
        for (const component of results[0].address_components) {
          const addressType = component.types[0]
          if (addressType === 'postal_code') {
            zipcode = component.short_name
            break
          }
        }
        let data = null
        const details = {
          geometry: { location: { lat: pos.latitude, lng: pos.longitude } }
        }
        // if (isSetInputs) {
          data = {
            address: results[0]?.formatted_address,
            location: results[0]?.geometry?.location,
            zipcode,
            place_id: results[0]?.place_id,
          }
					console.log(JSON.stringify(data));
        // }
        handleGPS && handleGPS(data, details)
      } else {
        // setMapErrors && setMapErrors('ERROR_NOT_FOUND_ADDRESS')
      }
			setLoading(false);
    }).catch((err: any) => {
      console.log(err);
			setLoading(false);
    })
  }

	const getCurrentPosition = async () => {
		const trackingStatus = await getTrackingStatus()
		if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
      setLoading(true);
      Geolocation.getCurrentPosition((pos) => {
        geoCodePosition(pos.coords);
      }, (err) => {
        setLoading(false);
        console.log(err);
      });
    }
	}

	useEffect(() => {
		Geocoder.init(apiKey);
	}, [])

  return (
    <GpsButtonStyle
      disabled={isLoading}
      onPress={getCurrentPosition}
    >
      {isLoading ? (
				IconLoadingButton ? IconLoadingButton : <ActivityIndicator size={'small'} />
      ) : (
        IconButton ? IconButton : <OText>{'GPS'}</OText>
      )}
    </GpsButtonStyle>
  )
}
