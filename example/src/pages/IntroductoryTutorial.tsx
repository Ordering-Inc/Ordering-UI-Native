import React from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/AntDesign';
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
    },
    image: {
      flex: 0,
      width: '100%',
      height: '70%',
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
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
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
  const RenderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="right"
          color= {theme.colors.primary}
          size={24}
          style={{backgroundColor: 'transparent'}}
        />
      </View>
    );
  };

  const RenderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="checkcircleo"
          color= {theme.colors.primary}
          size={24}
          style={{backgroundColor: 'transparent'}}
        />
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
        />
      </View>
    );
  
}
export default IntroductoryTutorial;
