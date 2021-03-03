import React from 'react';
import { SignupForm } from '../components/SignupForm';
import { Container } from '../layouts/Container'
import { useLanguage, useSession } from 'ordering-components/native';

export const Signup = (props: any) => {
  const [, t] = useLanguage()
  const [, { login }] = useSession()

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
        login({
          user,
          token: user.session.access_token
        })
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
