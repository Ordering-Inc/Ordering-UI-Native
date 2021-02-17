import React from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../theme';
import {OButton, OIcon, OText} from '../components/shared';

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

const sloganImage = require('../assets/images/product.png');
const applogo = require('../assets/images/app-logo.png');

export const Home = ({navigation}: any) => {

  const login = () => {
    navigation.navigate('Login');
  };

  const signup = () => {
    navigation.navigate('Signup');
  };

  return (
    <BgWrapper>
      <LogoWrapper>
        <OIcon src={applogo} style={styles.logo} />
      </LogoWrapper>
      <Slogan>
      <OIcon src={sloganImage} style={styles.slogan} />
      <OText size={48}>Welcome!</OText>
      <OText size={18}>Let's start to order food now</OText>
      </Slogan>
      <OButton
        text="Login now"
        bgColor={colors.primary}
        borderColor={colors.primary}
        style={styles.buttons}
        onClick={login}
      />
      <OButton
        text="signup"
        bgColor={colors.white}
        borderColor={colors.primary}
        style={styles.buttons}
        onClick={signup}
      />
    </BgWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 200,
    width: 260
  },
  slogan: {
    height: 300,
    width: 300,
    marginVertical: 10,
  },
  buttons: {
      marginVertical: 10,
      marginHorizontal: 30
  }
});

export default Home;
