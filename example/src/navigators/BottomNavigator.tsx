import React from 'react'
import { View, Platform } from 'react-native'
import { useLanguage, useOrder } from 'ordering-components/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { theme } from '../../themes/original'
import { OIcon, OText } from '../components/shared'

import BusinessList from '../pages/BusinessesListing'
import MyOrders from '../pages/MyOrders'
import CartList from '../pages/CartList'
import Profile from '../pages/Profile'

const CartsLenght = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${theme.colors.red};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 7px;
`

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {

  const [, t] = useLanguage()
  const [{ carts }] = useOrder()
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []
  const isIos = Platform.OS === 'ios'
  const androidStyles = isIos ? {} : {height: 40, position: 'relative', bottom: 15}
  return (
    <Tab.Navigator
      initialRouteName='BusinessList'
      activeColor={theme.colors.primary}
      barStyle={{ backgroundColor: theme.colors.white }}
      labeled={false}
      inactiveColor={theme.colors.disabled}
    >
      <Tab.Screen
        name="BusinessList"
        component={BusinessList}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', position: 'relative', bottom: 10 }}>
                <OIcon src={theme.images.tabs.explorer} width={16} color={color} />
					 <OText size={10} color={theme.colors.textSecondary} style={{lineHeight: 15}}>{t('EXPLORE', 'Explore')}</OText>
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
                <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', position: 'relative', bottom: 10 }}>
                  <OIcon src={theme.images.tabs.orders} width={16} color={color} />
					 <OText size={10} color={theme.colors.textSecondary} style={{lineHeight: 15}}>{t('ORDERS', 'Orders')}</OText>
                </View>
              ),
          }}
      />
      <Tab.Screen
        name="Cart"
        component={CartList}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center', alignItems: 'center',
                  position: 'relative',
                  bottom: 10
                }}
              >
                <OIcon src={theme.images.tabs.my_carts} width={16} color={color} />
					 <OText size={10} color={theme.colors.textSecondary} style={{lineHeight: 15}}>{t('MY_CARTS', 'My carts')}</OText>
                {cartsList.length > 0 && (
                  <CartsLenght style={{ borderRadius: 100 / 2 }}>
                    <OText size={7}
                      color={theme.colors.white}
                    >
                      {cartsList.length}
                    </OText>
                  </CartsLenght>
                )}
              </View>
            )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', position: 'relative', bottom: 10  }}>
                <OIcon src={theme.images.tabs.profile} width={16} color={color} />
					 <OText size={10} color={theme.colors.textSecondary} style={{lineHeight: 15}}>{t('PROFILE', 'Profile')}</OText>
              </View>
            )
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator
