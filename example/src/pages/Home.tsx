import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Home as HomePage } from '../components/Home';
import { useLanguage } from 'ordering-components/native';
import { colors } from '../theme.json';

export const Home = ({navigation, route}: any) => {
  const [, t] = useLanguage();
  const homeProps = {
    token: route?.params?.token,
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params);
    },
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <HomePage {...homeProps} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: colors.backgroundPage,
  }
})

export default Home;
