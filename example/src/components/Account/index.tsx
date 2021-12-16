import React, { useState, useEffect } from 'react'
import {
  UserFormDetails as UserProfileController,
  useLanguage,
  useSession,
  ToastType,
  useToast
} from 'ordering-components/native'
import Spinner from 'react-native-loading-spinner-overlay'
import { launchImageLibrary } from 'react-native-image-picker'
import { StyleSheet, View } from 'react-native'
import { AccountParams } from '../../types'
import NavBar from '../NavBar'
import {
  OIcon,
  OIconButton,
  OText,
  OButton,
} from '../shared'
import { useTheme } from 'styled-components/native'
import { UserFormDetailsUI } from '../UserFormDetails'

import {
  CenterView,
  UserData,
  Names,
  EditButton
} from './styles'

const AccountUI = (props: AccountParams) => {
  const {
    navigation,
    isEdit,
    formState,
    validationFields,
    toggleIsEdit,
    cleanFormState,
    handleButtonUpdateClick
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ user }] = useSession()
  const [, { showToast }] = useToast()

  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  })
  const [phoneUpdate, setPhoneUpdate] = useState(false)

  const styles = StyleSheet.create({
    editButton: {
      borderRadius: 25,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.white,
      borderWidth: 1,
      color: theme.colors.primary,
      marginVertical: 8,
    },
  });

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', maxHeight: 200, maxWidth: 200, includeBase64: true }, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showToast(ToastType.Error, response.errorMessage);
      } else {
        if (response?.assets) {
          const url = `data:${response.assets[0].type};base64,${response.assets[0].base64}`
          handleButtonUpdateClick(null, true, url);
        } else {
          showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
        }
      }
    });
  }

  const handleCancelEdit = () => {
    cleanFormState({ changes: {} });
    toggleIsEdit();
    setPhoneInputData({
      error: '',
      phone: {
        country_phone_code: null,
        cellphone: null
      }
    })
  }

  useEffect(() => {
    if (formState.result.result && !formState.loading) {
      if (formState.result?.error) {
        showToast(ToastType.Error, formState.result.result);
      } else {
        showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
      }
    }
  }, [formState.result])

  useEffect(() => {
    if (user?.cellphone && !user?.country_phone_code) {
      setPhoneUpdate(true)
    } else {
      setPhoneUpdate(false)
    }
  }, [user?.country_phone_code])

  return (
    <>
      <NavBar
        title={t('ACCOUNT', 'Account')}
        titleAlign={'center'}
        onActionLeft={goToBack}
        showCall={false}
        paddingTop={10}
        btnStyle={{ paddingLeft: 0 }}
      />
      <CenterView>
        <OIcon
          url={user?.photo}
          src={!user?.photo && theme.images.general.user}
          cover
          width={100}
          height={100}
          style={{ borderRadius: 8 }}
        />
        <OIconButton
          icon={theme.images.general.camera}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 30, height: 30 }}
          style={{ maxWidth: 40 }}
          onClick={() => handleImagePicker()}
        />
      </CenterView>
      <Spinner visible={formState?.loading} />
      {!isEdit ? (
        <UserData>
          <Names>
            <OText space>{user?.name}</OText>
            <OText>{user?.lastname}</OText>
          </Names>
          {(!!user?.middle_name || !!user?.second_lastname) && (
            <Names>
              <OText space>{user?.middle_name}</OText>
              <OText>{user?.second_lastname}</OText>
            </Names>
          )}
          <OText>{user?.email}</OText>
          {!!user?.cellphone && <OText>{user?.cellphone}</OText>}
          {!!phoneUpdate && (
            <OText
              color={theme.colors.error}
            >
              {t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}
            </OText>
          )}
        </UserData>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 30 }}>
          <UserFormDetailsUI
            {...props}
            hideUpdateButton
            handleCancelEdit={handleCancelEdit}
            toggleIsEdit={toggleIsEdit}
          />
        </View>
      )}
      {!validationFields.loading && !isEdit && (
        <EditButton>
          <OButton
            text={t('EDIT', 'Edit')}
            bgColor={theme.colors.white}
            borderColor={theme.colors.primary}
            isDisabled={formState.loading}
            imgRightSrc={null}
            textStyle={{ fontSize: 20 }}
            style={{ ...styles.editButton }}
            onClick={toggleIsEdit}
          />
        </EditButton>
      )}
    </>
  )
}

export const Account = (props: any) => {
  const accoutProps = {
    ...props,
    UIComponent: AccountUI
  }
  return <UserProfileController {...accoutProps} />
}
