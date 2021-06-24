import React from 'react'
import { Container } from '../layouts/Container'
import { LoginForm } from '../components/LoginForm';

export const LoginPage = ({ navigation }: any) => {

  const loginProps = {
    navigation,
    onNavigationRedirect: (page: string) => {
      if (!page) return;
      navigation.navigate(page);
    },
    handleSuccessLogin: () => {
      navigation.reset({
        routes: [{ name: 'Intro' }]
      });
    }
  };

  return (
    <Container>
      <LoginForm {...loginProps} />
    </Container>
  );
};

export default LoginPage
