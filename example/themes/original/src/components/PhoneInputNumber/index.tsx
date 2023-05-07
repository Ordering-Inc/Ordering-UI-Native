import React, { useEffect, useRef, useState } from 'react';
import PhoneInput from "react-native-phone-number-input";
import { StyleSheet, View } from 'react-native';
import { useLanguage, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Wrapper } from './styles'

import { PhoneInputParams } from '../../types';
import { OIcon, OText } from '../shared';
import { findExitingCode, transformCountryCode } from '../../utils'

export const PhoneInputNumber = (props: PhoneInputParams) => {
	const {
		data,
		handleData,
		defaultValue,
		defaultCode,
		forwardRef,
		textInputProps,
		boxStyle,
		inputStyle,
		textStyle,
		flagStyle,
		noDropIcon,
		isDisabled,
		isStartValidation,
		changeCountry,
		updateStateWithSubmit
	} = props

	const theme = useTheme();

	const [, t] = useLanguage()
	const [{ configs }] = useConfig()
	const phoneInput = useRef<PhoneInput>(null);
	const [userphoneNumber, setUserphoneNumber] = useState('');

	const style = StyleSheet.create({
		input: {
			backgroundColor: theme.colors.white,
			borderRadius: 7.6,
			borderWidth: 1,
			borderColor: (isStartValidation && userphoneNumber === '') ? theme.colors.danger5 : theme.colors.border,
			paddingBottom: 0,
			paddingTop: 0,
			flexGrow: 1,
			flex: 1,
			height: 50,
		},
		countryBtn: {
			borderWidth: 1,
			borderColor: theme.colors.border,
			borderRadius: 7.6,
			marginEnd: 9,
		}
	})

	const handleChangeNumber = (number: any) => {
		setUserphoneNumber(number)
	}

	useEffect(() => {
		if ((defaultValue && userphoneNumber) || !defaultValue) {
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

	useEffect(() => {
		if (defaultValue && updateStateWithSubmit) {
			phoneInput.current?.setState({
				number: defaultValue,
				countryCode: defaultCode ?
					!isNaN(defaultCode)
						? transformCountryCode(defaultCode)
						: findExitingCode(defaultCode)
					: findExitingCode(configs?.default_country_code?.value?.toUpperCase())
			})
		}
	}, [defaultValue])

	return (
		<Wrapper onPress={() => forwardRef?.current?.focus?.()}>
			{(isStartValidation && userphoneNumber === '') && (
				<OText
					size={14}
					color={theme.colors.danger5}
				>
					{t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required').replace('_attribute_', t('CELLPHONE', 'Cellphone'))}*
				</OText>
			)}
			<PhoneInput
				ref={phoneInput}
				disabled={isDisabled}
				defaultValue={userphoneNumber || defaultValue}
				defaultCode={defaultCode ?
					!isNaN(defaultCode)
						? transformCountryCode(defaultCode)
						: findExitingCode(defaultCode)
					: findExitingCode(configs?.default_country_code?.value?.toUpperCase())}
				onChangeFormattedText={(text: string) => handleChangeNumber(text)}
				withDarkTheme
				onChangeCountry={(country) => changeCountry?.(country)}
				countryPickerProps={{ withAlphaFilter: true }}
				textContainerStyle={{ ...style.input, ...inputStyle ? inputStyle : {} }}
				textInputStyle={textStyle}
				codeTextStyle={textStyle}
				flagButtonStyle={flagStyle}
				countryPickerButtonStyle={{ ...style.countryBtn, ...boxStyle ? boxStyle : {} }}
				placeholder={t('PHONE_NUMBER', 'Phone Number')}
				textInputProps={{ keyboardType: 'number-pad', autoCompleteType: 'tel', textContentType: 'telephoneNumber', dataDetectorTypes: 'phoneNumber', ref: forwardRef, ...textInputProps }}
				containerStyle={{ width: '100%' }}
				renderDropdownImage={noDropIcon ? <View /> : <OIcon src={theme.images.general.arrow_down} width={13} color={'#B1BCCC'}></OIcon>}
			/>
			{!!data?.error && (
				<OText
					size={16}
					color={theme.colors.error}
					style={{ textAlign: 'center', marginTop: 5 }}
				>
					{data.error}
				</OText>
			)}
		</Wrapper>
	)
}
