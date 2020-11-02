/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './pages/Login';
import MapOrders from './pages/MapOrders';
import OrderDetail from './pages/OrderDetail';
import Forgot from './pages/Forgot';

import { light } from './theme'
import { ThemeProvider } from 'styled-components/native'
import Reject from './pages/Reject';
import Accept from './pages/Accept';
import MapBusiness from './pages/MapBusiness';
import SideMenu from './pages/SideMenu';
import Chat from './pages/Chat';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainNavStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="Forgot"
        component={Forgot}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="Home"
        component={NavDraw}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

const NavDraw = () => {
  return (
    <Drawer.Navigator drawerContent={props => <SideMenu {...props} />}>
      <Drawer.Screen 
        name="OrderView"
        component={NavStack}
      />
    </Drawer.Navigator>
  )
}

const NavStack = (is_online: boolean) => {
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
        initialParams={{is_online: is_online}}
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
      
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <>
      <ThemeProvider theme={ light }>
        <NavigationContainer>
          <MainNavStack />
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
};

export default App;
