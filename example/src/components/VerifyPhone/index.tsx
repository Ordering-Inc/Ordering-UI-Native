import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from 'react-native';
import { useLanguage } from 'ordering-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { getTraduction } from '../../utils'

import { OText } from '../shared';

import {
  Container,
  CountDownContainer,
  ResendSection,
  WrappCountdown,
  InputsSection,
  ErrorSection
} from './styles'
import { useTheme } from 'styled-components/native';

const TIME_COUNTDOWN = 60 * 10 // 10 minutes
const CODE_LENGTH = 4;

export const VerifyPhone = (props: any) => {
  const {
    phone,
    formValues,
    verifyPhoneState,
    checkPhoneCodeState,
    setCheckPhoneCodeState,
    handleCheckPhoneCode,
    handleVerifyCodeClick,
    onClose
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()
  const ref = useRef<TextInput>(null);

  const style = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputsContainer: {
      width: '80%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputContainer: {
      borderWidth: 2,
      borderRadius: 20,
      padding: 20,
      borderColor: theme.colors.disabled,
    },
    inputContainerFocused: {
      borderColor: theme.colors.primary,
    },
    inputText: {
      fontSize: 24,
    },
    hiddenCodeInput: {
      position: 'absolute',
      height: 0,
      width: 0,
      opacity: 0,
    },
  });

  const [timer, setTimer] = useState(`${TIME_COUNTDOWN / 60}:00`)
  const [isSendCodeAgain, setIsSendCodeAgain] = useState(false)
  const [code, setCode] = useState('');
  const [containerIsFocused, setContainerIsFocused] = useState(false);

  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);
  const phoneLength = phone?.cellphone.split('').length
  const lastNumbers = phone?.cellphone && phone?.cellphone.split('').fill('*', 0, phoneLength - 2).join('')

  const handleOnPress = () => {
    setContainerIsFocused(true);
    ref?.current?.focus();
  };

  const handleOnBlur = () => {
    setContainerIsFocused(false);
  };

  const toDigitInput = (_value: number, idx: number) => {
    const emptyInputChar = '0';
    const digit = code[idx] || emptyInputChar;

    const isCurrentDigit = idx === code.length;
    const isLastDigit = idx === CODE_LENGTH - 1;
    const isCodeFull = code.length === CODE_LENGTH;

    const isFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    const containerStyle =
      containerIsFocused && isFocused
        ? {...style.inputContainer, ...style.inputContainerFocused}
        : style.inputContainer;

    return (
      <View key={idx} style={containerStyle}>
        <Text
          style={{
            ...style.inputText,
            color: code[idx] ? theme.colors.black : theme.colors.disabled
          }}
        >
          {digit}
        </Text>
      </View>
    );
  };

  const checkResult = (result: any) => {
    if (!result) return
    return typeof result === 'string'
      ? [result]
      : result
  }

  const handleSendCodeAgain = () => {
    setCheckPhoneCodeState && setCheckPhoneCodeState()
    setTimer(`${TIME_COUNTDOWN / 60}:00`)
    setIsSendCodeAgain(true)
    handleVerifyCodeClick && handleVerifyCodeClick()
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
    if (code.length === CODE_LENGTH) {
      const values = {
        ...formValues,
        cellphone: phone.cellphone,
        country_phone_code: `+${phone.country_phone_code}`,
        code
      }
      handleCheckPhoneCode && handleCheckPhoneCode(values)
    }
  }, [code]);

  useEffect(() => {
    if (verifyPhoneState?.result?.error) {
      onClose && onClose()
    }
  }, [verifyPhoneState]);

  return (
    <Container>
      {lastNumbers && (
        <OText size={18} color={theme.colors.disabled}>
          {`${t('MESSAGE_ENTER_VERIFY_CODE', 'Please, enter the verification code we sent to your mobile ending with')} ${lastNumbers}`}
        </OText>
      )}
      <WrappCountdown>
        <CountDownContainer color={timer === '00:00' ? theme.colors.error: theme.colors.success}>
          <OText
            size={28}
            color={timer === '00:00' ? theme.colors.error: theme.colors.success}
          >
            {timer}
          </OText>
        </CountDownContainer>
      </WrappCountdown>
      <InputsSection>
        <SafeAreaView style={style.container}>
          <Pressable style={style.inputsContainer} onPress={handleOnPress} disabled={code.length === CODE_LENGTH}>
            {codeDigitsArray.map(toDigitInput)}
          </Pressable>
          <TextInput
            ref={ref}
            value={code}
            placeholder='0'
            onChangeText={setCode}
            onSubmitEditing={handleOnBlur}
            keyboardType="number-pad"
            returnKeyType="done"
            textContentType="oneTimeCode"
            maxLength={CODE_LENGTH}
            style={style.hiddenCodeInput}
          />
        </SafeAreaView>
      </InputsSection>
      {checkPhoneCodeState &&
        !checkPhoneCodeState?.loading &&
        checkPhoneCodeState?.result?.error &&
        checkPhoneCodeState?.result?.result &&
      (
        <ErrorSection>
          {checkResult((checkPhoneCodeState).result?.result)?.map((e: any, i: number) => (
            <OText
              key={i}
              size={16}
              color={theme.colors.error}
            >
              {`* ${getTraduction(e, t)}`}
            </OText>
          ))}
        </ErrorSection>
      )}
      <ResendSection>
        <OText size={17} style={{ marginRight: 5 }}>
          {t('ARE_YOU_NOT_SEEING_THE_CODE', 'Are you not seeing the code?')}
        </OText>
        <Pressable onPress={() => handleSendCodeAgain()}>
          <OText size={17} color={theme.colors.primary}>
            {t('SEND_AGAIN', 'Send Again')}
          </OText>
        </Pressable>
      </ResendSection>
      <Spinner visible={checkPhoneCodeState.loading} />
    </Container>
  )
}
