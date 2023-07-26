import { useEffect, useState, useRef } from 'react';
import GeoLocation from 'react-native-geolocation-service';
import { Location } from '../types';
import {useApi, useSession, useLanguage} from 'ordering-components/native'

export const useLocation = () => {
  const [,t] = useLanguage()
  const [ordering] = useApi()
  const [{token, user}] = useSession()
  const [hasLocation, setHasLocation] = useState(false);
  const [initialPosition, setInitialPosition] = useState<Location>({
    longitude: 0,
    latitude: 0,
    speed: 0,
  });
  const [userLocation, setUserLocation] = useState<Location>({
    longitude: 0,
    latitude: 0,
    speed: 0,
  });
  const [newLocation,setNewLocation] = useState<any>({ loading: false, error: null, newLocation: null })
  const [routeLines, setRoutesLines] = useState<Location[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const watchId = useRef<number>();

  useEffect(() => {
    getCurrentLocation()
      .then(location => {
        if (!isMounted.current) return;
        setInitialPosition(location);
        setUserLocation(location);
        setRoutesLines(routes => [...routes, location]);
        setHasLocation(true);
      })
      .catch(err => console.log(err));
  }, []);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      GeoLocation.getCurrentPosition(
        ({ coords }) => {
          resolve({
            latitude: typeof coords.latitude === 'number' && !Number.isNaN(coords.latitude) ? coords.latitude : 0,
            longitude: typeof coords.longitude === 'number' && !Number.isNaN(coords.longitude) ? coords.longitude : 0,
            speed: coords.speed,
          });
        },
        err => reject({ err }),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  };

  const followUserLocation = () => {
    watchId.current = GeoLocation.watchPosition(
      ({ coords }) => {
        if (!isMounted.current) return;
        if (typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') return
        const location: Location = {
          latitude: coords.latitude || 0,
          longitude: coords.longitude || 0,
          speed: coords.speed,
        };
        setUserLocation(location);
        setRoutesLines(routes => [...routes, location]);
      },
      err => console.log(err),
      { enableHighAccuracy: true, distanceFilter: 3 },
    );
  };

  const stopFollowUserLocation = () => {
    if (watchId.current) GeoLocation.clearWatch(watchId.current);
  };

  const updateDriverPosition = async (newLocation = {}) => {
    try {
      setNewLocation({...newLocation, loading: true})
      const { content: { error, result } } = await ordering.setAccessToken(token).users(user?.id).driverLocations().save(newLocation)
      if (error) {
        setNewLocation({ ...newLocation, loading: false, error: [result[0] || result || t('ERROR_UPDATING_POSITION', 'Error updating position')] })
      } else {
        setNewLocation({ ...newLocation, loading: false, newLocation: { ...newLocation, ...result } })
      }
    } catch (error : any) {
      setNewLocation({ ...newLocation, loading: false, error: [error?.message || t('NETWORK_ERROR', 'Network Error')] })
    }
  }

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
    userLocation,
    routeLines,
    updateDriverPosition,
    newLocation,
    setNewLocation
  };
};
