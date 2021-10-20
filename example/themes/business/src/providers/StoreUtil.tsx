import AsyncStorage from '@react-native-async-storage/async-storage';
import { flatArray } from '../utils'

export const _retrieveStoreData = async (key: string) => {
  if (!key) return
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch {
    return null
  }
};

export const _setStoreData = async (key: string, val: any) => {
  if (!key) return
  try {
    const value = JSON.stringify(val)
    await AsyncStorage.setItem(key, value)
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

export const _clearStoreData = async (options: any = {}) => {
  try {
    const keys: any = await AsyncStorage.getAllKeys()
    let filterKeys: any = keys
    if (options?.excludedKeys) {
      filterKeys = filterKeys.filter((k: any) => !options?.excludedKeys.includes(k))
    }
    if (options?.includedKeys) {
      filterKeys.push(options?.includedKeys)
    }
    AsyncStorage.multiRemove(flatArray(filterKeys))
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
