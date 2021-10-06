import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { LoginForm } from '../components/LoginForm';
import { SafeAreaContainer } from '../../themes/uber-eats/src/layouts/SafeAreaContainer';

import { useLanguage } from 'ordering-components/native';
import { _setStoreData } from '../providers/StoreUtil';
import { useTheme } from 'styled-components/native';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Login = ({ navigation, route }: any) => {
  const [, t] = useLanguage()
  const theme = useTheme()

  const loginProps = {
    navigation,
    useLoginByCellphone: true,
    loginButtonText: t('SIGN_IN', 'Sign in'),
    loginButtonBackground: theme.colors.primary,
    forgotButtonText: t('FORGOT_YOUR_PASSWORD', 'Forgot your password?'),
    registerButtonText: t('CREATE_ACCOUNT', 'Create account'),
    onNavigationRedirect: (page: string) => {
      if (!page) return
      navigation.navigate(page);
    },
    notificationState: route?.params?.notification_state
  }

  _setStoreData('notification_state', route?.params?.notification_state);

  return (
    <SafeAreaContainer>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LoginForm {...loginProps} />
      </KeyboardView>
    </SafeAreaContainer>
  );
};

export default Login;
