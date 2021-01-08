import React from 'react';
import {Platform} from 'react-native';
import {useLanguage} from 'ordering-components/Native';
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

const Login = ({navigation}: any) => {
  const [, t] = useLanguage();
  const redirectForgot = () => navigation.navigate('Forgot');
  const redirectRegister = () => navigation.navigate('Register');

  return (
    <BgWrapper source={bgImage}>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LoginWrapper>
          <LoginForm
            navigation={navigation}
            title={t('LOGIN_TITLE', 'Welcome to login!')}
            subTitle={t('LOGIN_SUBTITLE', "Let's start your delivery orders!")}
            backgroundColor={colors.secondary}
            borderRadius="20px"
            wrapperStyle={{padding: 20}}
            border="1px solid"
            loginButtonText={t('LOGIN', 'Login')}
            loginButtonBackground={colors.primary}
            forgotButtonText={t('FORGOT_PASSWORD', 'Forgot your password?')}
            registerButtonText={t('NEW_ON_ORDERING', 'New on Ordering?')}
            // elementLinkToSignup={t('CREATE_ACCOUNT', 'Create account')}
            // elementLinkToForgotPassword={t('RESET_PASSWORD', 'Reset password')}
            useLoginByCellphone
            onForgot={redirectForgot}
            onRegister={redirectRegister}
          />
        </LoginWrapper>
      </KeyboardView>
    </BgWrapper>
  );
};

export default Login;
