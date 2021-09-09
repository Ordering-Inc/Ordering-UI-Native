import React from 'react'
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { Container } from '../layouts/Container'
import { Account as AccountController } from '../components/Account'

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;
interface Props {
  navigation: any;
  route: any;
}

const Account = (props: Props) => {
  const accountProps = {
    ...props,
    useSessionUser: true,
    useValidationFields: true
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <AccountController {...accountProps} />
      </Container>
    </KeyboardView>
  )
}

export default Account
