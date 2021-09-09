import React, { useEffect, useRef, useState } from 'react';
import PhoneInput from "react-native-phone-number-input";
import { StyleSheet } from 'react-native';
import { useLanguage, useConfig } from 'ordering-components/native';

import { Wrapper } from './styles';
import { useTheme } from 'styled-components/native';
import { PhoneInputParams } from '../../types';
import { OText } from '../shared';
import { transformCountryCode } from '../../utils'
import { I18nManager } from 'react-native'

export const PhoneInputNumber = (props: PhoneInputParams) => {
	const {
		data,
		handleData,
		defaultValue,
		defaultCode,
		forwardRef,
		textInputProps,
		countryButtonStyle,
		textWrapStyle,
		renderDropImage
	} = props
	const theme = useTheme();

	const style = StyleSheet.create({
		input: {
			backgroundColor: theme.colors.white,
			borderRadius: 25,
			borderWidth: 1,
			borderColor: theme.colors.disabled,
			paddingVertical: 0,
			flexGrow: 1,
			flex: 1,
			height: 50,
		}
	})

	const [, t] = useLanguage()
	const [{ configs }] = useConfig()
	const phoneInput = useRef<PhoneInput>(null);
	const [userphoneNumber, setUserphoneNumber] = useState('');

	const handleChangeNumber = (number: any) => {
		setUserphoneNumber(number)
	}

	useEffect(() => {
		if ((defaultValue && userphoneNumber) || defaultValue === undefined || defaultValue === '') {
			if (userphoneNumber) {
				const checkValid = phoneInput.current?.isValidNumber(userphoneNumber);
				const callingCode = phoneInput.current?.getCallingCode();
				const formattedNumber = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
				const regex = /^[0-9]*$/
				const cellphone = userphoneNumber.slice(0, 0) + userphoneNumber.slice(1, userphoneNumber.length)
				const validNumber = regex.test(cellphone)
				if ((!checkValid && formattedNumber?.number) || !validNumber) {
					handleData && handleData({
						...data,
						error: t('INVALID_ERROR_PHONE_NUMBER', 'The Phone Number field is invalid')
					})
					return
				}
				handleData && handleData({
					...data,
					error: '',
					phone: {
						country_phone_code: callingCode,
						cellphone: formattedNumber?.number
					}
				})
			} else {
				handleData && handleData({
					...data,
					error: '',
					phone: {
						country_phone_code: null,
						cellphone: null
					}
				})
			}
		}
	}, [userphoneNumber])

	return (
		<Wrapper>
			<PhoneInput
				ref={phoneInput}
				defaultValue={userphoneNumber || defaultValue}
				defaultCode={defaultCode ? transformCountryCode(defaultCode) : configs?.default_country_code?.value}
				onChangeFormattedText={(text: string) => handleChangeNumber(text)}
				withDarkTheme
				textInputStyle={{ textAlign: I18nManager.isRTL ? 'right' : 'left' }}
				countryPickerProps={{ withAlphaFilter: true }}
				textContainerStyle={[style.input, textWrapStyle]}
				placeholder={t('PHONE_NUMBER', 'Phone Number')}
				textInputProps={{ autoCompleteType: 'tel', ref: forwardRef, ...textInputProps }}
				countryPickerButtonStyle={countryButtonStyle}
				codeTextStyle={textInputProps?.style}
				renderDropdownImage={renderDropImage}
			/>
			{!!data?.error && (
				<OText
					size={10}
					color={theme.colors.error}
				>
					{data.error}
				</OText>
			)}
		</Wrapper>
	)
}
