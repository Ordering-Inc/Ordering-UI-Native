import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';

import { PhoneInputNumber } from '../PhoneInputNumber'

import {
  SignupForm as SignUpController,
  useLanguage,
  useConfig
} from 'ordering-components/native';

import {
  FormSide,
  FormInput,
  ButtonsSection,
  SocialButtons
} from './styles'

import { IMAGES } from '../../config/constants';
import { ToastType, useToast } from '../../providers/ToastProvider';
import NavBar from '../NavBar'

import { OText, OButton, OInput } from '../shared';
import { signupParams } from '../../types';
import { colors } from '../../theme'

const notValidationFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'address_notes']

const SignupFormUI = (props: signupParams) => {
  const {
    navigation,
    loginButtonText,
    signupButtonText,
    onNavigationRedirect,
    formState,
    validationFields,
    showField,
    isRequiredField,
    useChekoutFileds,
    handleSuccessSignup,
    handleButtonSignupClick
  } = props

  const { showToast } = useToast();
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const { control, handleSubmit, errors } = useForm();

  const showInputPhoneNumber = validationFields?.fields?.checkout?.cellphone?.enabled ?? false

  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  });

  const onSubmit = (values: any) => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return
    }
    if (
      !phoneInputData.phone.country_phone_code &&
      !phoneInputData.phone.cellphone &&
      validationFields?.fields?.checkout?.cellphone?.required
    ) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.'))
      return
    }
    handleButtonSignupClick && handleButtonSignupClick({
      ...values,
      ...phoneInputData.phone
    })
    if (!formState.loading && formState.result.result && !formState.result.error) {
      handleSuccessSignup && handleSuccessSignup(formState.result.result)
    }
  }

  // get object with rules for hook form inputs
  const getRules = (field: any) => {
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

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      formState.result?.result && showToast(
        ToastType.Error,
        formState.result?.result[0]
      )
    }
  }, [formState])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors)
      if (phoneInputData.error) {
        list.push({ message: phoneInputData.error })
      }
      if (
        !phoneInputData.error &&
        !phoneInputData.phone.country_phone_code &&
        !phoneInputData.phone.cellphone &&
        validationFields?.fields?.checkout?.cellphone?.required
      ) {
        list.push({ message: t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.') })
      }
      let stringError = ''
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      })
      showToast(ToastType.Error, stringError)
    }
  }, [errors])

  return (
    <View>
      <NavBar
        title={t('SIGNUP', 'Signup')}
        titleAlign={'center'}
        onActionLeft={() => navigation.goBack()}
        showCall={false}
        btnStyle={{ paddingLeft: 0 }}
      />
      <FormSide>
        <FormInput>
          {!(useChekoutFileds && validationFields?.loading) ? (
            <>
              {
                validationFields?.fields?.checkout &&
                Object.values(validationFields?.fields?.checkout).map(
                  (field: any) => !notValidationFields.includes(field.code) && (
                  showField(field.code) && (
                    <Controller
                      key={field.id}
                      control={control}
                      render={({ onChange, value }) => (
                        <OInput
                          placeholder={t(field.name)}
                          style={style.inputStyle}
                          icon={field.code === 'email' ? IMAGES.email : IMAGES.user}
                          value={value}
                          onChange={(val: any) => onChange(val)}
                        />
                      )}
                      name={field.code}
                      rules={getRules(field)}
                      defaultValue=""
                    />
                  )
                ))
              }

              {!!showInputPhoneNumber && (
                <PhoneInputNumber
                data={phoneInputData}
                handleData={(val: any) => setPhoneInputData(val)}
                />
              )}

              <Controller
                control={control}
                render={({ onChange, value }) => (
                  <OInput
                    isSecured={true}
                    placeholder={'Password'}
                    style={style.inputStyle}
                    icon={IMAGES.lock}
                    value={value}
                    onChange={(val: any) => onChange(val)}
                  />
                )}
                name="password"
                rules={{
                  required: isRequiredField('password')
                    ? t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required')
                      .replace('_attribute_', t('PASSWORD', 'password'))
                    : null,
                  minLength: {
                    value: 8,
                    message: t('VALIDATION_ERROR_PASSWORD_MIN_STRING', 'The Password must be at least 8 characters.')
                      .replace('_attribute_', t('PASSWORD', 'Password')).replace('_min_', 8)
                  }
                }}
                defaultValue=""
              />
            </>
          ) : (
            <Spinner visible />
          )}

          <OButton
            onClick={handleSubmit(onSubmit)}
            text={signupButtonText}
            bgColor={colors.primary}
            borderColor={colors.primary}
            textStyle={{color: 'white'}}
            imgRightSrc={null}
            isDisabled={formState.loading || validationFields.loading}
          />
        </FormInput>

        {onNavigationRedirect && loginButtonText && (
          <View style={style.wrappText}>
            <OText size={18} style={{ marginRight: 5 }}>
              {t('MOBILE_FRONT_ALREADY_HAVE_AN_ACCOUNT', 'Already have an account?')}
            </OText>
            <Pressable onPress={() => onNavigationRedirect('Login')}>
              <OText size={18} color={colors.primary}>
                {loginButtonText}
              </OText>
            </Pressable>
          </View>
        )}

        {configs && Object.keys(configs).length > 0 && (
          (configs?.facebook_login?.value === 'true' ||
              configs?.facebook_login?.value === '1') &&
              configs?.facebook_id?.value &&
          (
            <ButtonsSection>
              <OText size={18} mBottom={30} color={colors.disabled}>
                {t('SELECT_AN_OPTION_TO_LOGIN', 'Select an option to login')}
              </OText>

              <SocialButtons>
                <OText size={18} mBottom={30} color={colors.disabled}>
                  facebook login button
                </OText>
              </SocialButtons>
            </ButtonsSection>
          )
        )}
      </FormSide>
      <Spinner visible={formState.loading || validationFields.loading} />
    </View>
  );
};

const style = StyleSheet.create({
  btnOutline: {
    backgroundColor: '#FFF',
    color: colors.primary
  },
  inputStyle: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.disabled
  },
  wrappText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export const SignupForm = (props: any) => {
  const signupProps = {
    ...props,
    UIComponent: SignupFormUI,
  };
  return <SignUpController {...signupProps} />;
};
