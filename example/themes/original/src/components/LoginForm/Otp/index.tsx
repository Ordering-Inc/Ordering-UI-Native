import React, { useEffect, useRef, useState } from 'react'
import { formatSeconds } from '../../../utils'
import { StyleSheet, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useCountdownTimer } from '../../../../../../src/hooks/useCountdownTimer';
import { useLanguage } from 'ordering-components/native';
import { OTPContainer } from './styles';
import { OText, OButton, OIcon } from '../../shared';
import OtpInputs from 'react-native-otp-inputs';
import { useTheme } from 'styled-components/native';
import { otpParams } from '../../../types'

export const Otp = (props: otpParams) => {
  const {
    willVerifyOtpState,
    setWillVerifyOtpState,
    onSubmit,
    handleLoginOtp,
    setAlertState,
    pinCount,
    otpError,
    setOtpError
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [otpLeftTime, _, resetOtpLeftTime]: any = useCountdownTimer(
    600, willVerifyOtpState)

  const [code, setCode] = useState('')
  const inputRef = useRef<any>()

  const handleOnSubmit = () => {
    setAlertState({
      open: true,
      title: t('CODE_SENT', 'The code has been sent'),
    })
    resetOtpLeftTime()
    onSubmit()
  }

  const handleChangeCode = (code : string) => {
    setCode(code)
    setOtpError(null)
  }

  const handleCloseOtp = () => {
    setWillVerifyOtpState(false)
    setOtpError(null)
  }

  useEffect(() => {
    if (otpLeftTime === 0) {
      setAlertState({
        open: true,
        title: t('TIME_IS_UP', 'Time is up'),
        content: t('PLEASE_RESEND_CODE', 'Please resend code again')
      })
    }
  }, [otpLeftTime])

  useEffect(() => {
    if (code?.length === (pinCount || 6)) {
      handleLoginOtp(code)
      inputRef?.current?.reset()
    }
  }, [code])

  const loginStyle = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 30
    },
    underlineStyleBase: {
      width: 45,
      height: 50,
      borderWidth: 1,
      fontSize: 16,
      borderRadius: 8,
      borderColor: theme.colors.lightGray,
      textAlign: 'center'
    },
    underlineStyleHighLighted: {
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      fontSize: 16
    },
    wrapperIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: 20
    },
    closeContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center'
    }
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundPage }}>
      <OTPContainer>
        <View
          style={loginStyle.closeContainer}>
          <TouchableOpacity onPress={() => handleCloseOtp()} style={loginStyle.wrapperIcon}>
            <OIcon
              src={theme.images.general.close}
              width={22}
            />
          </TouchableOpacity>
          <OText size={22}>
            {t('ENTER_VERIFICATION_CODE', 'Enter verification code')}
          </OText>
        </View>
        <OText size={24}>
          {formatSeconds(otpLeftTime)}
        </OText>
        <OtpInputs
          ref={inputRef}
          autofillFromClipboard
          numberOfInputs={pinCount || 6}
          style={loginStyle.container}
          inputStyles={loginStyle.underlineStyleBase}
          handleChange={handleChangeCode}
        />
        {!!otpError && (
          <OText
            color={theme?.colors?.error}
            size={20}
            mBottom={10}
          >
            {t(otpError, otpError)}
          </OText>
        )}
        <TouchableOpacity onPress={() => handleOnSubmit()} disabled={otpLeftTime > 520}>
          <OText size={16} mBottom={30} color={otpLeftTime > 520 ? theme.colors.disabled : theme.colors.primary}>
            {t('RESEND_CODE', 'Resend code')}
          </OText>
        </TouchableOpacity>
        <OButton
          onClick={() => handleCloseOtp()}
          bgColor={theme.colors.white}
          borderColor={theme.colors.primary}
          textStyle={{ color: theme.colors.primary }}
          style={{ borderRadius: 8, width: '100%' }}
          text={t('CANCEL', 'Cancel')}
        />
      </OTPContainer>
    </SafeAreaView>
  )
}
