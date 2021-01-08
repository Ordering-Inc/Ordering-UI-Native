import React from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {LoginForm} from '../components/LoginForm';
import {colors} from '../theme';

const BgWrapper = styled.ImageBackground`
  flex: 1;
`;
const LoginWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 0;
`;
const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

const bgImage = require('../assets/images/home_bg.png');

export const Login = ({navigation}: any) => {
  const forgot = () => {
    navigation.navigate('Forgot');
  };

  return (
    <BgWrapper source={bgImage}>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LoginWrapper>
          <LoginForm
            navigation={navigation}
            title="Welcome to login!"
            subTitle="Let's start your delivery orders!"
            backgroundColor={colors.secondary}
            borderRadius="20px"
            wrapperStyle={{padding: 20}}
            border="1px solid"
            loginButtonText="Login"
            loginButtonBackground={colors.primary}
            onForgot={forgot}
            forgotButtonText="Forgot password?"
            registerButtonText="Register"
          />
        </LoginWrapper>
      </KeyboardView>
    </BgWrapper>
  );
};

export default Login;
