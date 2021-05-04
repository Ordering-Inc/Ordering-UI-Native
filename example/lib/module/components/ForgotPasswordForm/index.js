import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import BottomWrapper from '../BottomWrapper';
import NavBar from '../NavBar';
import { OButton, OInput, OText } from '../shared';
import { colors } from '../../theme';
import { IMAGES } from '../../config/constants';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { ForgotPasswordForm as ForgotPasswordController, useLanguage } from 'ordering-components/native';
import { Wrapper } from './styles';

const ForgotPasswordUI = props => {
  var _formState$result4, _formState$result5, _formState$result6, _formState$result7;

  const {
    navigation,
    formState,
    handleButtonForgotPasswordClick
  } = props;
  const [, t] = useLanguage();
  const {
    showToast
  } = useToast();
  const {
    control,
    handleSubmit,
    errors
  } = useForm();
  const [emailSent, setEmailSent] = useState(null);

  const onSubmit = values => {
    setEmailSent(values.email);
    handleButtonForgotPasswordClick && handleButtonForgotPasswordClick(values);
  };

  const handleChangeInputEmail = (value, onChange) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  useEffect(() => {
    if (!formState.loading && emailSent) {
      var _formState$result;

      if ((_formState$result = formState.result) !== null && _formState$result !== void 0 && _formState$result.error) {
        var _formState$result2, _formState$result3;

        setEmailSent(null);
        ((_formState$result2 = formState.result) === null || _formState$result2 === void 0 ? void 0 : _formState$result2.result) && showToast(ToastType.Error, (_formState$result3 = formState.result) === null || _formState$result3 === void 0 ? void 0 : _formState$result3.result[0]);
        return;
      }

      showToast(ToastType.Success, `${t('SUCCESS_SEND_FORGOT_PASSWORD', 'Your link has been sent to the email')}: ${emailSent}`);
    }
  }, [formState]);
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item, i) => {
        stringError += i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NavBar, {
    title: 'Forgot your password?',
    titleAlign: 'center',
    onActionLeft: () => navigation.goBack(),
    showCall: false,
    btnStyle: {
      paddingLeft: 0
    },
    paddingTop: 0
  }), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(OText, {
    color: 'gray',
    size: 16,
    weight: '300',
    style: {
      marginBottom: 30
    }
  }, t('FORGOT_PASSWORD_TEXT_MESSAGE', "Enter your email address and we'll sent a link to reset your password.")), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    render: ({
      onChange,
      value
    }) => /*#__PURE__*/React.createElement(OInput, {
      placeholder: t('EMAIL', 'Email'),
      style: style.inputStyle,
      icon: IMAGES.email,
      value: value,
      onChange: e => {
        handleChangeInputEmail(e, onChange);
      },
      autoCapitalize: "none",
      autoCompleteType: "off",
      autoCorrect: false,
      type: "email-address",
      isSecured: true
    }),
    name: "email",
    rules: {
      required: t('VALIDATION_ERROR_EMAIL_REQUIRED', 'The field Email is required').replace('_attribute_', t('EMAIL', 'Email')),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
      }
    },
    defaultValue: ""
  })), /*#__PURE__*/React.createElement(BottomWrapper, null, /*#__PURE__*/React.createElement(OButton, {
    text: emailSent && !((_formState$result4 = formState.result) !== null && _formState$result4 !== void 0 && _formState$result4.error) ? t('LINK_SEND_FORGOT_PASSWORD', 'Link Sent') : t('FRONT_RECOVER_PASSWORD', 'Recover Password'),
    textStyle: {
      color: 'white'
    },
    bgColor: emailSent && !((_formState$result5 = formState.result) !== null && _formState$result5 !== void 0 && _formState$result5.error) ? colors.disabled : colors.primary,
    borderColor: emailSent && !((_formState$result6 = formState.result) !== null && _formState$result6 !== void 0 && _formState$result6.error) ? colors.disabled : colors.primary,
    isLoading: formState.loading,
    onClick: emailSent && !((_formState$result7 = formState.result) !== null && _formState$result7 !== void 0 && _formState$result7.error) ? () => {} : handleSubmit(onSubmit)
  })));
};

const style = StyleSheet.create({
  inputStyle: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.disabled
  }
});
export const ForgotPasswordForm = props => {
  const ForgotPasswordProps = { ...props,
    UIComponent: ForgotPasswordUI
  };
  return /*#__PURE__*/React.createElement(ForgotPasswordController, ForgotPasswordProps);
};
//# sourceMappingURL=index.js.map