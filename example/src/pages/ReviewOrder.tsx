import React from 'react'
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {ReviewOrder as ReviewOrderController} from '../components/ReviewOrder'
import { Container } from '../layouts/Container';
import theme from '../theme.json';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const ReviewOrder = ({navigation, route} : any) => {
  const reviewOrderProps = {
    navigation,
    theme,
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
