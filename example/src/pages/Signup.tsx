import React from 'react';
import { SignupForm } from '../components/SignupForm';
import { Container } from '../layouts/Container'

export const Signup = (props: any) => {
  const signupProps = {
    ...props
  }
  return (
    <Container>
      <SignupForm {...signupProps} />
    </Container>
  );
};

export default Signup;
