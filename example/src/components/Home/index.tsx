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
    <View style={styles.container}>
      <View style={styles.wrapperContent}>
        <LogoWrapper>
          <OIcon src={applogo} style={styles.logo} />
        </LogoWrapper>
        <Slogan>
          <OIcon src={sloganImage} style={styles.slogan} />
        </Slogan>
      </View>
      <View style={styles.wrapperBtn}>
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
          style={styles.buttons}
          textStyle={{ color: 'white' }}
          onClick={() => onNavigationRedirect('AddressForm', { isGuestUser: true })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  },
  wrapperContent: {
    marginTop: 20
  },
  wrapperBtn: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginBottom: 5
  }
});
