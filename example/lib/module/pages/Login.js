import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { LoginForm } from '../components/LoginForm';
import { colors } from '../theme';
import { Container } from '../layouts/Container';
import { useLanguage } from 'ordering-components/native';
const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;
export const Login = ({
  navigation
}) => {
  const [, t] = useLanguage();
  const loginProps = {
    navigation,
    useLoginByCellphone: true,
    loginButtonText: t('LOGIN', 'Login'),
    loginButtonBackground: colors.primary,
    forgotButtonText: t('FORGOT_YOUR_PASSWORD', 'Forgot your password?'),
    registerButtonText: t('SIGNUP', 'Signup'),
    onNavigationRedirect: page => {
      if (!page) return;
      navigation.navigate(page);
    }
  };
  return /*#__PURE__*/React.createElement(KeyboardView, {
    enabled: true,
    behavior: Platform.OS === 'ios' ? 'padding' : 'height'
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(LoginForm, loginProps)));
};
export default Login;
//# sourceMappingURL=Login.js.map