import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useLanguage, useOrder } from 'ordering-components/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import { colors } from '../theme';
import { OText } from '../components/shared';
import BusinessList from '../pages/BusinessesListing';
import MyOrders from '../pages/MyOrders';
import CartList from '../pages/CartList';
import Profile from '../pages/Profile';
const CartsLenght = styled.View`
  width: 25px;
  height: 25px;
  background-color: ${colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
`;
const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  const [, t] = useLanguage();
  const [{
    carts
  }] = useOrder();
  const cartsList = carts && Object.values(carts).filter(cart => cart.products.length > 0) || [];
  return /*#__PURE__*/React.createElement(Tab.Navigator, {
    initialRouteName: "BusinessList",
    activeColor: colors.primary,
    barStyle: {
      backgroundColor: colors.white
    },
    labeled: false,
    inactiveColor: colors.disabled
  }, /*#__PURE__*/React.createElement(Tab.Screen, {
    name: "BusinessList",
    component: BusinessList,
    options: {
      tabBarIcon: ({
        color
      }) => /*#__PURE__*/React.createElement(View, {
        style: {
          width: 50,
          height: Platform.OS === 'ios' ? 50 : 'auto',
          justifyContent: 'space-evenly'
        }
      }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
        name: "home",
        size: 46,
        color: color
      }))
    }
  }), /*#__PURE__*/React.createElement(Tab.Screen, {
    name: "MyOrders",
    component: MyOrders,
    options: {
      tabBarIcon: ({
        color
      }) => /*#__PURE__*/React.createElement(View, {
        style: {
          width: 50,
          height: Platform.OS === 'ios' ? 50 : 'auto',
          justifyContent: 'space-evenly'
        }
      }, /*#__PURE__*/React.createElement(MaterialIcon, {
        name: "format-list-bulleted",
        size: 46,
        color: color
      }))
    }
  }), /*#__PURE__*/React.createElement(Tab.Screen, {
    name: "Cart",
    component: CartList,
    options: {
      tabBarIcon: ({
        color
      }) => /*#__PURE__*/React.createElement(View, {
        style: styles.wrappCartIcon
      }, /*#__PURE__*/React.createElement(MaterialIcon, {
        name: "shopping-basket",
        size: 46,
        color: color
      }), cartsList.length > 0 && /*#__PURE__*/React.createElement(CartsLenght, {
        style: {
          borderRadius: 100 / 2
        }
      }, /*#__PURE__*/React.createElement(OText, {
        color: colors.white
      }, cartsList.length)))
    }
  }), /*#__PURE__*/React.createElement(Tab.Screen, {
    name: "Profile",
    component: Profile,
    options: {
      tabBarIcon: ({
        color
      }) => /*#__PURE__*/React.createElement(View, {
        style: {
          width: 50,
          height: Platform.OS === 'ios' ? 50 : 'auto',
          justifyContent: 'space-evenly'
        }
      }, /*#__PURE__*/React.createElement(MaterialIcon, {
        name: "person",
        size: 46,
        color: color
      }))
    }
  }));
};

const styles = StyleSheet.create({
  wrappCartIcon: {
    width: 50,
    display: 'flex',
    justifyContent: 'space-evenly',
    position: 'relative',
    zIndex: 9999
  }
});
export default BottomNavigator;
//# sourceMappingURL=BottomNavigator.js.map