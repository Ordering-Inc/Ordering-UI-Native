import React from 'react'
import { Platform } from 'react-native'
import { MultiOrdersDetails as MultiOrdersDetailsController } from '../../themes/original/src/components/MultiOrdersDetails'
import styled from 'styled-components/native';

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-top: ${Platform.OS === 'ios' ? '0px' : '24px'};
`;

const MultiOrdersDetails = ({ navigation, route }: any) => {
  const multiOrdersDetailsProps = {
    navigation,
    orderUuids: route.params?.orderUuids || [],
    isFromMultiCheckout: route.params?.isFromMultiCheckout,
    onRedirectPage: () => navigation.navigate('BusinessList')
  }

  return (
    <SafeAreaContainer>
      <MultiOrdersDetailsController {...multiOrdersDetailsProps} />
    </SafeAreaContainer>
  )
}

export default MultiOrdersDetails
