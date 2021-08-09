import React, { useEffect } from 'react';
import { Pressable } from 'react-native'
import { UDContainer, UDHeader, UDInfo } from './styles';

import {
  UserFormDetails as UserFormController,
  useLanguage,
  useSession
} from 'ordering-components/native';

import { OText } from '../../../../../components/shared';
import { UserFormDetailsUI } from '../UserFormDetails';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';

const UserDetailsUI = (props: any) => {
  const {
    isEdit,
    formState,
    cleanFormState,
    cartStatus,
    toggleIsEdit,
    validationFields,
    isUserDetailsEdit,
    phoneUpdate,
    togglePhoneUpdate,
    isCheckout
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const userData = props.userData || (!formState.result.error && formState.result?.result) || user


  useEffect(() => {
    if (isUserDetailsEdit) {
      !isEdit && toggleIsEdit()
    }
  }, [isUserDetailsEdit])

  const toggleEditState = () => {
    toggleIsEdit()
    cleanFormState({ changes: {} })
  }

  useEffect(() => {
    if (user?.cellphone && !user?.country_phone_code) {
      togglePhoneUpdate(true)
    } else {
      togglePhoneUpdate(false)
    }
  }, [user?.country_phone_code])

  return (
    <>
      {(validationFields.loading || formState.loading) && (
        <Placeholder Animation={Fade}>
          <PlaceholderLine height={20} width={70} />
          <PlaceholderLine height={15} width={60} />
          <PlaceholderLine height={15} width={60} />
          <PlaceholderLine height={15} width={80} style={{ marginBottom: 20 }} />
        </Placeholder>
      )}

      {!(validationFields.loading || formState.loading) && (
        <UDContainer>
          <UDHeader>
            <OText size={16} weight={500}>
              {t('CUSTOMER_DETAILS', 'Customer Details')}
            </OText>
            {cartStatus !== 2 && (
              <Pressable onPress={() => toggleIsEdit()}>
                <OText color={isEdit ? theme.colors.cancelColor : theme.colors.green} style={{ paddingHorizontal: 10 }}>
                  {!isEdit ? t('EDIT', 'Edit') : t('CANCEL', 'Cancel')}
                </OText>
              </Pressable>
            )}
          </UDHeader>

          {!isEdit ? (
            <UDInfo>
              <OText size={16} mBottom={3} style={{ textAlign: 'left' }}>
                <OText size={16} weight={500}>
                  {t('NAME', 'Name')}:{' '}
                </OText>
                {userData?.name} {userData?.middle_name} {userData?.lastname} {userData?.second_lastname}
              </OText>
              <OText size={16} mBottom={3} style={{ textAlign: 'left' }}>
                <OText size={16} weight={500}>
                  {t('EMAIL', 'Email')}:{' '}
                </OText>
                {userData?.email}
              </OText>
              {!!(userData?.cellphone || user?.cellphone) && (
                <>
                  <OText size={16} style={{ textAlign: 'left' }}>
                    <OText size={16} weight={500}>
                      {t('CELLPHONE', 'Cellphone')}:{' '}
                    </OText>
                    {(userData?.country_phone_code) && `+${(userData?.country_phone_code)} `}{(userData?.cellphone)}
                  </OText>
                  {!!phoneUpdate && (
                    <OText color={theme.colors.error} style={{ textAlign: 'center' }}>{t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}</OText>
                  )}
                </>
              )}
            </UDInfo>
          ) : (
            <UserFormDetailsUI {...props} phoneUpdate={phoneUpdate} togglePhoneUpdate={togglePhoneUpdate} isCheckout={isCheckout} />
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
