import AsyncStorage from '@react-native-community/async-storage';
import { useEffect, useState } from 'react'; // localStorage Hook --------------------

export const useLocalStorage = (key, defaultValue) => {
  const stored = window.localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;
  const [value, setValue] = useState(initial);
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};
export const _retrieveStoreData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return JSON.parse(value);
    }
  } catch {
    return null;
  }
};
export const _setStoreData = (key, val) => {
  try {
    AsyncStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
  } catch (error) {
    // Error retrieving data
    console.log('--------------- Occured Storage Setting Data error --------------');
    console.log(error);
  }
};
export const clearAllData = () => {
  AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys)).then(() => alert('success'));
};
//# sourceMappingURL=StoreUtil.js.map