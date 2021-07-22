import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigators/RootNavigator';
import { navigationRef } from './navigators/NavigationRef';
import {useSession, useOrder} from 'ordering-components/native'

const AppContainer = () => {
  const [{auth}] = useSession()
  const [orderState] = useOrder()
  const linking = {
    prefixes: [
      'delivery://',
      'https://delivery.ordering.co'
    ],
    config: {
      screens: {
        AddressForm: {
          path: !orderState?.options?.address?.location && 'business/:store/:businessId?/:categoryId?/:productId?'
        },
        Login: {
          path: 'login'
        },
        NotFound: {
          path: '*'
        },
        Business: {
          path: orderState?.options?.address?.location && 'business/:store/:businessId?/:categoryId?/:productId?',
          parse: {
            store: (store : string) => `${store}`,
            businessId: (id: string) => parseInt(id),
            categoryId: (id: string) => parseInt(id),
            productId: (id: string) => parseInt(id)
          }
        }
      }
    },
  };

  const linkingLogged = {
    prefixes: [
      'delivery://',
      'https://delivery.ordering.co'
    ],
    config: {
      screens: {
        MyAccount: {
          screens: {
            BottomTab: {
              screens: {
                BusinessList: {
                  path: 'businesslist'
                },
                Profile: {
                  path: 'profile'
                },
                MyOrders: {
                  path: 'myorders'
                },
                Cart: {
                  path: 'cart'
                }
              }
            },
            Business: {
              path: 'business/:store/:businessId?/:categoryId?/:productId?',
              parse: {
                store: (store : string) => `${store}`,
                businessId: (id: string) => parseInt(id),
                categoryId: (id: string) => parseInt(id),
                productId: (id: string) => parseInt(id)
              }
            },
            CheckoutNavigator: {
              path: 'checkout/:cartUuid',
              parse: {
                cartUuid: (id : string) => `${id}`
              }
            },
            OrderDetails: {
              path: 'order/:orderId',
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
    <NavigationContainer linking={auth ? linkingLogged : linking} ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  )
}

export default AppContainer
