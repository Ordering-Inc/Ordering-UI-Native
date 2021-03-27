import React from 'react';
import { useLanguage } from 'ordering-components/native';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';
import { OButton, OIcon, OText } from '../shared';
import { LogoWrapper, Slogan } from './styles';

const sloganImage = require('../../assets/images/product.png');
const applogo = require('../../assets/images/app-logo.png');

export const Home = (props: any) => {
  const {
    onNavigationRedirect
  } = props;

  const [, t] = useLanguage();

  return (
    <View style={{ width: '100%' }}>
      <LogoWrapper>
        <OIcon src={applogo} style={styles.logo} />
      </LogoWrapper>
      <Slogan>
        <OIcon src={sloganImage} style={styles.slogan} />
      </Slogan>
      <OButton
        text={t('LOGIN_NOW', 'Login now')}
        bgColor={colors.primary}
        borderColor={colors.primary}
        style={styles.buttons}
        textStyle={{ color: 'white' }}
        onClick={() => onNavigationRedirect('Login')}
      />
      <OButton
        text={t('SIGNUP', 'Signup')}
        bgColor={colors.white}
        borderColor={colors.primary}
        style={styles.buttons}
        onClick={() => onNavigationRedirect('Signup')}
      />
      <OButton
        text={t('CONTINUE_AS_GUEST', 'Continue as guest')}
        bgColor={colors.primary}
        borderColor={colors.primary}
        style={{ ...styles.buttons, marginTop: 40 }}
        textStyle={{ color: 'white' }}
        onClick={() => onNavigationRedirect('AddressForm', { isGuestUser: true })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 80,
    width: 250,
    marginTop: 10
  },
  slogan: {
    height: 230,
    width: 300
  },
  buttons: {
    marginVertical: 10,
    marginHorizontal: 30
  },
  sloganText: {
    textAlign: 'center'
  }
});
