import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import MapOrders from '../pages/MapOrders';
import OrderDetail from '../pages/OrderDetail';
import Forgot from '../pages/ForgotPassword';
import Reject from '../pages/Reject';
import Accept from '../pages/Accept';
import MapBusiness from '../pages/MapBusiness';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import Supports from '../pages/Supports';
import AddressList from '../pages/AddressList'
import AddressForm from '../pages/AddressForm'

const Stack = createStackNavigator();

const HomeNavigator = (is_online: boolean) => {
	return (
		<Stack.Navigator
			initialRouteName='MapOrders'
			screenOptions={{
				headerTitleAlign: 'center',
				headerStyle: {
					backgroundColor: '#621FF7',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
			}}
		>
			<Stack.Screen
				name="MapOrders"
				component={MapOrders}
				options={{ title: 'Recieve Order', headerShown: false }}
				initialParams={{ is_online: is_online }}
			/>
			<Stack.Screen
				name="OrderDetail"
				component={OrderDetail}
				options={{ title: 'Order Detail', headerShown: false }}
			/>
			<Stack.Screen
				name="Forgot"
				component={Forgot}
				options={{ title: 'Forgot Password', headerShown: false }}
			/>
			<Stack.Screen
				name="Reject"
				component={Reject}
				options={{ title: 'Reject Order', headerShown: false }}
			/>
			<Stack.Screen
				name="Accept"
				component={Accept}
				options={{ title: 'Accept Order', headerShown: false }}
			/>
			<Stack.Screen
				name="MapBusiness"
				component={MapBusiness}
				options={{ title: 'Map Business', headerShown: false }}
			/>
			<Stack.Screen
				name="Chat"
				component={Chat}
				options={{ title: 'Chat Screen', headerShown: false }}
			/>
			<Stack.Screen
				name="Profile"
				component={Profile}
				options={{ title: 'User\'s Profile', headerShown: false }}
			/>
			<Stack.Screen
				name="Supports"
				component={Supports}
				options={{ title: 'FAQ and Supports', headerShown: false }}
			/>
			<Stack.Screen
				name="AddressList"
				component={AddressList}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="AddressForm"
				component={AddressForm}
				options={{ headerShown: false }}
			/>

		</Stack.Navigator>
	);
}

export default HomeNavigator;
