import React from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { _setStoreData } from '../providers/StoreUtil';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components/native';


const IntroductoryTutorial = ({ navigation, route }: any)  => {
  const [, t] = useLanguage();
  const theme = useTheme()
  const setTutorial = route?.params?.setTutorial
  const data = [
    {
      title: t('DELIVERY_BY_ADDRESS', 'Delivery by Address'),
      text: t('DELIVERY_BY_ADDRESS_INST', 'DELIVERY_BY_ADDRESS_INST'),
      image: theme.images.tutorials.slide1,
      bg: theme.colors.primaryContrast
    },
    {
      title: t('SELECT_A_BUSINESS', 'SELECT_A_BUSINESS'),
      text: t('SELECT_A_BUSINESS_INST', 'SELECT_A_BUSINESS_INST'),
      image: theme.images.tutorials.slide2,
      bg: theme.colors.primaryContrast
    },
    {
      title: t('BUSINESS_MENU', 'BUSINESS_MENU'),
      text: t('BUSINESS_MENU_INST', 'BUSINESS_MENU_INST'),
      image: theme.images.tutorials.slide3,
      bg: theme.colors.primaryContrast
    },
    {
      title: t('PRODUCT_LIST', 'PRODUCT_LIST'),
      text: t('PRODUCT_LIST_INST', 'PRODUCT_LIST_INST'),
      image: theme.images.tutorials.slide4,
      bg: theme.colors.primaryContrast
    },
    {
      title: t('CHECKOUT_SCREEN', 'CHECKOUT_SCREEN'),
      text: t('CHECKOUT_SCREEN_INST', 'CHECKOUT_SCREEN_INST'),
      image: theme.images.tutorials.slide5,
      bg: theme.colors.primaryContrast
    },
    {
      title: t('TUTORIAL_ORDER_COMPLETED', 'TUTORIAL_ORDER_COMPLETED'),
      text: t('TUTORIAL_ORDER_COMPLETED_INST', 'TUTORIAL_ORDER_COMPLETED_INST'),
      image: theme.images.tutorials.slide6,
      bg: theme.colors.primaryContrast
    },
  ];
  type Item = typeof data[0];
  const styles = StyleSheet.create({
    slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
    },
    image: {
      flex: 0,
      top: 30,
      width: '100%',
      height: '75%',
      resizeMode: 'contain',
    },
    text: {
      color: theme.colors.colorTextTutorial,
      textAlign: 'center',
      fontSize: 17,
      paddingRight: '2%',
      paddingLeft: '2%',
    },
    title: {
      fontSize: 25,
      color: theme.colors.colorTextTutorial,
      textAlign: 'center',
      bottom: '3%',
    },
    buttonCircle: {
      top: '15%',
      width: 50,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      position:'relative'
    },
    tutorialText: {
      fontSize: 18,
      fontWeight: '200',
      color: theme.colors.primary
    }
  });
  
  const _renderItem = ({item}: {item: Item}) => {
    return (
      <View
        style={[
          styles.slide,
          { 
            backgroundColor: item.bg,
          },
        ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <Image source={item.image} style={styles.image} />
      </View>
    );
  };

  const RenderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_NEXT', 'Next')}</Text>
      </View>
    );
  };

  const RenderSkipButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_SKIP', 'Skip')}</Text>
      </View>
    );
  };

  const RenderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_BACK', 'Back')}</Text>
      </View>
    );
  };

  const RenderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_DONE', 'Done')}</Text>
      </View>
    );
  }

  const _onDone = () => {
    setTutorial(false)
    _setStoreData('isTutorial', false)
  }

  const _keyExtractor = (item: Item) => item.title;

    return (
      <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          keyExtractor={_keyExtractor}
          renderItem={_renderItem}
          data={data}
          onDone={_onDone}
          activeDotStyle= {{backgroundColor: theme.colors.primary}}
          renderDoneButton={RenderDoneButton}
          renderNextButton={RenderNextButton}
          renderSkipButton={RenderSkipButton}
          renderPrevButton={RenderPrevButton}
          showSkipButton
          showPrevButton
        />
      </View>
    );
  
}
export default IntroductoryTutorial;
