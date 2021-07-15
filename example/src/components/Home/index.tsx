import React from 'react';
import { useLanguage, useOrder } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { StyleSheet, View, Dimensions } from 'react-native';
import { OButton, OIcon, OText } from '../shared';
import { LogoWrapper, Slogan } from './styles';
import { LanguageSelector } from '../LanguageSelector'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { _setStoreData } from '../../providers/StoreUtil';

const windowHeight = Dimensions.get('window').height

export const Home = (props: any) => {
  const { onNavigationRedirect } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [orderState] = useOrder();

  const handleGuessFlow = (page: string, params: any) => {
    onNavigationRedirect(page, params);
    _setStoreData('isGuestUser', true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapperContent}>
        <View style={styles.languageSelector}>
          <LanguageSelector />
        </View>
        <LogoWrapper>
          <OIcon
            src={theme.images.logos.logotype}
            style={styles.logo}
          />
        </LogoWrapper>
        <Slogan>
          <OIcon
            src={theme.images.general.homeHero}
            style={styles.slogan}
          />
        </Slogan>
      </View>
      <View style={styles.wrapperBtn}>
        <OButton
          text={t('LOGIN_NOW', 'Login now')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          style={styles.buttons}
          textStyle={{ color: 'white' }}
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
          <OText weight='bold' size={18}>
            {t('CONTINUE_AS_GUEST', 'Continue as guest')}
          </OText>
        </TouchableOpacity>
      </View>
    </View>
  );
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
    justifyContent: 'space-between',
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
    marginTop: 20,
  },
  wrapperBtn: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginBottom: 20
  }
});
