import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import {
  ToastType,
  useToast,
  ForgotPasswordForm as ForgotPasswordController,
  useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container, FormInput } from './styles';
import { OButton, OInput, OText } from '../shared';
import NavBar from '../NavBar';

const ForgotPasswordUI = (props: any) => {
  const { navigation, formState, handleButtonForgotPasswordClick } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { control, handleSubmit, errors } = useForm();

  const [emailSent, setEmailSent] = useState(null);

  const onSubmit = (values: any) => {
    setEmailSent(values.email);
    handleButtonForgotPasswordClick && handleButtonForgotPasswordClick(values);
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  useEffect(() => {
    if (!formState.loading && emailSent) {
      if (formState.result?.error) {
        setEmailSent(null);
        formState.result?.result &&
          showToast(ToastType.Error, formState.result?.result[0]);
        return;
      }
      showToast(
        ToastType.Success,
        `${t(
          'SUCCESS_SEND_FORGOT_PASSWORD',
          'Your link has been sent to the email',
        )}: ${emailSent}`,
      );
    }
  }, [formState]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  const styles = StyleSheet.create({
    title: {
      backgroundColor: theme.colors.transparent,
    },
    inputStyle: {
      marginBottom: 25,
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      borderRadius: 7.6,
    },
    ButtonText: {
      color: theme.colors.primaryContrast,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 17,
    },
    button: {
      borderRadius: 7.6,
      height: 44,
    },
  });

  return (
    <Container>
      <NavBar
        title={t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
        titleAlign={'center'}
        onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
        showCall={false}
        paddingTop={0}
        titleColor={theme.colors.textGray}
        icon={theme.images.general.arrow_left}
        style={styles.title}
      />

      <OText
        color={theme.colors.gray}
        size={16}
        weight={'400'}
        style={{ marginBottom: 30 }}>
        {t(
          'FORGOT_PASSWORD_TEXT_MESSAGE',
          "Enter your email address and we'll sent a link to reset your password.",
        )}
      </OText>

      <FormInput>
        <Controller
          control={control}
          render={({ onChange, value }: any) => (
            <OInput
              placeholder={t('EMAIL', 'Email')}
              style={styles.inputStyle}
              icon={theme.images.logos.emailInputIcon}
              onChange={(e: any) => {
                handleChangeInputEmail(e, onChange);
              }}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              type="email-address"
              autoCompleteType="email"
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
          name="email"
          rules={{
            required: t(
              'VALIDATION_ERROR_EMAIL_REQUIRED',
              'The field Email is required',
            ).replace('_attribute_', t('EMAIL', 'Email')),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t(
                'INVALID_ERROR_EMAIL',
                'Invalid email address',
              ).replace('_attribute_', t('EMAIL', 'Email')),
            },
          }}
          defaultValue=""
        />

        <OButton
          text={
            emailSent && !formState.result?.error
              ? t('LINK_SEND_FORGOT_PASSWORD', 'Link Sent')
              : t('FRONT_RECOVER_PASSWORD', 'Recover Password')
          }
          textStyle={styles.ButtonText}
          style={styles.button}
          bgColor={
            emailSent && !formState.result?.error
              ? theme.colors.disabled
              : theme.colors.primary
          }
          borderColor={
            emailSent && !formState.result?.error
              ? theme.colors.disabled
              : theme.colors.primary
          }
          isLoading={formState.loading}
          onClick={
            emailSent && !formState.result?.error
              ? () => {}
              : handleSubmit(onSubmit)
          }
        />
      </FormInput>
    </Container>
  );
};

export const ForgotPasswordForm = (props: any) => {
  const ForgotPasswordProps = {
    ...props,
    UIComponent: ForgotPasswordUI,
  };
  return <ForgotPasswordController {...ForgotPasswordProps} />;
};
