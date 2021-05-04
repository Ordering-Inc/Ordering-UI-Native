import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Home as HomePage } from '../components/Home';
import { useLanguage } from 'ordering-components/native';
import { colors } from '../theme';
export const Home = ({
  navigation
}) => {
  const [, t] = useLanguage();
  const homeProps = {
    navigation,
    onNavigationRedirect: (page, params) => {
      if (!page) return;
      navigation.navigate(page, params);
    }
  };
  return /*#__PURE__*/React.createElement(SafeAreaView, {
    style: styles.wrapper
  }, /*#__PURE__*/React.createElement(HomePage, homeProps));
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: colors.backgroundPage
  }
});
export default Home;
//# sourceMappingURL=Home.js.map