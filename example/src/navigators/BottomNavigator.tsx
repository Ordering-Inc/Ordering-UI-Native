import React from 'react'
import { View, Platform, PlatformIOSStatic, ViewStyle, StyleSheet } from 'react-native'
import { useLanguage, useOrder } from 'ordering-components/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { colors, images } from '../themes/doordash/theme.json'
import { OIcon, OText } from '../components/shared'

import BusinessList from '../pages/BusinessesListing'
import MyOrders from '../pages/MyOrders'
import CartList from '../pages/CartList'
import Profile from '../pages/Profile'

const CartsLenght = styled.View`
  width: 18px;
  height: 18px;
  background-color: ${colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
`

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {

	const [, t] = useLanguage()
	const [{ carts }] = useOrder()
	const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []
	const isIos = Platform.OS === 'ios'
	const platformIOS = Platform as PlatformIOSStatic
	const androidStyles = isIos
		? platformIOS.isPad
			? { paddingBottom: 30 }
			: {}
		: { height: 40, position: 'relative', bottom: 15 }
	return (
		<Tab.Navigator
			initialRouteName='BusinessList'
			activeColor={colors.primary}
			barStyle={{ backgroundColor: colors.white, ...androidStyles } as ViewStyle}
			labeled={false}
			inactiveColor={colors.disabled}
		>
			<Tab.Screen
				name="BusinessList"
				component={BusinessList}
				options={{
					tabBarIcon:
						({ color }) => (
							<View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: !isIos ? 'center' : 'center', position: 'relative', bottom: !isIos ? 10 : 0 }}>
								<OIcon src={images.general.tab_home} color={color} />
								<OText size={10} color={color}>{t('TAB_HOME', 'Home')}</OText>
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
								<View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: !isIos ? 'center' : 'center', position: 'relative', bottom: !isIos ? 10 : 0 }}>
									<OIcon src={images.general.tab_orders} color={color} />
									<OText size={10} color={color}>{t('TAB_ORDERS', 'Orders')}</OText>
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
								alignItems: 'center',
								justifyContent: !isIos ? 'flex-start' : 'space-evenly',
								position: 'relative',
								bottom: !isIos ? 10 : 0
							}}
							>
								<OIcon src={images.general.tab_search} color={color} />
								<OText size={10} color={color}>{t('TAB_ORDERS', 'Orders')}</OText>
								{cartsList.length > 0 && (
									<CartsLenght style={{ borderRadius: 100 / 2 }}>
										<OText
											size={10}
											color={colors.white}
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
							<View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: !isIos ? 'flex-start' : 'space-evenly', position: 'relative', bottom: !isIos ? 10 : 0 }}>
								<OIcon src={images.general.tab_profile} color={color} />
								<OText size={10} color={color}>{t('TAB_PROFILE', 'Profile')}</OText>
							</View>
						)
				}}
			/>
		</Tab.Navigator>
	);
}

const tabStyles = StyleSheet.create({
	itemCont: {
		alignItems: 'center'
	}
});

export default BottomNavigator
