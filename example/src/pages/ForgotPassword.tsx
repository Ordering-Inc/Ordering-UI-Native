import React from 'react';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { Container } from '../layouts/Container';

export const ForgotPassword = (props: any) => {
  return (
    <Container>
      <ForgotPasswordForm {...props} />
    </Container>
  )
}

export default ForgotPassword;
