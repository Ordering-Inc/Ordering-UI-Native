import React from 'react';
import { SignupForm } from '../components/SignupForm';
import { Container } from '../layouts/Container';
import styled from 'styled-components/native';
import { useLanguage, useSession } from 'ordering-components/native';
import { Platform } from 'react-native';
const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;
export const Signup = props => {
  const [, t] = useLanguage();
  const [, {
    login
  }] = useSession();
  const signupProps = { ...props,
    useChekoutFileds: true,
    loginButtonText: t('LOGIN', 'Login'),
    signupButtonText: t('SIGNUP', 'Signup'),
    useSignupByEmail: true,
    onNavigationRedirect: page => {
      if (!page) return;
      props.navigation.navigate(page);
    },
    handleSuccessSignup: user => {
      if (user !== null && user !== void 0 && user.id) {
        login({
          user,
          token: user.session.access_token
        });
      }
    }
  };
  return /*#__PURE__*/React.createElement(KeyboardView, {
    enabled: true,
    behavior: Platform.OS === 'ios' ? 'padding' : 'height'
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(SignupForm, signupProps)));
};
export default Signup;
//# sourceMappingURL=Signup.js.map