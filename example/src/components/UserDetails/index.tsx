import React, { useEffect } from 'react';
import { View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { UDContainer, UDHeader, UDForm, UDInfo } from './styles';

import {
  UserFormDetails as UserFormController,
  useLanguage,
  useSession
} from 'ordering-components/native';

import { OText } from '../shared';
import { colors } from '../../theme';

import { UserFormDetailsUI } from '../UserFormDetails';

const UserDetailsUI = (props: any) => {
  const {
    isEdit,
    formState,
    cleanFormState,
    cartStatus,
    toggleIsEdit,
    validationFields,
    isUserDetailsEdit
  } = props

  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const userData = props.userData || formState.result?.result || user

  useEffect(() => {
    if (isUserDetailsEdit) {
      !isEdit && toggleIsEdit()
    }
  }, [isUserDetailsEdit])

  const toggleEditState = () => {
    toggleIsEdit()
    cleanFormState({ changes: {} })
  }

  return (
    <>
      {(validationFields.loading || formState.loading) && (
        <View>
          <OText>
            Loading...
          </OText>
        </View>
      )}

      {!(validationFields.loading || formState.loading) && (
        <UDContainer>
          <UDHeader>
            <OText size={20}>
              {t('CUSTOMER_DETAILS', 'Customer Details')}
            </OText>
            {cartStatus !== 2 && (
              !isEdit ? (
                <MaterialIcon
                  name='pencil-outline'
                  size={28}
                  color={colors.editColor}
                  style={{ marginBottom: 10, marginLeft: 5 }}
                  onPress={() => toggleIsEdit()}
                />
              ) : (
                <MaterialIcon
                  name='cancel'
                  color={colors.cancelColor}
                  size={24}
                  style={{ marginBottom: 5, marginLeft: 5 }}
                  onPress={() => toggleEditState()}
                />
              )
            )}
          </UDHeader>

          {!isEdit ? (
            <UDInfo>
              <OText size={16}>
                <OText size={18} weight='bold'>
                  {t('NAME', 'Name')}:{' '}
                </OText>
                {userData?.name} {userData?.middle_name} {userData?.lastname} {userData?.second_lastname}
              </OText>
              <OText size={16}>
                <OText size={18} weight='bold'>
                  {t('EMAIL', 'Email')}:{' '}
                </OText>
                {userData?.email}
              </OText>
              {(userData?.cellphone || user?.cellphone) && (
                <OText size={16}>
                  <OText size={18} weight='bold'>
                    {t('CELLPHONE', 'Cellphone')}:{' '}
                  </OText>
                  {(userData?.country_phone_code) && `+${(userData?.country_phone_code)} `}{(userData?.cellphone)}
                </OText>
              )}
            </UDInfo>
          ) : (
            <UserFormDetailsUI {...props} />
          )}
        </UDContainer>
      )}
    </>
  )
}

export const UserDetails = (props: any) => {
  const userDetailsProps = {
    ...props,
    UIComponent: UserDetailsUI
  }

  return <UserFormController {...userDetailsProps} />
}
