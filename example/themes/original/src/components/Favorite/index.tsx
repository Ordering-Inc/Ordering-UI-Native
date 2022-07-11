import React, { useState } from 'react'
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import NavBar from '../NavBar'
import { OText } from '../shared'
import { FavoriteBusinesses } from '../FavoriteBusinesses'
import { FavoriteProducts } from '../FavoriteProducts'
import { FavoriteOrders } from '../FavoriteOrders'

import {
  TabContainer,
  Tab,
  Container
} from './styles'

export const Favorite = (props: any) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [refreshing] = useState(false);
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
        <FavoriteBusinesses
          navigation={navigation}
          onNavigationRedirect={onRedirect}
        />
      )}
      {tabSelected === 'products' && <FavoriteProducts />}
      {tabSelected === 'orders' && <FavoriteOrders onNavigationRedirect={onRedirect} />}
    </Container>
  )
}
