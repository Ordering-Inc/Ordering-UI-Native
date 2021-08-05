import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import { Container } from '../../layouts/Container';
import OImage from '../../components/shared/OImage';
import OButton from '../../components/shared/OButton';
import { LanguageSelector } from '../../components/LanguageSelector';
import { LogoutPopup } from '../../components/LogoutPopup';
import {PORTRAIT, LANDSCAPE, useDeviceOrientation} from "../../../../../src/hooks/DeviceOrientation";

const Intro = (props: any): React.ReactElement => {
  const {
    navigation,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [refreshing] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [orientationState] = useDeviceOrientation();

  const goBusiness = () => {
    navigation.navigate('DeliveryType', {
      callback: () => {
        navigation.navigate('Business');
      },
      goBack: () => {
        navigation.goBack();
      },
    }
    );
  };

  const onShowLogout = () => {
    setShowLogoutPopup(true);
  };

  const onHideLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onShowLogout}
      scrollEnabled={false}
      data={[1]}
      keyExtractor={item => `${item}`}
      renderItem={() => {
        return (
          <Container nopadding={orientationState.orientation === LANDSCAPE}>
            {orientationState.orientation === PORTRAIT ? (
              <View
                style={{
                  height: orientationState?.dimensions?.height - _offset,
                  padding: 4,
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}
              >
                <OImage
                  source={theme.images.logos.logotype}
                  width={(orientationState?.dimensions?.width * 0.4) - _offset}
                  height={orientationState?.dimensions?.height * 0.1}
                />

                <OImage
                  source={theme.images.general.homeHero}
                  width={orientationState?.dimensions?.width}
                  height={orientationState?.dimensions?.height * 0.6}
                />

                <OButton
                  text={t('TOUCH_TO_ORDER', 'Touch to order')}
                  parentStyle={{
                    alignItems: 'center',
                    width: orientationState?.dimensions?.width - _offset
                  }}
                  onClick={goBusiness}
                />
                <LanguageSelector />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: 0,
                  margin: 0
                }}
              >
                <OImage
                  source={theme.images.general.homeHeroLandscape}
                  width={orientationState?.dimensions?.width * 0.40}
                  height={orientationState?.dimensions?.height}
                  resizeMode={'cover'}
                />

                <View
                  style={{
                    height: orientationState?.dimensions?.height,
                    width: '50%',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    paddingBottom: '5%',
                    paddingTop: '10%',
                  }}
                >
                  <OImage
                    source={theme.images.logos.logotype}
                    width={(orientationState?.dimensions?.width * 0.4) - _offset}
                    height={orientationState?.dimensions?.height * 0.1}
                  />

                  <View style={{
                    justifyContent: 'space-around',
                    alignItems: 'center'
                  }}>

                    <OButton
                      style={styles.buttonLandStyle}
                      text={t('TOUCH_TO_ORDER', 'Touch to order')}
                      parentStyle={{
                        alignItems: 'center',
                        width: orientationState?.dimensions?.width - _offset
                      }}
                      onClick={goBusiness}
                    />
                    <LanguageSelector />
                  </View>
                </View>
              </View>
            )}

            <LogoutPopup
              open={showLogoutPopup}
              onClose={onHideLogout}
            />
          </Container>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  buttonLandStyle: {
    width: 260,
    marginBottom: 16
  }
});

const _offset = 50;

export default Intro;
