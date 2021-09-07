import React from 'react';
import { useLanguage, useOrder } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { StyleSheet, View, Dimensions, ImageBackground } from 'react-native';
import { OButton, OIcon, OText } from '../shared';
import { LogoWrapper } from './styles';
import { LanguageSelector } from '../LanguageSelector'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { _setStoreData } from '../../providers/StoreUtil';

const windowHeight = Dimensions.get('window').height

export const Home = (props: any) => {
  const {
    onNavigationRedirect
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage();
  const [orderState] = useOrder();

  const handleGuessFlow = (page: string, params: any) => {
    onNavigationRedirect(page, params);
    _setStoreData('isGuestUser', true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapperContent}>
        <ImageBackground source={theme.images.general.homeHero} resizeMode='cover' style={styles.hero}>
          <View style={styles.languageSelector}>
            <LanguageSelector />
          </View>
          <LogoWrapper>
            <OIcon src={theme.images.logos.logotype} style={styles.logo} />
          </LogoWrapper>
        </ImageBackground>
      </View>
      <View style={styles.wrapperBtn}>
        <OButton
          text={t('LOGIN', 'Login')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          style={styles.buttons}
          textStyle={{ color: 'white' }}
          imgRightSrc={null}
          onClick={() => onNavigationRedirect('Login')}
        />
        <OButton
          text={t('SIGNUP', 'Signup')}
          bgColor={theme.colors.white}
          borderColor={theme.colors.primary}
          style={styles.buttons}
          onClick={() => onNavigationRedirect('Signup')}
        />
        <TouchableOpacity
          style={{ ...styles.textLink, marginTop: 15 }}
          onPress={() => orderState?.options?.address?.address
            ? handleGuessFlow('BusinessList',{ isGuestUser: true } )
            : handleGuessFlow('AddressForm',{ isGuestUser: true } )
          }
        >
          <OText weight='500' size={18}>
            {t('CONTINUE_AS_GUEST', 'Continue as guest')}
          </OText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrapperContent: {
    flex: 1,
    width: '100%'
  },
  hero: {
    flex: 1
  },
  languageSelector: {
    marginRight: 10
  },
  textLink: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
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
    marginHorizontal: 30,
    borderRadius: 0
  },
  sloganText: {
    textAlign: 'center'
  },
  wrapperBtn: {
    width: '100%',
    marginVertical: 10
  }
});
