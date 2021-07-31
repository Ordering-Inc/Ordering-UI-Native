import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { useSession, useOrder } from 'ordering-components/native';

import BottomNavigator from '../navigators/BottomNavigator';
import RootNavigator from '../navigators/RootNavigator';
import CheckoutNavigator from '../navigators/CheckoutNavigator';

import AddressList from '../pages/AddressList';
import AddressForm from '../pages/AddressForm';
import OrderDetails from '../pages/OrderDetails';
import BusinessProductsList from '../pages/BusinessProductsList';
import ReviewOrder from '../pages/ReviewOrder'
import MomentOption from '../pages/MomentOption'
import Splash from '../pages/Splash';
import { UserProfileForm } from '../themes/original/components';

const Stack = createStackNavigator();

const HomeNavigator = (e: any) => {

	const { navigation, route } = e;

	const [orderState] = useOrder();
	const [{ auth }] = useSession();

	const profileProps = {
		...e,
		useSessionUser: true,
		useValidationFields: true,
		goToBack: () => navigation?.canGoBack() && navigation.goBack(),
		onNavigationRedirect: (route: string, params: any) => navigation.navigate(route, params)
	}

	return (
		<Stack.Navigator>
			{!orderState.loading || (orderState?.options?.user_id && orderState.loading) || orderState?.options?.address?.location ? (
				<>
					{auth ? (
						<>
							{!orderState?.options?.address?.location && !orderState.loading ? (
								<>
									<Stack.Screen
										name="AddressListInitial"
										component={AddressList}
										options={{ headerShown: false }}
										initialParams={{ afterSignup: true }}
									/>
									<Stack.Screen
										name="AddressFormInitial"
										component={AddressForm}
										options={{ headerShown: false }}
										initialParams={{ afterSignup: true }}
									/>
								</>
							) : (
								<>
									{!!Object.keys(e?.route?.params?.productLogin || {})?.length && (
										<Stack.Screen
											name="BusinessAfterLogin"
											component={BusinessProductsList}
											options={{ headerShown: false }}
											initialParams={{ productLogin: e?.route?.params?.productLogin }}
										/>
									)}
									<Stack.Screen
										name='BottomTab'
										component={BottomNavigator}
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name="CheckoutNavigator"
										component={CheckoutNavigator}
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name="OrderDetails"
										component={OrderDetails}
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name="Business"
										component={BusinessProductsList}
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name="ReviewOrder"
										component={ReviewOrder}
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name='MomentOption'
										component={MomentOption}
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name="AddressList"
										component={AddressList}
										options={{ headerShown: false }}
										initialParams={{ afterSignup: false }}
									/>
									<Stack.Screen
										name="AddressForm"
										component={AddressForm}
										options={{ headerShown: false }}
										initialParams={{ afterSignup: false }}
									/>
									<Stack.Screen
										name="ProfileForm"
										children={() => <UserProfileForm {...profileProps} />}
										options={{ headerShown: false }}
										initialParams={{ afterSignup: false }}
									/>
								</>
							)}
						</>
					)
						: (
							<Stack.Screen
								name='root'
								component={RootNavigator}
								options={{ headerShown: false }}
							/>
						)}
				</>
			) : (
				<Stack.Screen
					name="Splash"
					component={Splash}
					options={{ headerShown: false }}
				/>
			)}
		</Stack.Navigator>
	);
}

export default HomeNavigator;
