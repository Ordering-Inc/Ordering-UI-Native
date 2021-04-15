import React from 'react';
import { useLanguage,useOrder } from 'ordering-components/native';
import { StyleSheet, View, Dimensions } from 'react-native';
import { colors } from '../../theme';
import { OButton, OIcon, OText } from '../shared';
import { LogoWrapper, Slogan } from './styles';
import { LanguageSelector } from '../LanguageSelector'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const sloganImage = require('../../assets/images/home-logo.png');
const applogo = require('../../assets/images/app-logo.png');

const windowHeight = Dimensions.get('window').height

export const Home = (props: any) => {
  const {
    onNavigationRedirect
  } = props;

  const [, t] = useLanguage();
  const [orderState] = useOrder()


  return (
    <View style={{ width: '100%' }}>
      <View style={styles.languageSelector}>
        <LanguageSelector />
      </View>
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
      <TouchableOpacity
        style={{ ...styles.textLink, marginTop: 40 }}
        onPress={() => orderState?.options?.address ? onNavigationRedirect('BusinessList', { isGuestUser: true }) : onNavigationRedirect('AddressForm', { isGuestUser: true })}
      >
        <OText weight='bold' style={{ fontSize: 18 }}>
          {t('CONTINUE_AS_GUEST', 'Continue as guest')}
        </OText>
        <MaterialCommunityIcon name='login' size={24} style={{ marginLeft: 5 }} />
      </TouchableOpacity>
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
  languageSelector: {
    marginRight: 20
  },
  textLink: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
