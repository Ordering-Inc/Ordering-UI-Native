import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'styled-components/native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  UserVerification as UserVerificationController,
  UserFormDetails as UserFormController,
  useToast,
  useSession,
  useLanguage,
  ToastType,
  useConfig
} from 'ordering-components/native';

import { OText, OInput, OButton, OModal } from '../shared';
import { LogoutButton } from '../LogoutButton'
import { UserFormDetailsUI } from '../UserFormDetails'
import { PhoneInputNumber } from '../PhoneInputNumber';

import {
  Container,
  InputsSection,
  WrapperText,
  InputWrapper,
  WrappCountdown,
  CountDownContainer,
  OtpSection,
  DigitInput,
  ButtonsActions,
  WrapperActions
} from './styles'

const CONDITIONAL_CODES = [1787]
const TIME_COUNTDOWN = 60 * 10 // 10 minutes

const UserDetails = (props: any) => {
  const userDetailsProps = {
    ...props,
    isEdit: true,
    useValidationFields: true,
    useDefualtSessionManager: true,
    UIComponent: UserFormDetailsUI
  }

  return <UserFormController {...userDetailsProps} />
}

const UserVerificationUI = (props: any) => {
  const {
    verifyEmailState,
    verifyPhoneState,
    sendVerifyEmailCode,
    sendVerifyPhoneCode,
    checkVerifyEmailCode,
    checkVerifyPhoneCode,
    cleanErrorsState,
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ auth, user }] = useSession()
  const [, { showToast }] = useToast();

  const isEmailVerifyRequired = auth && configs?.verification_email_required?.value === '1' && !user?.email_verified
  const isPhoneVerifyRequired = auth && configs?.verification_phone_required?.value === '1' && !user?.phone_verified

  const CODE_LENGTH = isEmailVerifyRequired ? 6 : 4

  const ref = useRef<TextInput>(null);

  const [otpState, setOtpState] = useState('')

  const [timer, setTimer] = useState(`${TIME_COUNTDOWN / 60}:00`)
  const [isSendCodeAgain, setIsSendCodeAgain] = useState(false)
  const [containerIsFocused, setContainerIsFocused] = useState(false);

  const [phoneState, setPhoneState] = useState<any>(null)
  const [verificationState, setVerificationState] = useState({ email: false, phone: false })

  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);

  const phoneLength = phoneState?.cellphone && phoneState?.country_phone_code && phoneState?.cellphone?.split('')?.length
  const lastNumbers = phoneState?.cellphone && phoneState?.country_phone_code && phoneState?.cellphone?.split('').fill('*', 0, phoneLength - 2).join('')

  const style = StyleSheet.create({
    inputContainer: {
      borderWidth: 1,
      borderRadius: 7.6,
      padding: 12,
      borderColor: theme.colors.disabled,
    },
    inputContainerFocused: {
      borderColor: theme.colors.primary,
    },
    hiddenCodeInput: {
      position: 'absolute',
      height: 0,
      width: 0,
      opacity: 0,
    },
    inputStyle: {
      marginBottom: 28,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 7.6,
    },
    btnStyle: {
      borderRadius: 7.6,
      marginTop: 5,
      marginBottom: 2
    },
    phoneSelect: {
      borderWidth: 0,
      marginStart: -5,
      marginEnd: 0,
      marginTop: -3,
      height: 32,
      width: 44
    },
    phoneInputStyle: {
      height: 30,
      borderWidth: 1,
      fontSize: 12,
      paddingBottom: 0,
      marginBottom: -0,
      paddingHorizontal: 10
    }
  });

  const handleOnPress = () => {
    setContainerIsFocused(true);
    ref?.current?.focus();
  };

  const handleOnBlur = () => {
    setContainerIsFocused(false);
  };

  const toDigitInput = (_value: number, idx: number) => {
    const emptyInputChar = '0';
    const digit = otpState[idx] || emptyInputChar;

    const isCurrentDigit = idx === otpState.length;
    const isLastDigit = idx === CODE_LENGTH - 1;
    const isCodeFull = otpState.length === CODE_LENGTH;

    const isFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    const containerStyle =
      containerIsFocused && isFocused
        ? { ...style.inputContainer, ...style.inputContainerFocused }
        : style.inputContainer;

    return (
      <View key={idx} style={containerStyle}>
        <Text
          style={{
            fontSize: 20,
            color: otpState[idx] ? theme.colors.black : theme.colors.disabled
          }}
        >
          {digit}
        </Text>
      </View>
    );
  };

  const handleSendOtp = (opt: string = '') => {
    setTimer(`${TIME_COUNTDOWN / 60}:00`)
    setIsSendCodeAgain(true)
    if (opt === 'phone') {
      let cellphone = phoneState?.cellphone
      let country_phone_code = phoneState?.country_phone_code

      if (CONDITIONAL_CODES.includes(Number(country_phone_code))) {
        if (Number(country_phone_code) === 1787) {
          cellphone = `787${cellphone}`
          country_phone_code = '1'
        }
      }
      sendVerifyPhoneCode({
        cellphone,
        country_phone_code
      })
      return
    }
    sendVerifyEmailCode({ email: user?.email })
  }

  const setupUserPhoneNumber = () => {
    if (!user || !user?.cellphone || !user?.country_phone_code) return
    setPhoneState({
      cellphone: user?.country_code === "PR" ? user?.cellphone.replace('787', '') : user?.cellphone,
      country_phone_code: user?.country_code === "PR" ? '1787' : user?.country_phone_code,
      formatted: `+${user?.country_phone_code} ${user?.cellphone}`
    })
  }

  useEffect(() => {
    if (verificationState.phone) {
      let _timer = TIME_COUNTDOWN - 1;
      let minutes = 0;
      let seconds = 0;
      const interval = setInterval(() => {
        minutes = _timer / 60;
        seconds = _timer % 60;

        minutes = minutes < 10 ? 0 + minutes : minutes;
        seconds = seconds < 10 ? 0 + seconds : seconds;

        const formatMinutes = parseInt(minutes.toString()) < 10
          ? `0${parseInt(minutes.toString())}`
          : parseInt(minutes.toString());

        const formatseconds = parseInt(seconds.toString()) < 10
          ? `0${parseInt(seconds.toString())}`
          : parseInt(seconds.toString());

        setTimer(`${formatMinutes}:${formatseconds}`);

        if (--_timer < 0) {
          clearInterval(interval);
        }

        if (timer === `${TIME_COUNTDOWN / 60}:00` && isSendCodeAgain) {
          setIsSendCodeAgain(false)
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval)
    }
  }, [isSendCodeAgain, verificationState.phone])

  useEffect(() => {
    if (otpState?.length === CODE_LENGTH) {
      if (verificationState.email) {
        checkVerifyEmailCode({ code: otpState })
        return
      }
      if (verificationState.phone) {
        checkVerifyPhoneCode({
          cellphone: phoneState?.cellphone,
          country_phone_code: +(phoneState?.country_phone_code),
          code: otpState
        })
        return
      }
    }
  }, [otpState])

  useEffect(() => {
    if (verifyEmailState?.errorSendCode || verifyEmailState?.errorCheckCode) {
      showToast(
        ToastType.Error,
        verifyEmailState?.errorSendCode?.[0]
        ?? verifyEmailState?.errorCheckCode?.[0]
        ?? t('ERROR', 'Error'),
      );
      setTimeout(() => {
        cleanErrorsState();
        cleanErrorsState('phone');
        setOtpState('');
      }, 2000);
    }

    if (verifyPhoneState?.errorSendCode || verifyPhoneState?.errorCheckCode) {
      showToast(
        ToastType.Error,
        verifyPhoneState?.errorSendCode?.[0]
        ?? verifyPhoneState?.errorCheckCode?.[0]
        ?? t('ERROR', 'Error'),
      );
      setTimeout(() => {
        cleanErrorsState();
        cleanErrorsState('phone');
        setOtpState('');
      }, 2000);
    }
  }, [verifyEmailState, verifyPhoneState])

  useEffect(() => {
    if (!verifyEmailState?.loadingSendCode && isEmailVerifyRequired) {
      setVerificationState({
        ...verificationState,
        email: !!verifyEmailState?.resultSendCode
      })
    }
    if (!verifyPhoneState?.loadingSendCode && isPhoneVerifyRequired && !isEmailVerifyRequired) {
      setVerificationState({
        ...verificationState,
        phone: !!verifyPhoneState?.resultSendCode
      })
    }
  }, [verifyEmailState, verifyPhoneState])

  useEffect(() => {
    setupUserPhoneNumber()
  }, [user?.cellphone, user?.country_phone_code])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Container>
          <WrapperActions>
            <WrapperText>
              <OText size={22} weight='bold' style={{ marginBottom: 10 }}>
                {t('VERIFICATION_CODE', 'Verification Code')}
              </OText>
              {isEmailVerifyRequired && (
                <OText size={14} color={theme.colors.disabled} style={{ textAlign: 'center', paddingVertical: 20 }}>
                  {!verificationState.email ? (
                    t('VERIFICATION_EMAIL_CODE_MESSAGE', 'In order to continue using our platform please verify your email')
                  ) : (
                    t('VERIFICATION_EMAIL_CODE_SENT_MESSAGE', 'Please type the verification code sent to your email')
                  )}
                </OText>
              )}

              {isPhoneVerifyRequired && !isEmailVerifyRequired && (
                <OText size={14} color={theme.colors.disabled} style={{ textAlign: 'center', paddingVertical: 20 }}>
                  {!verificationState.phone ? (
                    t('VERIFICATION_PHONE_CODE_MESSAGE', 'In order to continue using our platform please verify your phone number')
                  ) : (
                    t('VERIFICATION_PHONE_CODE_SENT_MESSAGE', 'Please, enter the verification code we sent to your mobile ending with :number').replace(':number', lastNumbers)
                  )}
                </OText>
              )}
            </WrapperText>
            <View style={{ position: 'absolute', top: 0, right: 0 }}>
              <LogoutButton iconSize={20} />
            </View>
          </WrapperActions>

          {isEmailVerifyRequired && (
            !verificationState.email ? (
              <InputWrapper>
                <OInput
                  placeholder={user?.email}
                  style={style.inputStyle}
                  icon={theme.images.general.email}
                  isDisabled
                />
              </InputWrapper>
            ) : (
              <>
                <WrappCountdown>
                  <CountDownContainer color={timer === '00:00' ? theme.colors.error : theme.colors.success}>
                    <OText
                      size={26}
                      color={timer === '00:00' ? theme.colors.error : theme.colors.success}
                    >
                      {timer}
                    </OText>
                  </CountDownContainer>
                </WrappCountdown>

                <InputsSection>
                  <OtpSection>
                    <DigitInput
                      disabled={otpState.length === CODE_LENGTH}
                      onPress={handleOnPress}
                    >
                      {codeDigitsArray.map(toDigitInput)}
                    </DigitInput>
                    <TextInput
                      ref={ref}
                      value={otpState}
                      placeholder='0'
                      onChangeText={setOtpState}
                      onSubmitEditing={handleOnBlur}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      textContentType="oneTimeCode"
                      maxLength={CODE_LENGTH}
                      style={style.hiddenCodeInput}
                    />
                  </OtpSection>
                </InputsSection>

                <WrapperText>
                  <TouchableOpacity
                    onPress={() => handleSendOtp()}
                  >
                    <OText color={theme.colors.primary}>
                      {t('RESEND_AGAIN', 'Resend again?')}
                    </OText>
                  </TouchableOpacity>
                </WrapperText>
              </>
            )
          )}

          {isPhoneVerifyRequired && !isEmailVerifyRequired && (
            !verificationState.phone ? (
              phoneState?.formatted ? (
                <>
                  <InputWrapper phone>
                    <PhoneInputNumber
                      handleData={() => { }}
                      defaultValue={phoneState?.cellphone}
                      defaultCode={phoneState?.country_phone_code.replace('+', '')}
                      boxStyle={style.phoneSelect}
                      inputStyle={style.phoneInputStyle}
                      defaultCodeFallback={phoneState?.country_phone_code.replace('+', '')}
                      textStyle={{ color: theme.colors.textNormal, fontSize: 12, padding: 0 }}
                      noDropIcon
                      isDisabled
                      updateStateWithSubmit
                    />
                  </InputWrapper>
                </>
              ) : (
                <OText size={14} color={theme.colors.disabled} style={{ textAlign: 'center', paddingVertical: 20 }}>
                  {t('WARNING_PHONE_CODE_VALIDATION', 'Please update your phone number to continue')}
                </OText>
              )
            ) : (
              <>
                <WrappCountdown>
                  <CountDownContainer color={timer === '00:00' ? theme.colors.error : theme.colors.success}>
                    <OText
                      size={26}
                      color={timer === '00:00' ? theme.colors.error : theme.colors.success}
                    >
                      {timer}
                    </OText>
                  </CountDownContainer>
                </WrappCountdown>

                <InputsSection>
                  <OtpSection>
                    <DigitInput
                      disabled={otpState.length === CODE_LENGTH}
                      onPress={handleOnPress}
                    >
                      {codeDigitsArray.map(toDigitInput)}
                    </DigitInput>
                    <TextInput
                      ref={ref}
                      value={otpState}
                      placeholder='0'
                      onChangeText={setOtpState}
                      onSubmitEditing={handleOnBlur}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      textContentType="oneTimeCode"
                      maxLength={CODE_LENGTH}
                      style={style.hiddenCodeInput}
                    />
                  </OtpSection>
                </InputsSection>

                <WrapperText>
                  <TouchableOpacity
                    onPress={() => handleSendOtp('phone')}
                    disabled={verifyPhoneState?.loadingSendCode || verifyPhoneState?.loadingCheckCode}
                  >
                    <OText color={theme.colors.primary}>
                      {t('RESEND_AGAIN', 'Resend again?')}
                    </OText>
                  </TouchableOpacity>
                </WrapperText>
              </>
            )
          )}

        </Container>
        {!!phoneState?.cellphone && (
          <ButtonsActions>
            <View style={{ width: '100%' }}>
              <OButton
                onClick={(verificationState.email || verificationState.phone)
                  ? () => setVerificationState({ email: false, phone: false })
                  : () => handleSendOtp(isPhoneVerifyRequired && !isEmailVerifyRequired ? 'phone' : '')
                }
                text={(verificationState.email || verificationState.phone) ? t('CANCEL', 'Cancel') : t('SEND_CODE', 'Send code')}
                bgColor={(verificationState.email || verificationState.phone) ? theme.colors.secundary : theme.colors.primary}
                borderColor={(verificationState.email || verificationState.phone) ? theme.colors.secundary : theme.colors.primary}
                textStyle={{ color: (verificationState.email || verificationState.phone) ? 'black' : 'white' }}
                imgRightSrc={null}
                isLoading={verifyEmailState?.loadingSendCode || verifyEmailState?.loadingCheckCode || verifyPhoneState?.loadingSendCode || verifyPhoneState?.loadingCheckCode}
                style={(verificationState.email || verificationState.phone) ? style.btnStyle : { borderRadius: 7.6 }}
              />
            </View>
          </ButtonsActions>
        )}
        <View style={{ paddingHorizontal: 20, paddingBottom: 80 }}>
          <UserDetails
            user={user}
            isEdit
            isVerifiedPhone
            dontToggleEditMode
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export const UserVerification = (props: any) => {
  const verifyProps = {
    ...props,
    UIComponent: UserVerificationUI
  }
  return (
    <UserVerificationController {...verifyProps} />
  )
}
