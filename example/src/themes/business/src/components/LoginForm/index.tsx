import React, { useEffect, useState, useRef } from 'react';
import { Pressable, StyleSheet, Keyboard, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ToastType,
  useToast,
  LoginForm as LoginFormController,
  useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container, FormSide, FormInput } from './styles';
import { OText, OButton, OInput } from '../shared';
import { LoginParams } from '../../types';

const LoginFormUI = (props: LoginParams) => {
  const {
    formState,
    loginButtonText,
    forgotButtonText,
    handleButtonLoginClick,
    onNavigationRedirect,
    emailInputIcon,
    passwordInputIcon,
  } = props;

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const theme = useTheme();
  const { control, handleSubmit, getValues, errors } = useForm();

  const [passwordSee, setPasswordSee] = useState(false);

  const inputRef = useRef<any>({});

  const handleLogin = () => {
    const email = getValues('email');
    const message =
      !Object.keys(errors).length && !email
        ? t(
            'VALIDATION_ERROR_EMAIL_REQUIRED',
            'The field Email is required',
          ).replace('_attribute_', t('EMAIL', 'Email'))
        : '';

    if (errors?.email || !email) {
      showToast(ToastType.Error, errors.email?.message || message);
    } else if (errors?.password) {
      showToast(ToastType.Error, errors.password?.message);
    } else {
      handleSubmit(onSubmit);
    }
  };

  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    handleButtonLoginClick({
      ...values,
    });
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      formState.result?.result &&
        showToast(
          ToastType.Error,
          typeof formState.result?.result === 'string'
            ? formState.result?.result
            : formState.result?.result[0],
        );
    }
  }, [formState]);

  const loginStyle = StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
    },
    welcomeView: {
      flex: 1,
      width: '90%',
      marginBottom: 20,
    },
    emailInput: {
      color: theme.colors.inputTextColor,
      marginBottom: 25,
      borderWidth: 1,
      borderRadius: 7.6,
      borderColor: theme.colors.inputTextColor,
      backgroundColor: theme.colors.transparent,
    },
    passwordInput: {
      color: theme.colors.inputTextColor,
      marginBottom: 13,
      borderWidth: 1,
      borderRadius: 7.6,
      borderColor: theme.colors.inputTextColor,
      backgroundColor: theme.colors.transparent,
    },
    button: {
      borderRadius: 7.6,
      height: 44,
    },
    textButton: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    textTitle: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 45,
    },
    textSubtitle: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 16,
    },
    textForgot: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 16,
    },
  });

  return (
    <Container contentContainerStyle={loginStyle.container}>
      <FormSide>
        <View style={loginStyle.welcomeView}>
          <Text style={loginStyle.textTitle}>{t('TITLE_HOME', 'Welcome')}</Text>
          <Text style={loginStyle.textSubtitle}>
            {t(
              'BUSINESS_WELCOME_SUBTITLE',
              "Let's start to admin your business now",
            )}
          </Text>
        </View>

        <FormInput>
          <Controller
            control={control}
            render={({ onChange, value }: any) => (
              <OInput
                placeholder={t('EMAIL', 'Email')}
                placeholderTextColor={theme.colors.inputTextColor}
                style={loginStyle.emailInput}
                icon={emailInputIcon}
                iconColor={theme.colors.inputTextColor}
                onChange={(e: any) => {
                  handleChangeInputEmail(e, onChange);
                }}
                value={value}
                autoCapitalize="none"
                autoCorrect={false}
                type="email-address"
                autoCompleteType="email"
                returnKeyType="next"
                onSubmitEditing={() => inputRef.current?.focus()}
                blurOnSubmit={false}
                selectionColor={theme.colors.inputTextColor}
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

          <Controller
            control={control}
            render={({ onChange, value }: any) => (
              <OInput
                isSecured={!passwordSee ? true : false}
                placeholder={t('PASSWORD', 'Password')}
                placeholderTextColor={theme.colors.inputTextColor}
                style={loginStyle.passwordInput}
                icon={passwordInputIcon}
                iconColor={theme.colors.inputTextColor}
                iconCustomRight={
                  !passwordSee ? (
                    <MaterialCommunityIcons
                      name="eye-outline"
                      size={24}
                      color={theme.colors.inputTextColor}
                      onPress={() => setPasswordSee(!passwordSee)}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="eye-off-outline"
                      size={24}
                      color={theme.colors.inputTextColor}
                      onPress={() => setPasswordSee(!passwordSee)}
                    />
                  )
                }
                value={value}
                forwardRef={inputRef}
                onChange={(val: any) => onChange(val)}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                blurOnSubmit
                selectionColor={theme.colors.inputTextColor}
              />
            )}
            name="password"
            rules={{
              required: t(
                'VALIDATION_ERROR_PASSWORD_REQUIRED',
                'The field Password is required',
              ).replace('_attribute_', t('PASSWORD', 'Password')),
              pattern: {
                value: /.{8,}/,
                message: t(
                  'AT_LEAST_8_CHARACTERS_FOR_THE_PASSWORD',
                  'At least 8 characters for the Password',
                ).replace('_attribute_', t('PASSWORD', 'Password')),
              },
            }}
            defaultValue=""
          />

          {onNavigationRedirect && forgotButtonText && (
            <Pressable
              style={{ width: '100%', marginBottom: 40 }}
              onPress={() => onNavigationRedirect('Forgot')}>
              <OText style={loginStyle.textForgot}>{forgotButtonText}</OText>
            </Pressable>
          )}

          <OButton
            onClick={handleLogin}
            text={loginButtonText}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            textStyle={loginStyle.textButton}
            imgRightSrc={null}
            isLoading={formState.loading}
            style={loginStyle.button}
          />
        </FormInput>
      </FormSide>
    </Container>
  );
};

export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    allowedLevels: [0, 2],
    UIComponent: LoginFormUI,
  };
  return <LoginFormController {...loginProps} />;
};
