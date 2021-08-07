import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { LoginForm } from '../themes/original';
import { Container } from '../themes/original';

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
    loginButtonText: t('LOGIN', 'Login'),
    loginButtonBackground: theme.colors.primary,
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
      <Container style={{paddingLeft: 40, paddingRight: 40}}>
        <LoginForm {...loginProps} />
      </Container>
    </KeyboardView>
  );
};

export default Login;
