import React from 'react'
import styled from 'styled-components/native'
import { Platform } from 'react-native';
import { AddressForm as AddressFormController } from '../components/AddressForm'

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

const AddressForm = ({navigation,route}: any) => {

  const AddressFormProps = {
    navigation: navigation,
    route: route,
    address: route?.params?.address,
    addressId: route?.params?.address?.id,
    isEditing: route?.params?.isEditing,
    addressesList: route?.params?.addressList,
    onSaveAddress: route?.params?.onSaveAddress,
    isSelectedAfterAdd: true,
    isGuestUser: route?.params?.isGuestUser,
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AddressFormController {...AddressFormProps} useValidationFileds />
    </KeyboardView>
  )
}

export default AddressForm
