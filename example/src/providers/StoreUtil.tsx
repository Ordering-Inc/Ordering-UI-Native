
import AsyncStorage from '@react-native-community/async-storage';

export const _retrieveStoreData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value)
    }
  } catch {
    return null
  }
};

export const _setStoreData = (key: string, val: any) => {
  try {
    AsyncStorage.setItem(
      key,
      typeof (val) === 'string' ? val : JSON.stringify(val)
    )
  } catch {
    return null
  }
};

export const _clearStoreData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys()
    AsyncStorage.multiRemove(keys)
  } catch {
    return null
  }
}
