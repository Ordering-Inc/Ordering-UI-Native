import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { Platform } from 'react-native';
import { AddressForm as AddressFormController } from '../themes/instacart'
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'
import { _retrieveStoreData } from '../providers/StoreUtil';

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
  flex-shrink: 1;
`;

const AddressForm = ({ navigation, route }: any) => {
  const AddressFormProps = {
    navigation,
    route,
    address: route?.params?.address,
    addressId: route?.params?.address?.id,
    isEditing: route?.params?.isEditing,
    addressesList: route?.params?.addressList,
    onSaveAddress: route?.params?.onSaveAddress,
    isSelectedAfterAdd: true,
    isGuestUser: route?.params?.isGuestUser,
    isFromBusinesses: route?.params?.isFromBusinesses,
    isFromProductsList: route?.params?.isFromProductsList,
    isFromCheckout: route?.params?.isFromCheckout,
    hasAddressDefault: route?.params?.hasAddressDefault,
    afterSignup: route?.params?.afterSignup
  }

  const [isGuestFromStore, setIsGuestFromStore] = useState(false)

  const getDataFromStorage = async () => {
    const value = await _retrieveStoreData('isGuestUser');
    setIsGuestFromStore(value);
  }

  useEffect(() => {
    getDataFromStorage()
  }, [])

  return (
    <SafeAreaContainer>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <AddressFormController
          { ...AddressFormProps }
          isGuestFromStore={isGuestFromStore}
          useValidationFileds
        />
      </KeyboardView>
    </SafeAreaContainer>
  )
}

export default AddressForm
