import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import {
  ToastType,
  useToast,
  ForgotPasswordForm as ForgotPasswordController,
  useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container, FormInput } from './styles';
import { OButton, OInput, OText, OIconButton } from '../shared';

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
    header: {
      marginTop: 0,
      marginBottom: 30,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    text: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      color: theme.colors.textGray,
    },
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
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
      <View style={styles.header}>
        <OIconButton
          icon={theme.images.general.arrow_left}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 20, height: 20 }}
          style={styles.arrowLeft}
          onClick={() => navigation?.canGoBack() && navigation.goBack()}
        />

        <OText size={26} weight="600" style={styles.text}>
          {t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
        </OText>
      </View>

      <OText
        size={16}
        weight="normal"
        style={{ ...styles.text, marginBottom: 30 }}>
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
              placeholderTextColor={theme.colors.arrowColor}
              style={styles.inputStyle}
              icon={theme.images.logos.emailInputIcon}
              onChange={(e: any) => {
                handleChangeInputEmail(e, onChange);
              }}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              type="email-address"
              selectionColor={theme.colors.primary}
              color={theme.colors.textGray}
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
