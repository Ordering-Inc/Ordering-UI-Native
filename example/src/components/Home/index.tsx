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
    sloganTitle,
    sloganSubtitle,
    onNavigationRedirect
  } = props;

  const [, t] = useLanguage();

  return (
    <View>
      <LogoWrapper>
        <OIcon src={applogo} style={styles.logo} />
      </LogoWrapper>
      <Slogan>
        <OIcon src={sloganImage} style={styles.slogan} />
        <OText size={48}>{sloganTitle}</OText>
        <OText size={18}>{sloganSubtitle}</OText>
      </Slogan>
      <OButton
        text={t('LOGIN_NOW', 'Login now')}
        bgColor={colors.primary}
        borderColor={colors.primary}
        style={styles.buttons}
        textStyle={{color: 'white'}}
        onClick={() => onNavigationRedirect('Login')}
      />
      <OButton
        text={t('SIGNUP', 'Signup')}
        bgColor={colors.white}
        borderColor={colors.primary}
        style={styles.buttons}
        onClick={() => onNavigationRedirect('Signup')}
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
    height: 300,
    width: 300
  },
  buttons: {
    marginVertical: 10,
    marginHorizontal: 30
  }
});
