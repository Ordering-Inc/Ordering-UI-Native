import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSession, useLanguage, ToastType, useToast } from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';

import { UDForm, UDLoader, UDWrapper, WrapperPhone, EditButton } from './styles';

import { OText, OButton, OInput } from '../shared';

import { PhoneInputNumber } from '../PhoneInputNumber'
import { sortInputFields } from '../../utils';
import { useTheme } from 'styled-components/native';

export const UserFormDetailsUI = (props: any) => {
  const {
    isEdit,
    formState,
    showField,
    cleanFormState,
    onCloseProfile,
    isRequiredField,
    validationFields,
    handleChangeInput,
    handleButtonUpdateClick,
    phoneUpdate,
    handleCancelEdit,
    isCheckout
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    btnOutline: {
      backgroundColor: '#FFF',
      color: theme.colors.primary
    },
    inputStyle: {
      marginBottom: 25,
      borderWidth: 1,
      borderColor: theme.colors.disabled
    },
    editButton: {
      // flex:0,
      borderRadius: 25,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.white,
      borderWidth: 1,
      color: theme.colors.primary,
      // width: 100,
      // height: 50,
      marginVertical: 8,
      // flex: 1,
    },
  });

  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { handleSubmit, control, errors, setValue } = useForm();

  const [{ user }] = useSession()
  const [userPhoneNumber, setUserPhoneNumber] = useState<any>(null)
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  });

  const showInputPhoneNumber = validationFields?.fields?.checkout?.cellphone?.enabled ?? false

  const getInputRules = (field: any) => {
    const rules: any = {
      required: isRequiredField(field.code)
        ? t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `${field.name} is required`)
          .replace('_attribute_', t(field.name, field.code))
        : null
    }
    if (field.code && field.code === 'email') {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
      }
    }
    return rules
  }

  const setUserCellPhone = (isEdit = false) => {
    if (userPhoneNumber && !userPhoneNumber.includes('null') && !isEdit) {
      setUserPhoneNumber(userPhoneNumber)
      return
    }
    if (user?.cellphone) {
      let phone = null
      if (user?.country_phone_code) {
        phone = `+${user?.country_phone_code} ${user?.cellphone}`
      } else {
        phone = user?.cellphone
      }
      setUserPhoneNumber(phone)
      setPhoneInputData({
        ...phoneInputData,
        phone: {
          country_phone_code: user?.country_phone_code || null,
          cellphone: user?.cellphone || null
        }
      })
      return
    }
    setUserPhoneNumber(user?.cellphone || '')
  }

  const onSubmit = () => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error)
      return
    }
    if (Object.keys(formState.changes).length > 0) {
      if (
        formState.changes?.cellphone === null &&
        validationFields?.fields?.checkout?.cellphone?.enabled &&
        validationFields?.fields?.checkout?.cellphone?.required
      ) {
        showToast(
          ToastType.Error,
          t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.')
        );
        return
      }
      let changes = null
      if (user?.cellphone && !userPhoneNumber) {
        changes = {
          country_phone_code: '',
          cellphone: ''
        }
      }
      handleButtonUpdateClick(changes)
    }
  }

  const handleChangePhoneNumber = (number: any) => {
    setPhoneInputData(number)
    let phoneNumber = {
      country_phone_code: {
        name: 'country_phone_code',
        value: number.phone.country_phone_code
      },
      cellphone: {
        name: 'cellphone',
        value: number.phone.cellphone
      }
    }
    handleChangeInput(phoneNumber, true)
  }

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors)
      if (phoneInputData.error) {
        list.push({ message: phoneInputData.error })
      }
      let stringError = ''
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      })
      showToast(ToastType.Error, stringError)
    }
  }, [errors])

  useEffect(() => {
    if ((!formState?.loading && formState?.result?.error)) {
      formState.result?.result && showToast(
        ToastType.Error,
        formState.result?.result[0]
      )
    }
  }, [formState?.loading])

  useEffect(() => {
    if (!isEdit && onCloseProfile) {
      onCloseProfile()
    }
    if ((user || !isEdit) && !formState?.loading) {
      setUserCellPhone()
      if (!isEdit && !formState?.loading) {
        cleanFormState && cleanFormState({ changes: {} })
        setUserCellPhone(true)
      }
    }
  }, [user, isEdit])
  return (
    <>
      <UDForm>
        {!validationFields?.loading &&
          sortInputFields({ values: validationFields?.fields?.checkout }).length > 0 &&
          (
            <UDWrapper>
              {sortInputFields({ values: validationFields.fields?.checkout }).map((field: any) =>
              (
                showField && showField(field.code) && (
                  <React.Fragment key={field.id}>
                    <Controller
                      key={field.id}
                      control={control}
                      render={() => (
                        <OInput
                          name={field.code}
                          placeholder={t(field.code.toUpperCase(), field?.name)}
                          style={styles.inputStyle}
                          icon={field.code === 'email' ? theme.images.general.email : theme.images.general.user}
                          autoCapitalize={field.code === 'email' ? 'none' : 'sentences'}
                          isDisabled={!isEdit}
                          value={formState?.changes[field.code] ?? (user && user[field.code]) ?? ''}
                          onChange={(val: any) => {
                            field.code !== 'email' ? setValue(field.code, val.target.value) : setValue(field.code, val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
                            field.code !== 'email' ? handleChangeInput(val) : handleChangeInput({ target: { name: 'email', value: val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, '') } })
                          }}
                          autoCorrect={field.code === 'email' && false}
                          type={field.code === 'email' ? 'email-address' : 'default'}
                          returnKeyType='done'
                          autoCompleteType={field.code === 'email' ? 'email' : 'off'}
                        />
                      )}
                      name={field.code}
                      rules={getInputRules(field)}
                      defaultValue={user && user[field.code]}
                    />
                  </React.Fragment>
                )
              ))}

              {!!showInputPhoneNumber && (
                <WrapperPhone>
                  <PhoneInputNumber
                    data={phoneInputData}
                    handleData={(val: any) => handleChangePhoneNumber(val)}
                    defaultValue={phoneUpdate ? '' : user?.cellphone}
                    defaultCode={user?.country_phone_code || null}
                  />
                  {phoneUpdate && (
                    <OText color={theme.colors.error} style={{ marginHorizontal: 10, textAlign: 'center' }}>{t('YOUR_PREVIOUS_CELLPHONE', 'Your previous cellphone')}: {user?.cellphone}</OText>
                  )}
                </WrapperPhone>
              )}

            </UDWrapper>
          )}
        {validationFields?.loading && (
          <UDLoader>
            <OText size={20}>
              {t('LOADING', 'Loading')}
            </OText>
          </UDLoader>
        )}
      </UDForm>
      <>
        {!validationFields.loading && !isCheckout && (
          <EditButton>
            <View style={{ flex: 1 }}>
              <OButton
                text={t('CANCEL', 'Cancel')}
                bgColor={theme.colors.white}
                borderColor={theme.colors.primary}
                isDisabled={formState.loading}
                imgRightSrc={null}
                style={{ ...styles.editButton }}
                onClick={handleCancelEdit}
              />
            </View>
            {((formState &&
              Object.keys(formState?.changes).length > 0 && isEdit) || formState?.loading) &&
              (
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <OButton
                    text={formState.loading ? t('UPDATING', 'Updating...') : t('UPDATE', 'Update')}
                    bgColor={theme.colors.primary}
                    textStyle={{ color: formState.loading ? 'black' : 'white' }}
                    borderColor={theme.colors.primary}
                    isDisabled={formState.loading}
                    imgRightSrc={null}
                    style={{ ...styles.editButton }}
                    onClick={handleSubmit(onSubmit)}
                  />
                </View>
              )}
          </EditButton>
        )}
        {((formState && Object.keys(formState?.changes).length > 0 && isEdit) || formState?.loading) && isCheckout && (
          <OButton
            text={formState.loading ? t('UPDATING', 'Updating...') : t('UPDATE', 'Update')}
            bgColor={theme.colors.primary}
            textStyle={{ color: 'white' }}
            borderColor={theme.colors.primary}
            isDisabled={formState.loading}
            imgRightSrc={null}
            onClick={handleSubmit(onSubmit)}
          />
        )}
      </>
    </>
  )
}
