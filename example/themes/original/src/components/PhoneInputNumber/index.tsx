import React, { useEffect, useRef, useState } from 'react';
import PhoneInput from "react-native-phone-number-input";
import { StyleSheet, View } from 'react-native';
import { useLanguage, useConfig } from 'ordering-components/native';

import { Wrapper } from './styles'

import { colors, images } from '../../theme.json'
import { PhoneInputParams } from '../../types';
import { OIcon, OText } from '../shared';
import {transformCountryCode} from '../../utils'

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
	 noDropIcon
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const phoneInput = useRef<PhoneInput>(null);
  const [userphoneNumber, setUserphoneNumber] = useState('');

  const handleChangeNumber = (number: any) => {
    setUserphoneNumber(number)
  }

  useEffect(() => {
    if((defaultValue && userphoneNumber) || defaultValue === undefined || defaultValue === ''){
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
        onChangeFormattedText={(text : string) => handleChangeNumber(text)}
        withDarkTheme
        countryPickerProps={{withAlphaFilter:true}}
        textContainerStyle={{...style.input, ...inputStyle ? inputStyle : {}}}
		  textInputStyle={textStyle}
		  codeTextStyle={textStyle}
		  flagButtonStyle={flagStyle}
		  countryPickerButtonStyle={{...style.countryBtn, ...boxStyle ? boxStyle : {}}}
        placeholder={t('PHONE_NUMBER', 'Phone Number')}
        textInputProps={{autoCompleteType: 'tel', ref: forwardRef, ...textInputProps}}
		  containerStyle={{width: '100%'}}
		  renderDropdownImage={noDropIcon ? <View /> : <OIcon src={images.general.arrow_down} width={13} color={'#B1BCCC'}></OIcon>}
      />
      {!!data?.error && (
        <OText
          size={16}
          color={colors.error}
          style={{ textAlign: 'center', marginTop: 5 }}
          >
          {data.error}
        </OText>
      )}
    </Wrapper>
  )
}

const style = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderRadius: 7.6,
    borderWidth: 1,
    borderColor: colors.border,
    paddingBottom: 0,
	 paddingTop: 0,
    flexGrow: 1,
    flex: 1,
    height: 50,
  },
  countryBtn: {
	borderWidth: 1,
	borderColor: colors.border,
	borderRadius: 7.6,
	marginEnd: 9,
  }
})
