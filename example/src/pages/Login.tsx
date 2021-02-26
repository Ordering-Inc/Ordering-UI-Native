import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { LoginForm } from '../components/LoginForm';
import { colors } from '../theme';
import { Container } from '../layouts/Container'

import { useLanguage } from 'ordering-components/native';

const BgWrapper = styled.ImageBackground`
  flex: 1;
`;

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

export const Login = ({ navigation }: any) => {
  const [, t] = useLanguage()

  const loginProps = {
    navigation,
    useLoginByCellphone: true,
    loginButtonText: t('LOGIN', 'Login'),
    loginButtonBackground: colors.primary,
    forgotButtonText: t('FORGOT_YOUR_PASSWORD', 'Forgot your password?'),
    registerButtonText: t('SIGNUP', 'Signup'),
    onNavigationRedirect: (page: string) => {
      if (!page) return
      navigation.navigate(page);
    },
    handleSuccessLogin: (user: any) => {
      if (user?.id) {
        navigation.navigate('MyAccount');
      }
    }
  }


  return (
    <BgWrapper>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container>
          <LoginForm {...loginProps} />
        </Container>
      </KeyboardView>
    </BgWrapper>
  );
};

export default Login;
