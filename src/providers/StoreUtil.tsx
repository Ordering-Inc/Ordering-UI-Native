import AsyncStorage from '@react-native-community/async-storage';

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

export const clearAllData = () => {
  AsyncStorage.getAllKeys()
    .then(keys => AsyncStorage.multiRemove(keys))
    .then(() => console.log('success'));
}
