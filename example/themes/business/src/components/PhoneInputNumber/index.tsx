import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { useLanguage, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Wrapper } from './styles';
import { OText, OIcon } from '../shared';
import { PhoneInputParams } from '../../types';
import { transformCountryCode, findExitingCode } from '../../utils';

export const PhoneInputNumber = (props: PhoneInputParams) => {
  const {
    data,
    handleData,
    defaultValue,
    defaultCode,
    forwardRef,
    textInputProps,
    flagProps,
    onSubmitEditing,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const phoneInput = useRef<PhoneInput>(null);
  const [userphoneNumber, setUserphoneNumber] = useState('');

  const handleChangeNumber = (number: any) => {
    setUserphoneNumber(number);
  };

  useEffect(() => {
    if ((defaultValue && userphoneNumber) || !defaultValue) {
      if (userphoneNumber === '') return;
      if (userphoneNumber) {
        const checkValid = phoneInput.current?.isValidNumber(userphoneNumber);
        const callingCode = phoneInput.current?.getCallingCode();
        const formattedNumber =
          phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
        const regex = /^[0-9]*$/;
        const cellphone =
          userphoneNumber.slice(0, 0) +
          userphoneNumber.slice(1, userphoneNumber.length);
        const validNumber = regex.test(cellphone);
        if ((!checkValid && formattedNumber?.number) || !validNumber) {
          handleData &&
            handleData({
              ...data,
              error: t(
                'INVALID_ERROR_PHONE_NUMBER',
                'The Phone Number field is invalid',
              ),
            });
          return;
        }
        handleData &&
          handleData({
            ...data,
            error: '',
            phone: {
              country_phone_code: callingCode,
              cellphone: formattedNumber?.number,
            },
          });
      } else {
        handleData &&
          handleData({
            ...data,
            error: '',
            phone: {
              country_phone_code: null,
              cellphone: null,
            },
          });
      }
    }
  }, [userphoneNumber]);

  const style = StyleSheet.create({
    input: {
      backgroundColor: theme.colors.white,
      borderRadius: 7.6,
      borderWidth: 1,
      borderColor: theme.colors.inputSignup,
      paddingVertical: 0,
      paddingLeft: 35,
      flexGrow: 2,
      flex: 1,
      height: 50,
    },
  });

  return (
    <Wrapper>
      <PhoneInput
        containerStyle={{ width: '100%' }}
        ref={phoneInput}
        defaultValue={userphoneNumber || defaultValue}
        defaultCode={defaultCode ?
					!isNaN(defaultCode)
						? transformCountryCode(defaultCode)
						: findExitingCode(defaultCode)
					: !isNaN((configs?.default_country_code?.value || '')?.replace(/\+/g, ''))
             ? transformCountryCode((configs?.default_country_code?.value || '')?.replace(/\+/g, ''))
             : findExitingCode(configs?.default_country_code?.value?.toUpperCase())
        }
        onChangeFormattedText={(text: string) => handleChangeNumber(text)}
        countryPickerProps={{
          withAlphaFilter: false,
          withFilter: false,
          closeButtonImageStyle: { width: 15, height: 15 },
          closeButtonImage: theme.images.general.close,
        }}
        textContainerStyle={style.input}
        codeTextStyle={{ display: 'none' }}
        placeholder={t('PHONE_NUMBER', 'Phone number')}
        textInputProps={{
          selectionColor: theme.colors.primary,
          placeholderTextColor: theme.colors.arrowColor,
          blurOnSubmit: true,
          onSubmitEditing,
          autoCompleteType: 'tel',
          // @ts-ignore
          ref: forwardRef,
          color: theme.colors.textGray,
          ...textInputProps,
        }}
        renderDropdownImage={
          <OIcon
            src={theme.images.general.chevronDown}
            width={16}
            height={16}
            color={theme.colors.arrowColor}
          />
        }
        flagButtonStyle={flagProps}
      />

      {!!data?.error && (
        <OText
          size={16}
          color={theme.colors.error}
          style={{ textAlign: 'center', marginTop: 5 }}>
          {data.error}
        </OText>
      )}

      <View
        style={{
          position: 'absolute',
          top: 15,
          left: 99,
        }}>
        <OIcon
          src={theme?.images?.general?.inputPhone}
          width={20}
          height={20}
        />
      </View>
    </Wrapper>
  );
};
