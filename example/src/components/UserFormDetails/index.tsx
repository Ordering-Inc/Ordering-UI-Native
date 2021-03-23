import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSession, useLanguage } from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';

import { UDForm, UDLoader, UDWrapper } from './styles';

import { ToastType, useToast } from '../../providers/ToastProvider';
import { OText, OButton, OInput } from '../shared';
import { colors } from '../../theme';
import { IMAGES } from '../../config/constants';

// import { PhoneInputNumber } from '../PhoneInputNumber';

const notValidationFields = ['coupon', 'driver_tip', 'mobile_phone']

export const UserFormDetailsUI = (props: any) => {
  const {
    isEdit,
    formState,
    onCancel,
    showField,
    cleanFormState,
    onCloseProfile,
    isRequiredField,
    validationFields,
    handleChangeInput,
    handleButtonUpdateClick,
    isCheckout
  } = props

  const [, t] = useLanguage();
  const { showToast } = useToast();
  const { handleSubmit, control, errors, setValue } = useForm();

  const [{ user }] = useSession()
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(null)
  const [validationFieldsSorted, setValidationFieldsSorted] = useState([])
  const [userPhoneNumber, setUserPhoneNumber] = useState<any>(null)
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  });
  // const [alertState, setAlertState] = useState({ open: false, content: [] })

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
    // const isPhoneNumberValid = userPhoneNumber ? isValidPhoneNumber : true
    // if (!userPhoneNumber &&
    //     validationFields?.fields?.checkout?.cellphone?.required &&
    //     validationFields?.fields?.checkout?.cellphone?.enabled
    // ) {
    //   showToast(
    //     ToastType.Error,
    //     t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.')
    //   );
    //   return
    // }
    // if (!isPhoneNumberValid && userPhoneNumber) {
    //   if (user?.country_phone_code) {
    //     showToast(
    //       ToastType.Error,
    //       t('INVALID_ERROR_PHONE_NUMBER', 'The Phone Number field is invalid')
    //     );
    //     return
    //   }
    //   showToast(
    //     ToastType.Error,
    //     t('INVALID_ERROR_COUNTRY_CODE_PHONE_NUMBER', 'The country code of the phone number is invalid')
    //   );
    //   return
    // }
    // if (Object.keys(formState.changes).length > 0 && isPhoneNumberValid) {
    if (Object.keys(formState.changes).length > 0) {
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

  // const handleChangePhoneNumber = (number, isValid) => {
  const handleChangePhoneNumber = (data: any) => {
    console.log(data);
    // setUserPhoneNumber(number)

    // let phoneNumberParser = null
    // let phoneNumber = {
    //   country_phone_code: {
    //     name: 'country_phone_code',
    //     value: ''
    //   },
    //   cellphone: {
    //     name: 'cellphone',
    //     value: ''
    //   }
    // }
    // if (isValid) {
    //   phoneNumberParser = parsePhoneNumber(number)
    // }
    // if (phoneNumberParser) {
    //   phoneNumber = {
    //     country_phone_code: {
    //       name: 'country_phone_code',
    //       value: phoneNumberParser.countryCallingCode
    //     },
    //     cellphone: {
    //       name: 'cellphone',
    //       value: phoneNumberParser.nationalNumber
    //     }
    //   }
    // }
    // handleChangeInput(phoneNumber, true)
  }

  const sortValidationFields = () => {
    const fields = ['name', 'middle_name', 'lastname', 'second_lastname', 'email']
    const fieldsSorted: any = []
    const validationsFieldsArray = Object.values(validationFields.fields?.checkout)

    fields.forEach(f => {
      validationsFieldsArray.forEach((field: any) => {
        if (f === field.code) {
          fieldsSorted.push(field)
        }
      })
    })
    setValidationFieldsSorted(fieldsSorted)
  }

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors)
      if (!isValidPhoneNumber && userPhoneNumber) {
        list.push({ message: t('INVALID_ERROR_PHONE_NUMBER', 'The Phone Number field is invalid.') })
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
    if (validationFields?.fields?.checkout) {
      sortValidationFields()
    }
  }, [validationFields?.fields?.checkout])

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
        {!validationFields?.loading && validationFieldsSorted.length > 0 && (
          <UDWrapper>
            {validationFieldsSorted.map((field: any) =>
              !notValidationFields.includes(field.code) &&
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
                        icon={field.code === 'email' ? IMAGES.email : IMAGES.user}
                        isDisabled={!isEdit}
                        value={formState?.result?.result
                          ? formState?.result?.result[field.code]
                          : formState?.changes[field.code] ?? (user && user[field.code]) ?? ''}
                        onChange={(val: any) => {
                          setValue(field.code, val.target.value)
                          handleChangeInput(val)
                        }}
                      />
                    )}
                    name={field.code}
                    rules={getInputRules(field)}
                    defaultValue={formState?.result?.result
                      ? formState?.result?.result[field.code]
                      : formState?.changes[field.code] ?? (user && user[field.code]) ?? ''}
                  />
                </React.Fragment>
              )
            ))}

            {/* {!!showInputPhoneNumber && (
              <PhoneInputNumber
                currentNumber={userPhoneNumber?.replace(/\s+/g, '')}
                data={phoneInputData}
                handleData={(val: any) => setPhoneInputData(val)}
                setValue={handleChangePhoneNumber}
                handleIsValid={setIsValidPhoneNumber}
                disabled={!isEdit}
                values={phoneInputData}
              />
            )} */}
          </UDWrapper>
        )}
        {validationFields?.loading && (
          <UDLoader>
            <OText size={20}>
              Loading...
            </OText>
          </UDLoader>
        )}
      </UDForm>
      {((formState && Object.keys(formState?.changes).length > 0 && isEdit) || formState?.loading) && (
        <OButton
          text={formState.loading ? t('UPDATING', 'Updating...') : t('UPDATE', 'Update')}
          bgColor={colors.primary}
          textStyle={{color: 'white'}}
          borderColor={colors.primary}
          isDisabled={formState.loading}
          imgRightSrc={null}
          onClick={handleSubmit(onSubmit)}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  btnOutline: {
    backgroundColor: '#FFF',
    color: colors.primary
  },
  inputStyle: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.disabled
  }
});
