import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import { Home as HomePage } from '../components/Home';
import { useLanguage } from 'ordering-components/native';
import { colors, images } from '../theme.json';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Home = ({ navigation }: any) => {
  const [, t] = useLanguage();
  const homeProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return;
      navigation.navigate(page, params);
    },
  };
  const homeImage: ImageSourcePropType = images.general
    .homeHero as ImageSourcePropType;

  return (
    <ImageBackground source={homeImage} style={styles.bg}>
      <View style={styles.mask}>
        <SafeAreaView style={styles.wrapper}>
          <HomePage {...homeProps} />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0000004D',
  },
});

export default Home;
