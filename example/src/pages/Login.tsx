import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { LoginForm } from '../themes/doordash/components';
import { colors } from '../theme.json';
import { Container } from '../layouts/Container';

import { useLanguage } from 'ordering-components/native';
import { _setStoreData } from '../providers/StoreUtil';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Login = ({ navigation, route }: any) => {
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
    notificationState: route?.params?.notification_state
  }

  _setStoreData('notification_state', route?.params?.notification_state);

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <LoginForm {...loginProps} />
      </Container>
    </KeyboardView>
  );
};

export default Login;
