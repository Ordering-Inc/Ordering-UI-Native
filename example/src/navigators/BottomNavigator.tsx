import React from 'react'
import { View, Platform, PlatformIOSStatic } from 'react-native'
import { useOrder, useLanguage } from 'ordering-components/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import styled from 'styled-components/native'

import BusinessList from '../pages/BusinessesListing'
import MyOrders from '../pages/MyOrders'
import CartList from '../pages/CartList'
import Profile from '../pages/Profile'
import { useTheme } from 'styled-components/native'
import { OIcon, OText } from '../themes/instacart/'
import SearchBusinessPage from '../pages/Search'

const CartsLenght = styled.View`
  width: 15px;
  height: 15px;
  background-color: ${(props: any) => props.theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 2px;
`

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  const theme = useTheme()
  const [{ carts }] = useOrder()
  const [,t] = useLanguage();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []
  const isIos = Platform.OS === 'ios'
  const platformIOS = Platform as PlatformIOSStatic
  const androidStyles = isIos
    ? platformIOS.isPad
      ? { paddingBottom: 30 }
      : {}
    : {}
  return (
    <Tab.Navigator
      initialRouteName='BusinessList'
      activeColor={theme.colors.primary}
      barStyle={{ backgroundColor: theme.colors.backgroundTab, ...androidStyles, alignItems: 'center', justifyContent: 'space-around' }}
      labeled={false}
      inactiveColor={theme.colors.disabled}
    >
      <Tab.Screen
        name="BusinessList"
        component={BusinessList}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{ width: 50, height: 50, justifyContent: !isIos ? 'flex-start' : 'space-evenly', alignItems: 'center', position: 'relative', bottom: !isIos ? 10 : 0  }}>
                <OIcon src={theme.images.general.tab_home} color={color} width={16} />
					 <OText size={10} lineHeight={15} color={color}>{t('HOME','Home')}</OText>
              </View>
            )
        }}
      />
      <Tab.Screen
        name="SearchBusiness"
        component={SearchBusinessPage}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{ width: 50, height: 50, justifyContent: !isIos ? 'flex-start' : 'space-evenly', alignItems: 'center', position: 'relative', bottom: !isIos ? 10 : 0  }}>
                <OIcon src={theme.images.general.tab_explore} color={color} width={16} />
					 <OText size={10} lineHeight={15} color={color}>{t('EXPLORE','Explore')}</OText>
              </View>
            )
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyOrders}
        options={
          {
            tabBarIcon:
              ({ color }) => (
                <View style={{ width: 50, height: 50, justifyContent: !isIos ? 'flex-start' : 'space-evenly', alignItems: 'center', position: 'relative', bottom: !isIos ? 10 : 0 }}>
                  <OIcon src={theme.images.general.tab_orders} color={color} width={16} />
						<OText size={10} lineHeight={15} color={color}>{t('ORDERS','Orders')}</OText>
                </View>
              ),
          }}
      />
      {/* <Tab.Screen
        name="Cart"
        component={CartList}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{
                  width: 50,
                  height: 50,
                  justifyContent: !isIos ? 'flex-start' : 'space-evenly',
						alignItems: 'center',
                  position: 'relative',
                  bottom: !isIos ? 10 : 0
                }}
              >
                <OIcon src={theme.images.general.tab_promotion} color={color} width={16} />
                {cartsList.length > 0 && (
                  <CartsLenght style={{ borderRadius: 100 / 2 }}>
                    <OText
						  		size={10}
                      color={theme.colors.white}
                    >
                      {cartsList.length}
                    </OText>
                  </CartsLenght>
                )}
					 <OText size={10} lineHeight={15} color={color}>{t('CART','Cart')}</OText>
              </View>
            )
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{ width: 50, height: 50, justifyContent: !isIos ? 'flex-start' : 'space-evenly', alignItems: 'center', position: 'relative', bottom: !isIos ? 10 : 0  }}>
                <OIcon src={theme.images.general.tab_profile} color={color} width={16} />
					 <OText size={10} lineHeight={15} color={color}>{t('PROFILE','Profile')}</OText>
              </View>
            )
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator
