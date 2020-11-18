import { Ordering } from "ordering-api-sdk"

const ApiProvider = (token?: string) => {
    return new Ordering({
        url: 'https://apiv4.ordering.co',
        version: 'v400',
        project: 'dragonteam1',
        language: 'en',
        accessToken: token,
        apiKey: ''
    })
}

export default ApiProvider;