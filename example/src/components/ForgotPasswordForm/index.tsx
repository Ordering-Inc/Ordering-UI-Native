import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import BottomWrapper from '../BottomWrapper';
import NavBar from '../NavBar';
import { OButton, OInput, OText } from '../shared';
import { colors,images } from '../../theme.json';
import { ToastType, useToast } from '../../providers/ToastProvider';

import {
  ForgotPasswordForm as ForgotPasswordController,
  useLanguage
} from 'ordering-components/native';

import { Wrapper } from './styles';
import { Container } from '../../layouts/Container';

const ForgotPasswordUI = (props: any) => {
  const {
    navigation,
    formState,
    handleButtonForgotPasswordClick,
  } = props;
  const [, t] = useLanguage();
  const { showToast } = useToast();
  const { control, handleSubmit, errors } = useForm();

  const [emailSent, setEmailSent] = useState(null);

  const onSubmit = (values: any) => {
    setEmailSent(values.email)
    handleButtonForgotPasswordClick && handleButtonForgotPasswordClick(values)
  }

  const handleChangeInputEmail = (value : string, onChange : any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
  }

  useEffect(() => {
    if (!formState.loading && emailSent) {
      if (formState.result?.error) {
        setEmailSent(null)
        formState.result?.result && showToast(
          ToastType.Error,
          formState.result?.result[0]
        )
        return
      }
      showToast(
        ToastType.Success,
        `${t('SUCCESS_SEND_FORGOT_PASSWORD', 'Your link has been sent to the email')}: ${emailSent}`
      )
    }
  }, [formState])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors)
      let stringError = ''
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      })
      showToast(ToastType.Error, stringError)
    }
  }, [errors])

  return (
    <Container>
      <NavBar
        title={t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
        titleAlign={'center'}
        onActionLeft={() => navigation.canGoBack && navigation.goBack()}
        showCall={false}
        btnStyle={{ left: 10 }}
        paddingTop={0}
      />
    <View style={{flex: 1, height: 400}}>
      <Wrapper>
        <OText
          color={'gray'}
          size={16}
          weight={'300'}
          style={{ marginBottom: 30 }}
        >
          {t('FORGOT_PASSWORD_TEXT_MESSAGE', "Enter your email address and we'll sent a link to reset your password.")}
        </OText>
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <OInput
              placeholder={t('EMAIL', 'Email')}
              style={style.inputStyle}
              icon={images.general.email}
              value={value}
              onChange={(e: any) => {
                handleChangeInputEmail(e, onChange)
              }}
              autoCapitalize='none'
              autoCompleteType='off'
              autoCorrect={false}
              type='email-address'
              isSecured
            />
          )}
          name="email"
          rules={{
            required: t('VALIDATION_ERROR_EMAIL_REQUIRED', 'The field Email is required').replace('_attribute_', t('EMAIL', 'Email')),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
            }
          }}
          defaultValue=""
        />
      </Wrapper>
      <BottomWrapper>
        <OButton
          text={emailSent && !formState.result?.error ? t('LINK_SEND_FORGOT_PASSWORD', 'Link Sent') : t('FRONT_RECOVER_PASSWORD', 'Recover Password')}
          textStyle={{ color: 'white' }}
          bgColor={emailSent && !formState.result?.error ? colors.disabled : colors.primary}
          borderColor={emailSent && !formState.result?.error ? colors.disabled : colors.primary}
          isLoading={formState.loading}
          onClick={emailSent && !formState.result?.error ? () => {} : handleSubmit(onSubmit)}
        />
      </BottomWrapper>
    </View>
    </Container>
  )
}

const style = StyleSheet.create({
  inputStyle: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.disabled
  }
});

export const ForgotPasswordForm = (props:  any) => {
  const ForgotPasswordProps = {
    ...props,
    UIComponent: ForgotPasswordUI
  }
  return <ForgotPasswordController {...ForgotPasswordProps} />
}
