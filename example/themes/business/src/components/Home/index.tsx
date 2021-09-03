import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { LogoWrapper, Container, BackgroundImage } from './styles';
import { OButton, OIcon, OText } from '../shared';
import { _setStoreData } from '../../providers/StoreUtil';

export const Home = (props: any) => {
  const { onNavigationRedirect } = props;
  const safeHeight = Platform.OS === 'ios' ? 80 : 40;

  const theme = useTheme();
  const [, t] = useLanguage();

  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );
  const [windowHeight, setWindowHeight] = useState(
    parseInt(parseFloat(String(Dimensions.get('window').height)).toFixed(0)),
  );

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    setWindowHeight(
      parseInt(parseFloat(String(Dimensions.get('window').height)).toFixed(0)),
    );

    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  return (
    <Container height={windowHeight - safeHeight} orientation={orientation}>
      <BackgroundImage
        source={theme.images.backgroundsImages.login}
        resizeMode="cover">
        <LogoWrapper>
          <OIcon src={theme.images.logos.logotypeInvert} style={styles.logo} />
        </LogoWrapper>

        <View style={styles.wrapperContent}>
          <View style={styles.wrapperText}>
            <OText style={styles.textTitle} color={theme.colors.inputChat}>
              {t('TITLE_HOME', 'Welcome')}
            </OText>

            <OText style={styles.textSubtitle} color={theme.colors.inputChat}>
              {t(
                'BUSINESS_WELCOME_SUBTITLE',
                "Let's start to administrate your business now",
              )}
            </OText>
          </View>

          <View style={styles.wrapperBtn}>
            <OButton
              text={t('LOGIN', 'Login')}
              textStyle={{
                ...styles.btnText,
                color: theme.colors.inputTextColor,
              }}
              bgColor={theme.colors.primary}
              borderColor={theme.colors.primary}
              style={styles.btn}
              imgRightSrc={false}
              onClick={() => onNavigationRedirect('Login')}
            />
          </View>
        </View>
      </BackgroundImage>
    </Container>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 65,
    width: 250,
  },
  wrapperContent: {
    width: '100%',
  },
  wrapperText: {
    marginBottom: 20,
  },
  textTitle: {
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 50,
  },
  textSubtitle: {
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 14,
  },
  wrapperBtn: {
    marginBottom: 20,
  },
  btn: {
    borderRadius: 7.6,
    marginTop: 20,
  },
  btnText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 18,
  },
});
