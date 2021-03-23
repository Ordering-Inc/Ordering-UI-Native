import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import BusinessList from '../pages/BusinessesListing'
import Profile from '../pages/Profile'
import MyOrders from '../pages/MyOrders'

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { colors } from '../theme'
import { Platform, View } from 'react-native'

const Tab = createMaterialBottomTabNavigator()

const BottomNavigator = () => {

  const [, t] = useLanguage()

  return (
    <Tab.Navigator
      initialRouteName='BusinessList'
      activeColor={colors.primary}
      barStyle={{ backgroundColor: colors.white }}
      labeled={false}
      inactiveColor={colors.disabled}
    >
      <Tab.Screen
        name="BusinessList"
        component={BusinessList}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{ width: 50, height: Platform.OS === 'ios' ? 50 : 'auto', justifyContent: 'space-evenly' }}>
                <MaterialCommunityIcon name='home' size={46} color={color} />
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
                <View style={{ width: 50, height: Platform.OS === 'ios' ? 50 : 'auto', justifyContent: 'space-evenly' }}>
                  <MaterialIcon name='format-list-bulleted' size={46} color={color} />
                </View>
              ),
          }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon:
            ({ color }) => (
              <View style={{ width: 50, height: Platform.OS === 'ios' ? 50 : 'auto', justifyContent: 'space-evenly' }}>
                <MaterialIcon name='person' size={46} color={color} />
              </View>
            )
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator
