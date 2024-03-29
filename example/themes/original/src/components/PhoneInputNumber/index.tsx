import React, { useEffect, useRef, useState } from 'react';
import PhoneInput from "react-native-phone-number-input";
import { Pressable, StyleSheet, View } from 'react-native';
import { useLanguage, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Wrapper } from './styles'

import { PhoneInputParams } from '../../types';
import { OIcon, OText } from '../shared';
import { OModal } from '../../../../../src/components/shared'
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
		updateStateWithSubmit,
		defaultCodeFallback
	} = props

	const theme = useTheme();

	const [, t] = useLanguage()
	const [{ configs }] = useConfig()
	const phoneInput = useRef<PhoneInput>(null);
	const [userphoneNumber, setUserphoneNumber] = useState('');
	const [countryPhoneSuboptions, setCountryPhoneSuboptions] = useState({
		open: false,
		options: []
	})
	const isDisableNumberValidation = parseInt(configs?.validation_phone_number_lib?.value ?? 1, 10)
	const countriesWithSubOptions = ['PR']
	const codesStartsWithZero: any = ['44']

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
				const validationsForUK = ['01', '02', '07', '0800', '0808', '0845', '0870', '0871']

				let isPossibly = false
				let numberWithoutCountryCode = ''
				const callingCode = phoneInput.current?.getCallingCode();
				const cellphone = userphoneNumber.slice(0, 0) + userphoneNumber.slice(1, userphoneNumber.length)
				if (codesStartsWithZero.includes(callingCode)) {
					numberWithoutCountryCode = cellphone.replace(callingCode || '', '')
					const result = validationsForUK.some(areaCode => numberWithoutCountryCode?.startsWith(areaCode))
					isPossibly = result && numberWithoutCountryCode?.length >= 10 && numberWithoutCountryCode?.length < 12
				}
				const checkValid = phoneInput.current?.isValidNumber(userphoneNumber);
				const formattedNumber = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
				const regex = /^[0-9]*$/
				const validNumber = regex.test(cellphone)
				if (((!checkValid && formattedNumber?.number && !isPossibly) || !validNumber) && !!isDisableNumberValidation) {
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
						cellphone: !isDisableNumberValidation ? cellphone.slice(callingCode?.length) : formattedNumber?.number
					}
				}, {
					countryCallingCode: callingCode,
					number: numberWithoutCountryCode,
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

	useEffect(() => {
		if (defaultCodeFallback && countriesWithSubOptions.includes(defaultCode) && phoneInput.current) {
			phoneInput.current?.setState({
				...phoneInput.current.state,
				code: `${defaultCodeFallback}`
			})
		}
	}, [phoneInput.current])

	const _changeCountry = (c) => {
		changeCountry?.(c)
		if (c.callingCode?.length > 1) {
			setCountryPhoneSuboptions({
				open: true,
				options: c.callingCode
			})
		}
	}

	const handleSelectCallingCode = (option: any) => {
		setCountryPhoneSuboptions({
			open: false,
			options: []
		})
		handleChangeNumber(`+${option}`)
		phoneInput.current?.setState({
			...phoneInput.current.state,
			code: `${option}`
		})
	}

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
				onChangeCountry={(country: any) => _changeCountry?.(country)}
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
			<OModal
				open={countryPhoneSuboptions.open}
				onClose={() => setCountryPhoneSuboptions({
					open: false,
					options: []
				})}
				title={t('SELECT_THE_PHONE_CODE', 'Select the phone code')}
				entireModal
			>
				<View
					style={{
						alignItems: 'center'
					}}
				>
					{countryPhoneSuboptions.options.map((option: any) => (
						<Pressable
							style={{
								margin: 10,
								padding: 10,
								borderBottomColor: '#ccc',
								borderBottomWidth: 1,
								width: '100%'
							}}
							key={option}
							onPress={() => handleSelectCallingCode(option)}
						>
							<OText>
								{`+${option}`}
							</OText>
						</Pressable>
					))}
				</View>
			</OModal>
		</Wrapper>
	)
}
