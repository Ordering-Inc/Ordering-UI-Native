import React, { useEffect } from 'react'
import { formatSeconds } from '../../../utils'
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCountdownTimer } from '../../../../../../src/hooks/useCountdownTimer';
import { useLanguage } from 'ordering-components/native';
import { OTPContainer } from './styles';
import { OText, OButton } from '../../shared';
import OTPInputView from '@twotalltotems/react-native-otp-input'
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
        formState
    } = props

    const theme = useTheme();
    const [, t] = useLanguage();
    const [otpLeftTime, _, resetOtpLeftTime]: any = useCountdownTimer(
        600, willVerifyOtpState)


    const handleOnSubmit = () => {
        setAlertState({
            open: true,
            title: t('CODE_SENT', 'The code has been sent'),
        })
        resetOtpLeftTime()
        onSubmit()
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
        if (!formState?.loading && formState?.result?.error) {
            Alert.alert(
                t('ERROR', 'Error'),
                typeof formState.result?.result === 'string'
                  ? formState.result?.result
                  : formState.result?.result[0],
                [
                    {
                        text: t('ACCEPT', 'Accept'),
                        onPress: () => {},
                        style: 'cancel'
                    },
                ],
                { cancelable: false }
            )
        }
    }, [formState])

    const loginStyle = StyleSheet.create({
        underlineStyleBase: {
            width: 45,
            height: 60,
            borderWidth: 1,
            fontSize: 16
        },
        underlineStyleHighLighted: {
            borderColor: theme.colors.primary,
            color: theme.colors.primary,
            fontSize: 16
        },
    });

    return (
        <>
            <OTPContainer>
                <OText size={24}>
                    {formatSeconds(otpLeftTime)}
                </OText>
                <OTPInputView
                    style={{ width: '100%', height: 150 }}
                    pinCount={pinCount || 6}
                    codeInputFieldStyle={loginStyle.underlineStyleBase}
                    codeInputHighlightStyle={loginStyle.underlineStyleHighLighted}
                    onCodeFilled={(code: string) => handleLoginOtp(code)}
                    selectionColor={theme.colors.primary}
                    editable
                />
                <TouchableOpacity onPress={() => handleOnSubmit()} disabled={otpLeftTime > 520}>
                    <OText size={16} mBottom={30} color={otpLeftTime > 520 ? theme.colors.disabled : theme.colors.primary}>
                        {t('RESEND_CODE', 'Resend code')}
                    </OText>
                </TouchableOpacity>
                <OButton
                    onClick={() => setWillVerifyOtpState(false)}
                    bgColor={theme.colors.white}
                    borderColor={theme.colors.primary}
                    textStyle={{ color: theme.colors.primary }}
                    style={{ borderRadius: 8, width: '100%' }}
                    text={t('CANCEL', 'Cancel')}
                />
            </OTPContainer>
        </>
    )
}
