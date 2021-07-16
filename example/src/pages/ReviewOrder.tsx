import React from 'react'
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {ReviewOrder as ReviewOrderController} from '../themes/five/components'
import { Container } from '../layouts/Container';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const ReviewOrder = ({navigation, route} : any) => {
  const reviewOrderProps = {
    navigation,
    order: route?.params?.order
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <ReviewOrderController {...reviewOrderProps} />
      </Container>
    </KeyboardView>
  )
}

export default ReviewOrder
