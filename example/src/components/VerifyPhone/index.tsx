import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import Spinner from 'react-native-loading-spinner-overlay';

import { OText } from '../shared';
import { colors } from '../../theme'
import { ToastType, useToast } from '../../providers/ToastProvider';

import {
  Container,
  CountDownContainer,
  ResendSection,
  WrappCountdown,
  InputsSection
} from './styles'

const TIME_COUNTDOWN = 60 * 0.25 // 10 minutes

export const VerifyPhone = (props: any) => {
  const {
    phone,
    checkPhoneCodeState,
    handleCheckPhoneCode,
    handleVerifyCodeClick
  } = props
  const [, t] = useLanguage()
  const { showToast } = useToast();

  const [timer, setTimer] = useState(`${TIME_COUNTDOWN / 60}:00`)
  const [verifyCode, setVerifyCode] = useState({ 0: '', 1: '', 2: '', 3: '' })

  const lastNumbers = phone?.cellphone &&
    `${phone?.cellphone.charAt(phone?.cellphone.length-2)}${phone?.cellphone.charAt(phone?.cellphone.length-1)}`

  const handleChangeCode = (val: number, i: number) => {
    setVerifyCode({ ...verifyCode, [i]: val })
  }

  useEffect(() => {
    let timer = TIME_COUNTDOWN - 1;
    let minutes = 0;
    let seconds = 0;
    const interval = setInterval(() => {
      minutes = timer / 60;
      seconds = timer % 60;

      minutes = minutes < 10 ? 0 + minutes : minutes;
      seconds = seconds < 10 ? 0 + seconds : seconds;

      const formatMinutes = parseInt(minutes.toString()) < 10
        ? `0${parseInt(minutes.toString())}`
        : parseInt(minutes.toString())

      const formatseconds = parseInt(seconds.toString()) < 10
        ? `0${parseInt(seconds.toString())}`
        : parseInt(seconds.toString())

      setTimer(`${formatMinutes}:${formatseconds}`)

      if (--timer < 0) {
        clearInterval(interval)
      }
    }, 1000);

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const codes = Object.keys(verifyCode).length
    const isFullInputs = codes && Object.values(verifyCode).every(val => val)
    if (codes === 4 && isFullInputs) {
      const values = {
        cellphone: phone.cellphone,
        country_phone_code: `+${phone.country_phone_code}`,
        code: Object.values(verifyCode).join().replace(/,/g, '')
      }
      handleCheckPhoneCode && handleCheckPhoneCode(values)
    }
  }, [verifyCode])

  useEffect(() => {
    if (checkPhoneCodeState && !checkPhoneCodeState?.loading) {
      if (checkPhoneCodeState.result?.error) {
        const message = typeof checkPhoneCodeState?.result?.result === 'string'
          ? checkPhoneCodeState?.result?.result
          : checkPhoneCodeState?.result?.result[0]
        checkPhoneCodeState.result?.result && showToast(
          ToastType.Error,
          message
        )
        return
      }
    }
  }, [checkPhoneCodeState])

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
      <ResendSection>
        <OText size={17} style={{ marginRight: 5 }}>
          {t('ARE_YOU_NOT_SEEING_THE_CODE', 'Are you not seeing the code?')}
        </OText>
        <Pressable onPress={() => handleVerifyCodeClick()}>
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
