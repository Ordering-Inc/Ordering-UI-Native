
import AsyncStorage from '@react-native-community/async-storage';
import { useEffect, useState } from 'react'
import { STORAGE_KEY } from '../config/constants';

// localStorage Hook --------------------

export const useLocalStorage = (key: string, defaultValue: string) => {
    const stored = window.localStorage.getItem(key);
    const initial = stored ? JSON.parse(stored) : defaultValue;
    const [value, setValue] = useState(initial);

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

// End of LocalStorage Hook -------------


export const _retrieveStoreData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // We have data!!
            return JSON.parse(value) ? JSON.parse(value) : value;
        }
    } catch (error) {
        // Error retrieving data
        console.log('--------------- Occured Storage Fetching Data error --------------')
        console.log(error)
    }
};

export const _setStoreData = (key: string, val: any) => {
    try {
        AsyncStorage.setItem(
            key,
            typeof (val) === 'string' ? val : JSON.stringify(val)
        )
    } catch (error) {
        // Error retrieving data
        console.log('--------------- Occured Storage Setting Data error --------------')
        console.log(error)
    }
};

export const _removeStoreKey = async (key: string) => {
    try {
        return await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log('--------------- Occured Storage Removing Key error --------------')
        console.log(error)
    }
}

export const _removeStoreData = (keys: Array<string>) => {
    try {
        AsyncStorage.multiRemove(keys, (err) => {
            console.log(err)
        })
    } catch (error) {
        console.log('--------------- Occured Storage Removing Key error --------------')
        console.log(error)
    }
}

export const _clearStorage = () => {
    try {
        AsyncStorage.clear()
    } catch (error) {
        console.log('--------------- Occured Storage Clear error --------------')
        console.log(error)
    }
}


export const s_accessToken = async () => {
    try {
        const user = await _retrieveStoreData(STORAGE_KEY.USER);
        return user ? user.session.access_token : null;
    } catch (err) {
        return null;
    }
}

export const s_userInfo = async (key?: string) => {
    try {
        const user = await _retrieveStoreData(STORAGE_KEY.USER);
        return key == null ? user : user[key];
    } catch (err) {
        return null;
    }
}

export const s_setAvailable = async (status: boolean) => {
    try {
        let user = await _retrieveStoreData(STORAGE_KEY.USER);
        user.available = status;
        _setStoreData(STORAGE_KEY.USER, user);
    } catch (err) {
        return null;
    }
}

