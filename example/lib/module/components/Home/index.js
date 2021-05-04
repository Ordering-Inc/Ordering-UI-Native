import React from 'react';
import { useLanguage, useOrder } from 'ordering-components/native';
import { StyleSheet, View, Dimensions } from 'react-native';
import { colors } from '../../theme';
import { OButton, OIcon, OText } from '../shared';
import { LogoWrapper, Slogan } from './styles';
import { LanguageSelector } from '../LanguageSelector';
import { TouchableOpacity } from 'react-native-gesture-handler';

const sloganImage = require('../../assets/images/home-logo.png');

const applogo = require('../../assets/images/app-logo.png');

const windowHeight = Dimensions.get('window').height;
export const Home = props => {
  const {
    onNavigationRedirect
  } = props;
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.wrapperContent
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.languageSelector
  }, /*#__PURE__*/React.createElement(LanguageSelector, null)), /*#__PURE__*/React.createElement(LogoWrapper, null, /*#__PURE__*/React.createElement(OIcon, {
    src: applogo,
    style: styles.logo
  })), /*#__PURE__*/React.createElement(Slogan, null, /*#__PURE__*/React.createElement(OIcon, {
    src: sloganImage,
    style: styles.slogan
  }))), /*#__PURE__*/React.createElement(View, {
    style: styles.wrapperBtn
  }, /*#__PURE__*/React.createElement(OButton, {
    text: t('LOGIN_NOW', 'Login now'),
    bgColor: colors.primary,
    borderColor: colors.primary,
    style: styles.buttons,
    textStyle: {
      color: 'white'
    },
    onClick: () => onNavigationRedirect('Login')
  }), /*#__PURE__*/React.createElement(OButton, {
    text: t('SIGNUP', 'Signup'),
    bgColor: colors.white,
    borderColor: colors.primary,
    style: styles.buttons,
    onClick: () => onNavigationRedirect('Signup')
  }), /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: { ...styles.textLink,
      marginTop: 15
    },
    onPress: () => {
      var _orderState$options, _orderState$options$a;

      return orderState !== null && orderState !== void 0 && (_orderState$options = orderState.options) !== null && _orderState$options !== void 0 && (_orderState$options$a = _orderState$options.address) !== null && _orderState$options$a !== void 0 && _orderState$options$a.address ? onNavigationRedirect('BusinessList', {
        isGuestUser: true
      }) : onNavigationRedirect('AddressForm', {
        isGuestUser: true
      });
    }
  }, /*#__PURE__*/React.createElement(OText, {
    weight: "bold",
    size: 18
  }, t('CONTINUE_AS_GUEST', 'Continue as guest')))));
};
const styles = StyleSheet.create({
  languageSelector: {
    marginRight: 10
  },
  textLink: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    height: 80,
    width: 250,
    marginTop: 10
  },
  slogan: {
    height: windowHeight / 2,
    width: 400
  },
  buttons: {
    marginVertical: 10,
    marginHorizontal: 30
  },
  sloganText: {
    textAlign: 'center'
  },
  wrapperContent: {
    marginTop: 20
  },
  wrapperBtn: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginBottom: 20
  }
});
//# sourceMappingURL=index.js.map