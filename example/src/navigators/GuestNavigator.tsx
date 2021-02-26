import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import MapOrders from '../pages/MapOrders';

const Stack = createStackNavigator();

const GuestNavigator = (is_online: boolean) => {
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
		</Stack.Navigator>
	);
}

export default GuestNavigator;
