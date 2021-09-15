import React from 'react'
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {ReviewOrder as ReviewOrderController} from '../components/ReviewOrder'
import { SafeAreaContainer } from '../layouts/SafeAreaContainer';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const ReviewOrder = ({navigation, route} : any) => {
  const reviewOrderProps = {
    navigation,
    order: route?.params?.order,
    setIsReviewed: route?.params?.setIsReviewed
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaContainer>
        <ReviewOrderController {...reviewOrderProps} />
      </SafeAreaContainer>
    </KeyboardView>
  )
}

export default ReviewOrder
