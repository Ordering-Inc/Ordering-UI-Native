import React from 'react';
import { useLanguage, useOrder } from 'ordering-components/native';
import { StyleSheet, View } from 'react-native';
import { colors, images } from '../../theme.json';
import { OButton, OIcon, OText } from '../../../../components/shared';
import { LanguageSelector } from '../LanguageSelector';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useWindowDimensions } from 'react-native';

export const Home = (props: any) => {
  const { onNavigationRedirect } = props;
  const { width } = useWindowDimensions();
  const [, t] = useLanguage();
  const [orderState] = useOrder();

  return (
    <View style={styles.container}>
      <View>
        <LanguageSelector />
        <OIcon
          src={images.logos.logotypeInvert}
          style={{
            ...styles.logo,
            resizeMode: 'contain',
            width: width - 80,
            height: (width - 80) * 0.25,
          }}
        />
      </View>
      <View style={styles.wrapperBtn}>
        <OText color={colors.white} size={40}>
          {t('WELCOME', 'Welcome!')}
        </OText>
        <OText color={colors.white} size={14} style={{ marginBottom: 46 }}>
          {t('LETS_START_ORDER', "Let's start to order now")}
        </OText>
        <OButton
          text={t('LOGIN_NOW', 'Login now')}
          bgColor={colors.primary}
          borderColor={colors.primary}
          style={styles.buttons}
          isCircle={false}
          textStyle={{ color: 'white' }}
          onClick={() => onNavigationRedirect('Login')}
          imgRightSrc={null}
        />
        <OButton
          text={t('SIGNUP', 'Signup')}
          bgColor={colors.primaryContrast}
          borderColor={colors.primaryContrast}
          style={styles.buttons}
          onClick={() => onNavigationRedirect('Signup')}
          imgRightSrc={null}
        />
        <TouchableOpacity
          style={{ ...styles.textLink, marginTop: 12 }}
          onPress={() =>
            orderState?.options?.address?.address
              ? onNavigationRedirect('BusinessList', { isGuestUser: true })
              : onNavigationRedirect('AddressForm', { isGuestUser: true })
          }>
          <OText weight="normal" size={18} color={colors.white}>
            {t('CONTINUE_AS_GUEST', 'Continue as guest')}
          </OText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textLink: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  logo: {
    marginTop: 64,
  },
  buttons: {
    marginVertical: 6,
    borderRadius: 7.6,
  },
  sloganText: {
    textAlign: 'center',
  },
  wrapperBtn: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
  },
});
