import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigators/RootNavigator';
import { navigationRef } from './navigators/NavigationRef';
import {useSession, useOrder} from 'ordering-components/native'

const AppContainer = () => {
  const [{auth}] = useSession()
  const [orderState] = useOrder()

  const linking : any = {
    prefixes: [
      'delivery://',
      'https://delivery.ordering.co',
      'https://*.ordering.co'
    ],
    config: {
      screens: {
        AddressForm: {
          path: !orderState?.options?.address?.location && !auth && 'business/:store/:businessId?/:categoryId?/:productId?',
          parse: {
            store: (store : string) => `${store}`,
            businessId: (id: string) => parseInt(id),
            categoryId: (id: string) => parseInt(id),
            productId: (id: string) => parseInt(id)
          }
        },
        Business: {
          path: orderState?.options?.address?.location && !auth && 'business/:store/:businessId?/:categoryId?/:productId?',
          parse: {
            store: (store : string) => `${store}`,
            businessId: (id: string) => parseInt(id),
            categoryId: (id: string) => parseInt(id),
            productId: (id: string) => parseInt(id)
          },
        },
        MyAccount: {
          screens: {
            Business: {
              path: auth && 'business/:store/:businessId?/:categoryId?/:productId?',
              parse: {
                store: (store : string) => `${store}`,
                businessId: (id: string) => parseInt(id),
                categoryId: (id: string) => parseInt(id),
                productId: (id: string) => parseInt(id)
              }
            },
            CheckoutNavigator: {
              path: auth && 'checkout/:cartUuid',
              parse: {
                cartUuid: (id : string) => `${id}`
              }
            },
            OrderDetails: {
              path: auth && 'order/:orderId',
              parse: {
                orderId: (id : string) => `${id}`
              }
            }
          }
        },
        NotFound: {
          path: '*'
        }
      }
    }
  }

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  )
}

export default AppContainer
