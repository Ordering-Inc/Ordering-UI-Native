import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { Container } from '../layouts/Container';
import theme from '../theme.json';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const ForgotPassword = (props: any) => {
  const forgotProps = {
    ...props,
    theme
  }
  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <ForgotPasswordForm {...forgotProps} />
      </Container>
    </KeyboardView>
  )
}

export default ForgotPassword;
