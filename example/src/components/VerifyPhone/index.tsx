import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { getTraduction } from '../../utils'

import { OText } from '../shared';
import { colors } from '../../theme.json'

import {
  Container,
  CountDownContainer,
  ResendSection,
  WrappCountdown,
  InputsSection,
  ErrorSection
} from './styles'

const TIME_COUNTDOWN = 60 * 10 // 10 minutes

export const VerifyPhone = (props: any) => {
  const {
    phone,
    formValues,
    verifyPhoneState,
    checkPhoneCodeState,
    setCheckPhoneCodeState,
    handleCheckPhoneCode,
    handleVerifyCodeClick
  } = props
  const [, t] = useLanguage()

  const [timer, setTimer] = useState(`${TIME_COUNTDOWN / 60}:00`)
  const [verifyCode, setVerifyCode] = useState({ 0: '', 1: '', 2: '', 3: '' })
  const [isSendCodeAgain, setIsSendCodeAgain] = useState(false)

  const lastNumbers = phone?.cellphone &&
    `${phone?.cellphone.charAt(phone?.cellphone.length-2)}${phone?.cellphone.charAt(phone?.cellphone.length-1)}`

  const handleChangeCode = (val: number, i: number) => {
    setVerifyCode({ ...verifyCode, [i]: val })
  }

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
    const codes = Object.keys(verifyCode).length
    const isFullInputs = codes && Object.values(verifyCode).every(val => val)
    if (codes === 4 && isFullInputs) {
      const values = {
        ...formValues,
        cellphone: phone.cellphone,
        country_phone_code: `+${phone.country_phone_code}`,
        code: Object.values(verifyCode).join().replace(/,/g, '')
      }
      handleCheckPhoneCode && handleCheckPhoneCode(values)
    }
  }, [verifyCode])

  return (
    <Container>
      <OText size={30} style={{ textAlign: 'left' }}>
        {t('VERIFY_PHONE', 'Verify Phone')}
      </OText>
      {lastNumbers && (
        <OText size={20} color={colors.disabled}>
          {`${t('MESSAGE_ENTER_VERIFY_CODE', 'Please, enter the verification code we sent to your mobile ending with')} **${lastNumbers}`}
        </OText>
      )}
      <WrappCountdown>
        <CountDownContainer color={timer === '00:00' ? colors.error: colors.success}>
          <OText
            size={30}
            color={timer === '00:00' ? colors.error: colors.success}
          >
            {timer}
          </OText>
        </CountDownContainer>
      </WrappCountdown>
      <InputsSection>
        {[...Array(4),].map((_: any, i: number) => (
          <TextInput
            key={i}
            keyboardType='number-pad'
            placeholder={'0'}
            style={styles.inputStyle}
            onChangeText={(val: any) => handleChangeCode(val, i)}
            maxLength={1}
            editable={timer !== '00:00'}
          />
        ))}
      </InputsSection>
      {(verifyPhoneState?.result?.error ? verifyPhoneState : checkPhoneCodeState) &&
        !(verifyPhoneState?.result?.error ? verifyPhoneState : checkPhoneCodeState)?.loading &&
        (verifyPhoneState?.result?.error ? verifyPhoneState : checkPhoneCodeState)?.result?.error &&
        (verifyPhoneState?.result?.error ? verifyPhoneState : checkPhoneCodeState).result?.result &&
      (
        <ErrorSection>
          {checkResult((
            verifyPhoneState?.result?.error ? verifyPhoneState : checkPhoneCodeState
          ).result?.result)?.map((e: any, i: number) => (
            <OText
              key={i}
              size={20}
              color={colors.error}
            >
              {`* ${t(getTraduction(e))}`}
            </OText>
          ))}
        </ErrorSection>
      )}
      <ResendSection>
        <OText size={17} style={{ marginRight: 5 }}>
          {t('ARE_YOU_NOT_SEEING_THE_CODE', 'Are you not seeing the code?')}
        </OText>
        <Pressable onPress={() => handleSendCodeAgain()}>
          <OText size={17} color={colors.primary}>
            {t('SEND_AGAIN', 'Send Again')}
          </OText>
        </Pressable>
      </ResendSection>
      <Spinner visible={checkPhoneCodeState.loading} />
    </Container>
  )
}

const styles = StyleSheet.create({
  inputStyle: {
    width: 80,
    height: 80,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.disabled,
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 40
  }
});
