
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import SideMenu from '../pages/SideMenu';
import GuestNavigator from './GuestNavigator';

const Drawer = createDrawerNavigator();

const DrawGuestNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props: any) => <SideMenu {...props} />}>
      <Drawer.Screen 
        name="Guest"
        component={GuestNavigator}
      />
    </Drawer.Navigator>
  )
}

export default DrawGuestNavigator;
