import React from 'react'
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {ReviewProduct as ReviewProductController} from '../components/ReviewProduct'
import { SafeAreaContainer } from '../layouts/SafeAreaContainer';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const ReviewProduct = ({navigation, route} : any) => {
  const reviewProductProps = {
    navigation,
    order: route?.params?.order,
    onNavigationRedirect: (route: string, params: any) => navigation.navigate(route, params)
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaContainer>
        <ReviewProductController {...reviewProductProps} />
      </SafeAreaContainer>
    </KeyboardView>
  )
}

export default ReviewProduct
