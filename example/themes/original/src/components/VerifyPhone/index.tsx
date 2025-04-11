import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
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

	const theme = useTheme();

	const styles = StyleSheet.create({
		inputStyle: {
			width: 75,
			height: 75,
			marginBottom: 25,
			borderWidth: 1,
			borderColor: theme.colors.inputBorderColor,
			borderRadius: 8,
			textAlign: 'center',
			fontSize: 40
		}
	});


	const [, t] = useLanguage()

	const [timer, setTimer] = useState(`${TIME_COUNTDOWN / 60}:00`)
	const [verifyCode, setVerifyCode] = useState({ 0: '', 1: '', 2: '', 3: '' })
	const [isSendCodeAgain, setIsSendCodeAgain] = useState(false)
	const inputRefs: any = [
		React.createRef(),
		React.createRef(),
		React.createRef(),
		React.createRef()
	]

	const lastNumbers = phone?.cellphone &&
		`${phone?.cellphone.charAt(phone?.cellphone.length - 2)}${phone?.cellphone.charAt(phone?.cellphone.length - 1)}`

	const goNextAfterEdit = (val: number, i: number) => {
		setVerifyCode({ ...verifyCode, [i]: val })
		if(val && i < inputRefs.length - 1) {
			inputRefs[i+1].focus()
		}
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
			<OText size={26} style={{ textAlign: 'left', fontWeight: '600', marginTop: 10, marginBottom: 30 }}>
				{t('ENTER_VERIFICATION_CODE', 'Enter verification code')}
			</OText>
			{lastNumbers && (
				<OText size={16} color={theme.colors.disabled}>
					{`${t('MESSAGE_ENTER_VERIFY_CODE', 'Please, enter the verification code we sent to your mobile ending with')} **${lastNumbers}`}
				</OText>
			)}
			<WrappCountdown>
				<CountDownContainer color={timer === '00:00' ? theme.colors.error : theme.colors.success}>
					<OText
						size={30}
						color={timer === '00:00' ? theme.colors.error : theme.colors.success}
					>
						{timer}
					</OText>
				</CountDownContainer>
			</WrappCountdown>
			<InputsSection>
				{inputRefs.map((k: any, idx: number) => (
					<TextInput
						key={idx}
						keyboardType='number-pad'
						ref={r => inputRefs[idx] =  r}
						maxLength={1}
						style={styles.inputStyle}
						placeholder={'0'}
						onChangeText={(val: any) => goNextAfterEdit(val, idx)}
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
								size={16}
								color={theme.colors.error}
							>
								{`* ${t(getTraduction(e, t))}`}
							</OText>
						))}
					</ErrorSection>
				)}
			<ResendSection>
				<Pressable onPress={() => handleSendCodeAgain()}>
					<OText size={16} color={theme.colors.primary}>
						{t('RESEND_CODE', 'Resend code')}
					</OText>
				</Pressable>
			</ResendSection>
			<Spinner visible={checkPhoneCodeState.loading} />
		</Container>
	)
}
