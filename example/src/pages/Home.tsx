import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { HomePage } from '../themes/doordash';
import { theme } from '../themes/doordash';

export const Home = (props: any) => {
  const homeProps = {
    ...props,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params);
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
    backgroundColor: theme.colors.backgroundPage,
  }
})

export default Home;
