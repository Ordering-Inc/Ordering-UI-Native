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
      image: require('../assets/images/slide1.png'),
      bg: theme.colors.primary
    },
    {
      title: t('SELECT_A_BUSINESS', 'SELECT_A_BUSINESS'),
      text: t('SELECT_A_BUSINESS_INST', 'SELECT_A_BUSINESS_INST'),
      image: require('../assets/images/slide2.png'),
      bg: theme.colors.primary
    },
    {
      title: t('BUSINESS_MENU', 'BUSINESS_MENU'),
      text: t('BUSINESS_MENU_INST', 'BUSINESS_MENU_INST'),
      image: require('../assets/images/slide3.png'),
      bg: theme.colors.primary
    },
    {
      title: t('PRODUCT_LIST', 'PRODUCT_LIST'),
      text: t('PRODUCT_LIST_INST', 'PRODUCT_LIST_INST'),
      image: require('../assets/images/slide4.png'),
      bg: theme.colors.primary
    },
    {
      title: t('CHECKOUT_SCREEN', 'CHECKOUT_SCREEN'),
      text: t('CHECKOUT_SCREEN_INST', 'CHECKOUT_SCREEN_INST'),
      image: require('../assets/images/slide5.png'),
      bg: theme.colors.primary
    },
    {
      title: t('TUTORIAL_ORDER_COMPLETED', 'TUTORIAL_ORDER_COMPLETED'),
      text: t('TUTORIAL_ORDER_COMPLETED_INST', 'TUTORIAL_ORDER_COMPLETED_INST'),
      image: require('../assets/images/slide6.png'),
      bg: theme.colors.primary
    },
  ];
  type Item = typeof data[0];
  const styles = StyleSheet.create({
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      flex: 0,
      width: '100%',
      height: '70%',
      resizeMode: 'contain',
    },
    text: {
      color: theme.colors.primaryContrast,
      textAlign: 'center',
      fontSize: 16,
      top: '2%'
    },
    title: {
      fontSize: 20,
      color: theme.colors.primaryContrast,
      textAlign: 'center',
      bottom: '3%',
    },
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
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
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
        />
      </View>
    );
  
}
export default IntroductoryTutorial;
