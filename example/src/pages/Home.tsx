import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {LoginForm} from '../components/LoginForm';
import {colors} from '../theme';
import {OButton, OIcon, OText} from '../components/shared';
import applogo from '../assets/images/app-logo.png';

const BgWrapper = styled.ImageBackground`
  flex: 1;
  background-color: ${colors.white};
`;

const LogoWrapper = styled.View`
  flex: 1;
  align-items: center;
`;

const Slogan = styled.View`
  align-items: center;
  margin-bottom: 10px
`

const bgImage = require('../assets/images/home_bg.png');

export const Login = ({navigation}: any) => {
  const login = () => {
    navigation.navigate('login');
  };

  const signup = () => {
    navigation.navigate('signup');
  };

  return (
    <BgWrapper>
      <LogoWrapper>
        <OIcon src={applogo} style={styles.logo} />
      </LogoWrapper>
      <Slogan>
      <OText size={48}>Welcome</OText>
      <OText size={18}>Let's start to order food now</OText>
      </Slogan>
      <OButton
        text="Login now"
        bgColor={colors.primary}
        borderColor={colors.primary}
        style={styles.buttons}
      />
      <OButton
        text="signup"
        bgColor={colors.white}
        borderColor={colors.primary}
        style={styles.buttons}
      />
    </BgWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 200,
    width: 260
  },
  buttons: {
      marginVertical: 10,
      marginHorizontal: 30
  }
});

export default Login;
