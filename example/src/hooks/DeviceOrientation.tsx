import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const PORTRAIT = "portrait";
export const LANDSCAPE = "landscape";

export const useDeviceOrientation = (): [{
  orientation: "portrait" | "landscape",
  dimensions: { width: number, height: number }
}] => {

  const { width, height } = Dimensions.get('window');

  const [dimensions, setDimensions] = useState({ width, height });
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    width < height ? PORTRAIT : LANDSCAPE
  );

  useEffect(() => {
    Dimensions.addEventListener('change', ({ window: { width, height } }) => {

      setDimensions({ width, height });

      if (width < height) {
        setOrientation(PORTRAIT);
      } else {
        setOrientation(LANDSCAPE);
      }

    })
  }, []);

  return [{ orientation, dimensions }];
}

export const DeviceOrientationMethods = {
  PORTRAIT,
  LANDSCAPE,
  useDeviceOrientation
}
