import AsyncStorage from "@react-native-community/async-storage";
import { Ordering } from "ordering-api-sdk"
import { STORAGE_KEY } from "../config/constants";
import { s_accessToken, s_userInfo, _retrieveStoreData } from "./StoreUtil";

class ApiProvider {
    sdk = new Ordering({
        url: 'https://apiv4.ordering.co',
        version: 'v400',
        project: 'dragonteam1',
        language: 'en',
        accessToken: '',
        apiKey: ''
    })

    login = async (credential: any) => {
        try {
            return this.sdk.users().auth(credential)
        } catch (err) {
            console.log(err);
        }
    }

    forgot = async (email: string) => {
        try {
            return this.sdk.users().forgotPassword({email: email})
        } catch (err) {
            console.log(err)
        }
    }

    getOrders = async (options: any) => {
        try {
            return this.sdk.setAccessToken(await s_accessToken()).orders().asDashboard().get(options)
        } catch (err) {
            console.log(err)
        }
    }

    updateUser = async (options: any) => {
        try {
            const user_id = await s_userInfo('id');
            console.log(options)
            return this.sdk.setAccessToken(await s_accessToken()).users(user_id).save(options)
        } catch (err) {
            console.log(err)
        }
    }

    updateOrder = async (options: any) => {
        try {
            return this.sdk.setAccessToken(await s_accessToken()).orders(options.order_id).save(options);
        } catch (err) {
            console.log(err)
        }
    }
}

export default ApiProvider;
