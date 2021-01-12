import AsyncStorage from '@react-native-community/async-storage'

export class NativeStrategy {
  async getItem (storageKey: string, isJson: any) {
    const value = await AsyncStorage.getItem(storageKey)
    if (isJson && typeof value !== 'object') {
      return JSON.parse(value)
    }
    return value
  }

  async setItem (key: string, val: any, isJson = false) {
    const value = isJson ? JSON.stringify(val) : val
    await AsyncStorage.setItem(key, value)
  }

  async removeItem (key: string) {
    await AsyncStorage.removeItem(key)
  }
}
