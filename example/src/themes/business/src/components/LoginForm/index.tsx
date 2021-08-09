import React, { useEffect, useState, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Keyboard,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
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
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  const inputRef = useRef<any>({});

  const getTraduction = (key: string) => {
    const keyList: any = {
      // Add the key and traduction that you need below
      ERROR_ORDER_WITHOUT_CART: 'The order was placed without a cart',
      ERROR_INVALID_COUPON: "The coupon doesn't exist",
      ERROR_IVALID_COUPON_MINIMUM:
        'You must have more products in your cart to use the coupon',
      ERROR_ADD_PRODUCT_VERY_FAR_FOR_PICKUP:
        'The business is too far for order type pickup',
      ERROR_PLACE_PAY_WITH_CARD2:
        'An error occurred while trying to pay by card',
      ERROR_ADD_PRODUCT_BUSINESS_CLOSED: 'The business is closed at the moment',
      INTERNAL_ERROR: 'Server Error, please wait, we are working to fix it',
      ERROR_NOT_FOUND_BUSINESSES: 'No businesses found near your location',
      YOU_DO_NOT_HAVE_PERMISSION: 'You do not have permission',
      INVALID_CODE: 'Invalid verify code',
      STRIPE_ERROR: 'Payment service error. Try again later.',
      ERROR_AUTH_TWILIO_DISABLED: 'Auth error, twilio is disabled',
      ERROR_CART_SELECT_PAYMETHOD: 'An error occurred with selected pay method',
      ERROR_YOU_HAVE_ACTIVE_CART: "You can't reorder this cart",
      ERROR_YOU_HAVE_NOT_CART: 'Cart not found',
      ERROR_PLACE_PAY_WITH_REDIRECT:
        'An error occurred while trying to pay by redirect',
      ERROR_PLACE_PAY_WITH_CARD1:
        'An error occurred while trying to pay by card',
      ERROR_PLACE_PAY_WITH_PAYPAL_CAPTURE:
        'An error occurred while trying to pay by PayPal',
      ERROR_ADD_PRODUCT_VERY_FAR_FOR_DELIVERY:
        'Error adding product, very far for delivery',
    };

    return keyList[key] ? t(key, keyList[key]) : t(key);
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  const handleLogin = () => {
    setLoading(true);
    handleSubmit(onSubmit)();
  };

  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    handleButtonLoginClick({
      ...values,
    });
  };

  useEffect(() => {
    if (!formState?.loading && formState?.result?.error) {
      formState?.result?.result &&
        showToast(
          ToastType.Error,
          typeof formState.result?.result === 'string'
            ? getTraduction(formState.result?.result)
            : getTraduction(formState.result?.result[0]),
        );
    }
  }, [formState]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      showToast(
        ToastType.Error,
        errors?.email
          ? getTraduction(errors.email?.message)
          : getTraduction(errors?.password?.message),
      );
    }
  }, [errors]);

  useEffect(() => {
    if (loading && !formState?.loading) {
      setLoading(false);
    }
  }, [loading]);

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  const loginStyle = StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
    },
    logo: {
      alignItems: 'center',
      marginTop: Platform.OS === 'ios' ? 20 : 20,
      marginBottom: orientation === 'Portrait' ? '40%' : '10%',
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
      <View style={loginStyle.logo}>
        <Image source={theme.images.logos.logotypeInvert} />
      </View>

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
                  'VALIDATION_ERROR_PASSWORD_MIN_STRING',
                  'The Password must be at least 8 characters.',
                )
                  .replace('_attribute_', t('PASSWORD', 'Password'))
                  .replace('_min_', 8),
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
            isLoading={formState?.loading || loading}
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
