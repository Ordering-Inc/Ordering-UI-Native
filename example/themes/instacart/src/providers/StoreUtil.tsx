import AsyncStorage from '@react-native-async-storage/async-storage';

export const _retrieveStoreData = async (key: string) => {
  if (!key) return
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
  if (!key) return
  try {
    AsyncStorage.setItem(
      key,
      typeof (val) === 'string' ? val : JSON.stringify(val)
    )
  } catch {
    return null
  }
};

export const _removeStoreData = (key: string) => {
  if (!key) return
  try {
    AsyncStorage.removeItem(key)
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

export const StoreMethods = {
  _retrieveStoreData,
  _setStoreData,
  _removeStoreData,
  _clearStoreData
}
