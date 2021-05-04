import React, { useEffect, useRef, useState } from 'react';
import PhoneInput from "react-native-phone-number-input";
import { StyleSheet } from 'react-native';
import { useLanguage, useConfig } from 'ordering-components/native';
import { Wrapper } from './styles';
import { colors } from '../../theme';
import { OText } from '../shared';
export const PhoneInputNumber = props => {
  var _configs$default_coun;

  const {
    data,
    handleData,
    defaultValue
  } = props;
  const [, t] = useLanguage();
  const [{
    configs
  }] = useConfig();
  const phoneInput = useRef(null);
  const [userphoneNumber, setUserphoneNumber] = useState('');

  const handleChangeNumber = number => {
    setUserphoneNumber(number);
  };

  useEffect(() => {
    if (defaultValue && userphoneNumber || defaultValue === undefined || defaultValue === '') {
      if (userphoneNumber) {
        var _phoneInput$current, _phoneInput$current2, _phoneInput$current3;

        const checkValid = (_phoneInput$current = phoneInput.current) === null || _phoneInput$current === void 0 ? void 0 : _phoneInput$current.isValidNumber(userphoneNumber);
        const callingCode = (_phoneInput$current2 = phoneInput.current) === null || _phoneInput$current2 === void 0 ? void 0 : _phoneInput$current2.getCallingCode();
        const formattedNumber = (_phoneInput$current3 = phoneInput.current) === null || _phoneInput$current3 === void 0 ? void 0 : _phoneInput$current3.getNumberAfterPossiblyEliminatingZero();
        const regex = /^[0-9]*$/;
        const cellphone = userphoneNumber.slice(0, 0) + userphoneNumber.slice(1, userphoneNumber.length);
        const validNumber = regex.test(cellphone);

        if (!checkValid && formattedNumber !== null && formattedNumber !== void 0 && formattedNumber.number || !validNumber) {
          handleData && handleData({ ...data,
            error: t('INVALID_ERROR_PHONE_NUMBER', 'The Phone Number field is invalid')
          });
          return;
        }

        handleData && handleData({ ...data,
          error: '',
          phone: {
            country_phone_code: callingCode,
            cellphone: formattedNumber === null || formattedNumber === void 0 ? void 0 : formattedNumber.number
          }
        });
      } else {
        handleData && handleData({ ...data,
          error: '',
          phone: {
            country_phone_code: null,
            cellphone: null
          }
        });
      }
    }
  }, [userphoneNumber]);
  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(PhoneInput, {
    ref: phoneInput,
    defaultValue: userphoneNumber || defaultValue,
    defaultCode: configs === null || configs === void 0 ? void 0 : (_configs$default_coun = configs.default_country_code) === null || _configs$default_coun === void 0 ? void 0 : _configs$default_coun.value,
    onChangeFormattedText: text => handleChangeNumber(text),
    withDarkTheme: true,
    countryPickerProps: {
      withAlphaFilter: true
    },
    textContainerStyle: style.input
  }), !!(data !== null && data !== void 0 && data.error) && /*#__PURE__*/React.createElement(OText, {
    size: 16,
    color: colors.error,
    style: {
      textAlign: 'center',
      marginTop: 5
    }
  }, data.error));
};
const style = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingVertical: 0
  }
});
//# sourceMappingURL=index.js.map