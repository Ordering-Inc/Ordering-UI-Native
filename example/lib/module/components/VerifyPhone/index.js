import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { getTraduction } from '../../utils';
import { OText } from '../shared';
import { colors } from '../../theme';
import { Container, CountDownContainer, ResendSection, WrappCountdown, InputsSection, ErrorSection } from './styles';
const TIME_COUNTDOWN = 60 * 10; // 10 minutes

export const VerifyPhone = props => {
  var _verifyPhoneState$res, _ref, _verifyPhoneState$res2, _ref2, _ref2$result, _verifyPhoneState$res3, _result, _verifyPhoneState$res4, _checkResult, _result2, _verifyPhoneState$res5;

  const {
    phone,
    formValues,
    verifyPhoneState,
    checkPhoneCodeState,
    setCheckPhoneCodeState,
    handleCheckPhoneCode,
    handleVerifyCodeClick
  } = props;
  const [, t] = useLanguage();
  const [timer, setTimer] = useState(`${TIME_COUNTDOWN / 60}:00`);
  const [verifyCode, setVerifyCode] = useState({
    0: '',
    1: '',
    2: '',
    3: ''
  });
  const [isSendCodeAgain, setIsSendCodeAgain] = useState(false);
  const lastNumbers = (phone === null || phone === void 0 ? void 0 : phone.cellphone) && `${phone === null || phone === void 0 ? void 0 : phone.cellphone.charAt((phone === null || phone === void 0 ? void 0 : phone.cellphone.length) - 2)}${phone === null || phone === void 0 ? void 0 : phone.cellphone.charAt((phone === null || phone === void 0 ? void 0 : phone.cellphone.length) - 1)}`;

  const handleChangeCode = (val, i) => {
    setVerifyCode({ ...verifyCode,
      [i]: val
    });
  };

  const checkResult = result => {
    if (!result) return;
    return typeof result === 'string' ? [result] : result;
  };

  const handleSendCodeAgain = () => {
    setCheckPhoneCodeState && setCheckPhoneCodeState();
    setTimer(`${TIME_COUNTDOWN / 60}:00`);
    setIsSendCodeAgain(true);
    handleVerifyCodeClick && handleVerifyCodeClick();
  };

  useEffect(() => {
    let _timer = TIME_COUNTDOWN - 1;

    let minutes = 0;
    let seconds = 0;
    const interval = setInterval(() => {
      minutes = _timer / 60;
      seconds = _timer % 60;
      minutes = minutes < 10 ? 0 + minutes : minutes;
      seconds = seconds < 10 ? 0 + seconds : seconds;
      const formatMinutes = parseInt(minutes.toString()) < 10 ? `0${parseInt(minutes.toString())}` : parseInt(minutes.toString());
      const formatseconds = parseInt(seconds.toString()) < 10 ? `0${parseInt(seconds.toString())}` : parseInt(seconds.toString());
      setTimer(`${formatMinutes}:${formatseconds}`);

      if (--_timer < 0) {
        clearInterval(interval);
      }

      if (timer === `${TIME_COUNTDOWN / 60}:00` && isSendCodeAgain) {
        setIsSendCodeAgain(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isSendCodeAgain]);
  useEffect(() => {
    const codes = Object.keys(verifyCode).length;
    const isFullInputs = codes && Object.values(verifyCode).every(val => val);

    if (codes === 4 && isFullInputs) {
      const values = { ...formValues,
        cellphone: phone.cellphone,
        country_phone_code: `+${phone.country_phone_code}`,
        code: Object.values(verifyCode).join().replace(/,/g, '')
      };
      handleCheckPhoneCode && handleCheckPhoneCode(values);
    }
  }, [verifyCode]);
  return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(OText, {
    size: 30,
    style: {
      textAlign: 'left'
    }
  }, t('VERIFY_PHONE', 'Verify Phone')), lastNumbers && /*#__PURE__*/React.createElement(OText, {
    size: 20,
    color: colors.disabled
  }, `${t('MESSAGE_ENTER_VERIFY_CODE', 'Please, enter the verification code we sent to your mobile ending with')} **${lastNumbers}`), /*#__PURE__*/React.createElement(WrappCountdown, null, /*#__PURE__*/React.createElement(CountDownContainer, {
    color: timer === '00:00' ? colors.error : colors.success
  }, /*#__PURE__*/React.createElement(OText, {
    size: 30,
    color: timer === '00:00' ? colors.error : colors.success
  }, timer))), /*#__PURE__*/React.createElement(InputsSection, null, [...Array(4)].map((_, i) => /*#__PURE__*/React.createElement(TextInput, {
    key: i,
    keyboardType: "number-pad",
    placeholder: '0',
    style: styles.inputStyle,
    onChangeText: val => handleChangeCode(val, i),
    maxLength: 1,
    editable: timer !== '00:00'
  }))), (verifyPhoneState !== null && verifyPhoneState !== void 0 && (_verifyPhoneState$res = verifyPhoneState.result) !== null && _verifyPhoneState$res !== void 0 && _verifyPhoneState$res.error ? verifyPhoneState : checkPhoneCodeState) && !((_ref = verifyPhoneState !== null && verifyPhoneState !== void 0 && (_verifyPhoneState$res2 = verifyPhoneState.result) !== null && _verifyPhoneState$res2 !== void 0 && _verifyPhoneState$res2.error ? verifyPhoneState : checkPhoneCodeState) !== null && _ref !== void 0 && _ref.loading) && ((_ref2 = verifyPhoneState !== null && verifyPhoneState !== void 0 && (_verifyPhoneState$res3 = verifyPhoneState.result) !== null && _verifyPhoneState$res3 !== void 0 && _verifyPhoneState$res3.error ? verifyPhoneState : checkPhoneCodeState) === null || _ref2 === void 0 ? void 0 : (_ref2$result = _ref2.result) === null || _ref2$result === void 0 ? void 0 : _ref2$result.error) && ((_result = (verifyPhoneState !== null && verifyPhoneState !== void 0 && (_verifyPhoneState$res4 = verifyPhoneState.result) !== null && _verifyPhoneState$res4 !== void 0 && _verifyPhoneState$res4.error ? verifyPhoneState : checkPhoneCodeState).result) === null || _result === void 0 ? void 0 : _result.result) && /*#__PURE__*/React.createElement(ErrorSection, null, (_checkResult = checkResult((_result2 = (verifyPhoneState !== null && verifyPhoneState !== void 0 && (_verifyPhoneState$res5 = verifyPhoneState.result) !== null && _verifyPhoneState$res5 !== void 0 && _verifyPhoneState$res5.error ? verifyPhoneState : checkPhoneCodeState).result) === null || _result2 === void 0 ? void 0 : _result2.result)) === null || _checkResult === void 0 ? void 0 : _checkResult.map((e, i) => /*#__PURE__*/React.createElement(OText, {
    key: i,
    size: 20,
    color: colors.error
  }, `* ${t(getTraduction(e))}`))), /*#__PURE__*/React.createElement(ResendSection, null, /*#__PURE__*/React.createElement(OText, {
    size: 17,
    style: {
      marginRight: 5
    }
  }, t('ARE_YOU_NOT_SEEING_THE_CODE', 'Are you not seeing the code?')), /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => handleSendCodeAgain()
  }, /*#__PURE__*/React.createElement(OText, {
    size: 17,
    color: colors.primary
  }, t('SEND_AGAIN', 'Send Again')))), /*#__PURE__*/React.createElement(Spinner, {
    visible: checkPhoneCodeState.loading
  }));
};
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
//# sourceMappingURL=index.js.map