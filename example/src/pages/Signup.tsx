import React from 'react';
import { SignupForm } from '../components/SignupForm';
import { Container } from '../layouts/Container'
import { useLanguage } from 'ordering-components/native';

export const Signup = (props: any) => {
  const [, t] = useLanguage()

  const signupProps = {
    ...props,
    useChekoutFileds: true,
    loginButtonText: t('LOGIN', 'Login'),
    signupButtonText: t('SIGNUP', 'Signup'),
    useSignupByEmail: true,
    useSignupByCellphone: true,
    onNavigationRedirect: (page: string) => {
      if (!page) return
      props.navigation.navigate(page);
    },
    handleSuccessSignup: (user: any) => {
      if (user?.id) {
        props.navigation.navigate('Home');
      }
    }
  }
  return (
    <Container>
      <SignupForm {...signupProps} />
    </Container>
  );
};

export default Signup;
