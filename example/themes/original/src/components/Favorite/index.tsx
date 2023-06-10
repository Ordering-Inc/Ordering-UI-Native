import React, { useState } from 'react'
import { useLanguage, useOrder } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { Platform } from 'react-native'
import { FavoriteList } from '../FavoriteList'
import NavBar from '../NavBar'
import { OText } from '../shared'

import {
  TabContainer,
  Tab,
  Container
} from './styles'

export const Favorite = (props: any) => {
  const {
    navigation,
    franchiseId
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [orderState] = useOrder()
  const [tabSelected, setTabSelected] = useState('businesses')

  const tabList = [
    { key: 'businesses', name: t('BUSINESSES', 'Businesses') },
    { key: 'products', name: t('PRODUCTS', 'Products') },
    { key: 'orders', name: t('ORDERS', 'Orders') }
  ]

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }

  return (
    <Container>
      <NavBar
        title={t('FAVORITE', 'Favorite')}
        titleAlign={'center'}
        onActionLeft={goToBack}
        showCall={false}
        paddingTop={10}
        btnStyle={{ paddingLeft: 0 }}
      />
      <TabContainer>
        {tabList.map((menu, i) => (
          <Tab
            key={i}
            active={menu.key === tabSelected}
            onPress={() => setTabSelected(menu.key)}
          >
            <OText
              color={menu.key === tabSelected ? theme.colors.textNormal : theme.colors.disabled}
              size={14}
              weight={menu.key === tabSelected ? '500' : '400'}
              style={{ marginBottom: 12 }}
            >
              {menu.name}
            </OText>
          </Tab>
        ))}
      </TabContainer>
      {tabSelected === 'businesses' && (
        <FavoriteList
          navigation={navigation}
          onNavigationRedirect={onRedirect}
          isBusiness
          favoriteURL='favorite_businesses'
          originalURL='business'
          location={`${orderState.options?.address?.location?.lat},${orderState.options?.address?.location?.lng}`}
          propsToFetch={['id', 'name', 'header', 'logo', 'location', 'address', 'ribbon', 'timezone', 'schedule', 'open', 'delivery_price', 'distance', 'delivery_time', 'pickup_time', 'reviews', 'featured', 'offers', 'food', 'laundry', 'alcohol', 'groceries', 'slug']}
          franchiseId={franchiseId}
        />
      )}
      {tabSelected === 'products' && (
        <FavoriteList
          favoriteURL='favorite_products'
          originalURL='products'
          onNavigationRedirect={onRedirect}
          isProduct
          franchiseId={franchiseId}
        />
      )}
      {tabSelected === 'orders' && (
        <FavoriteList
          onNavigationRedirect={onRedirect}
          favoriteURL='favorite_orders'
          originalURL='orders'
          isOrder
          franchiseId={franchiseId}
        />
      )}
    </Container>
  )
}
