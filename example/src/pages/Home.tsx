import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Home as HomePage } from '../components/Home';
import { useTheme } from 'styled-components/native';

export const Home = (props: any) => {
  const theme = useTheme();

  const homeProps = {
    ...props,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params);
    },
  }

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: theme.colors.secundary,
    }
  })

  return (
    <SafeAreaView style={styles.wrapper}>
      <HomePage {...homeProps} />
    </SafeAreaView>
  );
};

export default Home;
