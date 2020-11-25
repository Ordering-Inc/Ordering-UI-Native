import { Ordering } from "ordering-api-sdk"
import { accessToken } from "./Utilities";

const ApiProvider = () => {
    // const token = accessToken()
    return new Ordering({
        url: 'https://apiv4.ordering.co',
        version: 'v400',
        project: 'dragonteam1',
        language: 'en',
        accessToken: '',
        apiKey: ''
    })
}

export default ApiProvider;