import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'styled-components/native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  VerifyEmail as VerifyEmailController,
  useToast,
  useSession,
  useLanguage,
  ToastType
} from 'ordering-components/native';

import { OText, OInput, OButton } from '../shared';
import { LogoutButton } from '../LogoutButton'

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

const TIME_COUNTDOWN = 60 * 10 // 10 minutes
const CODE_LENGTH = 6;

const VerifyEmailUI = (props: any) => {
  const {
    verifyEmailState,
    cleanErrorsState,
    sendVerifyEmailCode,
    checkVerifyEmailCode,
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const [, { showToast }] = useToast();

  const ref = useRef<TextInput>(null);

  const [otpState, setOtpState] = useState('')
  const [emailVerification, setEmailVerification] = useState(false)

  const [timer, setTimer] = useState(`${TIME_COUNTDOWN / 60}:00`)
  const [isSendCodeAgain, setIsSendCodeAgain] = useState(false)
  const [containerIsFocused, setContainerIsFocused] = useState(false);

  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);

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
        ? {...style.inputContainer, ...style.inputContainerFocused}
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

  const handleSendOtp = () => {
    setTimer(`${TIME_COUNTDOWN / 60}:00`)
    setIsSendCodeAgain(true)
    sendVerifyEmailCode({ email: user?.email })
  }

  useEffect(() => {
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
  }, [isSendCodeAgain])

  useEffect(() => {
    if (otpState?.length === CODE_LENGTH) {
      if (emailVerification) {
        checkVerifyEmailCode({ code: otpState })
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
        setOtpState('');
      }, 2000);
    }
  }, [verifyEmailState])

  useEffect(() => {
    if (!verifyEmailState?.loadingSendCode) {
      setEmailVerification(!!verifyEmailState?.resultSendCode)
    }
  }, [verifyEmailState])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <WrapperActions>
          <WrapperText>
            <OText size={22} weight='bold' style={{ marginBottom: 10 }}>
              {t('VERIFICATION_CODE', 'Verification Code')}
            </OText>
            <OText size={14} color={theme.colors.disabled} style={{ textAlign: 'center', paddingVertical: 20 }}>
              {!emailVerification ? (
                t('VERIFICATION_CODE_MESSAGE', 'In order to continue using our platform please verify your email')
              ) : (
                t('VERIFICATION_CODE_SENT_MESSAGE', 'Please type the verification code sent to your email')
              )}
            </OText>
          </WrapperText>
          <View style={{ position: 'absolute', top: 0, right: 0 }}>
            <LogoutButton iconSize={20} />
          </View>
        </WrapperActions>

        {!emailVerification ? (
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
              <CountDownContainer color={timer === '00:00' ? theme.colors.error: theme.colors.success}>
                <OText
                  size={26}
                  color={timer === '00:00' ? theme.colors.error: theme.colors.success}
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
                onPress={handleSendOtp}
              >
                <OText color={theme.colors.primary}>
                  {t('RESEND_AGAIN', 'Resend again?')}
                </OText>
              </TouchableOpacity>
            </WrapperText>
          </>
        )}
      </Container>
      <ButtonsActions>
        <View style={{ width: '100%' }}>
          <OButton
            onClick={emailVerification ? () => setEmailVerification(false) : handleSendOtp}
            text={emailVerification ? t('CANCEL', 'Cancel') : t('SEND_CODE', 'Send code')}
            bgColor={emailVerification ? theme.colors.secundary : theme.colors.primary}
            borderColor={emailVerification ? theme.colors.secundary : theme.colors.primary}
            textStyle={{ color: emailVerification ? 'black' : 'white' }}
            imgRightSrc={null}
            isLoading={verifyEmailState?.loadingSendCode || verifyEmailState?.loadingCheckCode}
            style={emailVerification ? style.btnStyle : { borderRadius: 7.6 }}
          />
        </View>
      </ButtonsActions>
    </SafeAreaView>
  )
}

export const VerifyEmail = (props: any) => {
  const verifyProps = {
    ...props,
    UIComponent: VerifyEmailUI
  }
  return (
    <VerifyEmailController {...verifyProps} />
  )
}
