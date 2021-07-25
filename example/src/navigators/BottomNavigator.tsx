import React from 'react'
import { View, Platform, PlatformIOSStatic } from 'react-native'
import { useOrder } from 'ordering-components/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { OText } from '../components/shared'
import BusinessList from '../pages/BusinessesListing'
import MyOrders from '../pages/MyOrders'
import CartList from '../pages/CartList'
import Profile from '../pages/Profile'
import { useTheme } from 'styled-components/native'
import { OIcon } from '../themes/instacart/components/shared'

const CartsLenght = styled.View`
  width: 25px;
  height: 25px;
  background-color: ${(props: any) => props.theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
`

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  const theme = useTheme()
  const [{ carts }] = useOrder()
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []
  const isIos = Platform.OS === 'ios'
  const platformIOS = Platform as PlatformIOSStatic
  const androidStyles = isIos
    ? platformIOS.isPad
      ? { paddingBottom: 30 }
      : {}
    : {height: 40, position: 'relative', bottom: 15}
  return (
    <Tab.Navigator
      initialRouteName='BusinessList'
      activeColor={theme.colors.primary}
      barStyle={{ backgroundColor: theme.colors.white, ...androidStyles }}
      labeled={false}
      inactiveColor={theme.colors.disabled}
    >
      <Tab.Screen
        name="BusinessList"
        component={BusinessList}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{ width: 50, height: 50, justifyContent: !isIos ? 'flex-start' : 'space-evenly', position: 'relative', bottom: !isIos ? 10 : 0  }}>
                <OIcon src={theme.images.general.tab_home} color={color} />
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
                <View style={{ width: 50, height: 50, justifyContent: !isIos ? 'flex-start' : 'space-evenly', position: 'relative', bottom: !isIos ? 10 : 0 }}>
                  <OIcon src={theme.images.general.tab_orders} color={color} />
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
                  justifyContent: !isIos ? 'flex-start' : 'space-evenly',
                  position: 'relative',
                  bottom: !isIos ? 10 : 0
                }}
              >
                <OIcon src={theme.images.general.tab_promotion} color={color} />
                {cartsList.length > 0 && (
                  <CartsLenght style={{ borderRadius: 100 / 2 }}>
                    <OText
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
              <View style={{ width: 50, height: 50, justifyContent: !isIos ? 'flex-start' : 'space-evenly', position: 'relative', bottom: !isIos ? 10 : 0  }}>
                <OIcon src={theme.images.general.tab_profile} color={color} />
              </View>
            )
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator
