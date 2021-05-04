import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useOrder, useSession } from 'ordering-components/native';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home';
import AddressForm from '../pages/AddressForm';
import MomentOption from '../pages/MomentOption';
import Splash from '../pages/Splash';
import BusinessList from '../pages/BusinessesListing';
import BusinessProductsList from '../pages/BusinessProductsList';
import HomeNavigator from './HomeNavigator';
const Stack = createStackNavigator();

const RootNavigator = () => {
  const [{
    auth,
    user,
    loading
  }, {
    login
  }] = useSession();
  const [orderStatus] = useOrder();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loaded && !orderStatus.loading) {
      setLoaded(true);
    }
  }, [orderStatus]);
  useEffect(() => {
    if (!loading) {
      setLoaded(!auth);
    }
  }, [loading]);
  return /*#__PURE__*/React.createElement(Stack.Navigator, null, !loaded && /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "Splash",
    component: Splash,
    options: {
      headerShown: false
    }
  }), loaded && /*#__PURE__*/React.createElement(React.Fragment, null, !auth ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "Home",
    component: Home,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "Login",
    component: Login,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "Signup",
    component: Signup,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "Forgot",
    component: Forgot,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "AddressForm",
    component: AddressForm,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "BusinessList",
    component: BusinessList,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "Business",
    component: BusinessProductsList,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "MomentOption",
    component: MomentOption,
    options: {
      headerShown: false
    }
  })) : /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "MyAccount",
    component: HomeNavigator,
    options: {
      headerShown: false
    }
  })));
};

export default RootNavigator;
//# sourceMappingURL=RootNavigator.js.map