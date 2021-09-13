import { useEffect, useState, useRef } from 'react';
import GeoLocation from 'react-native-geolocation-service';
import { Location } from '../types';

export const useLocation = () => {
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
            latitude: coords.latitude,
            longitude: coords.longitude,
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
        const location: Location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          speed: coords.speed,
        };
        setUserLocation(location);
        setRoutesLines(routes => [...routes, location]);
      },
      err => console.log(err),
      { enableHighAccuracy: true, distanceFilter: 1 },
    );
  };

  const stopFollowUserLocation = () => {
    if (watchId.current) GeoLocation.clearWatch(watchId.current);
  };

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
    userLocation,
    routeLines,
  };
};
