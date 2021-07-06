import React from 'react';
import { SignupForm } from '../components/SignupForm';
import { Container } from '../layouts/Container'
import styled from 'styled-components/native';
import { useLanguage, useSession } from 'ordering-components/native';
import { Platform } from 'react-native';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Signup = (props: any) => {
  const [, t] = useLanguage()
  const [, { login }] = useSession()

  const signupProps = {
    ...props,
    useChekoutFileds: true,
    loginButtonText: t('LOGIN', 'Login'),
    signupButtonText: t('SIGNUP', 'Signup'),
    useSignupByEmail: true,
    onNavigationRedirect: (page: string) => {
      if (!page) return
      props.navigation.navigate(page);
    },
    handleSuccessSignup: (user: any) => {
      if (user?.id) {
        login({
          user,
          token: user.session.access_token
        })
      }
    }
  }
  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <SignupForm {...signupProps} />
      </Container>
    </KeyboardView>
  );
};

export default Signup;
