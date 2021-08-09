import React from 'react'
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {ReviewOrder as ReviewOrderController} from '../themes/doordash'
import { Container } from '../layouts/Container';


const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const ReviewOrder = ({navigation, route} : any) => {

  const {order} = route.params

  const reviewOrderProps = {
    navigation,
    order
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container style={{paddingStart: 0, paddingEnd: 0}}>
        <ReviewOrderController {...reviewOrderProps} />
      </Container>
    </KeyboardView>
  )
}

export default ReviewOrder
