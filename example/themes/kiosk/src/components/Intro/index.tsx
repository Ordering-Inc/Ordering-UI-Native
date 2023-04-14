import React, { useState } from 'react';
import { StyleSheet, View, Pressable, TouchableOpacity } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import { Container } from '../../layouts/Container';
import OImage from '../../components/shared/OImage';
import OButton from '../../components/shared/OButton';
import { LanguageSelector } from '../../components/LanguageSelector';
import { LogoutPopup } from '../../components/LogoutPopup';
import { PORTRAIT, LANDSCAPE, useDeviceOrientation } from "../../../../../src/hooks/DeviceOrientation";
import { OIcon } from '../../components/shared';

const Intro = (props: any): React.ReactElement => {
  const { navigation } = props;

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

  return (
    // <ScrollView
    //   scrollEnabled={false}
    //   refreshControl={
    //     <RefreshControl
    //       refreshing={showLogoutPopup ? false : refreshing}
    //       onRefresh={() => setShowLogoutPopup(true)}
    //     />
    //   }
    // >
    <>
      <View style={{ position: 'absolute', top: 25, right: 20, zIndex: 1000 }}>
        <TouchableOpacity
          onPress={() => setShowLogoutPopup(true)}
        >
          <OIcon
            src={theme.images.general.menulogout}
            width={24}
            height={24}
            color={theme.colors.disabledContrast}
          />
        </TouchableOpacity>
      </View>
      <Pressable onPress={goBusiness}>
        <View style={{ height: orientationState?.dimensions?.height }}>
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
                text={t('TOUCH_ANYWHERE_TO_ORDER', 'Touch anywhere to order')}
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
                height={orientationState?.dimensions?.height * 1.1}
                style={{ bottom: 100, right: 100 }}
                resizeMode='cover'
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
                    text={t('TOUCH_ANYWHERE_TO_ORDER', 'Touch anywhere to order')}
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
            onClose={() => setShowLogoutPopup(false)}
          />
        </View>
      </Pressable>
    </>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonLandStyle: {
    minWidth: 130,
    marginBottom: 16
  }
});

const _offset = 50;

export default Intro;
