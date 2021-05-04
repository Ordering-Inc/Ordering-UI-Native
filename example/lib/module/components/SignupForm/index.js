import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PhoneInputNumber } from '../PhoneInputNumber';
import { FacebookLogin } from '../FacebookLogin';
import { SignupForm as SignUpController, useLanguage, useConfig, useSession } from 'ordering-components/native';
import { FormSide, FormInput, ButtonsSection, SocialButtons } from './styles';
import { LoginWith as SignupWith, OTab, OTabs } from '../LoginForm/styles';
import { IMAGES } from '../../config/constants';
import { ToastType, useToast } from '../../providers/ToastProvider';
import NavBar from '../NavBar';
import { VerifyPhone } from '../VerifyPhone';
import { OText, OButton, OInput, OModal } from '../shared';
import { colors } from '../../theme';
import { sortInputFields } from '../../utils';
const notValidationFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'address_notes'];

const SignupFormUI = props => {
  var _validationFields$fie, _validationFields$fie2, _validationFields$fie3, _validationFields$fie4, _configs$twilio_servi, _configs$twilio_servi2, _validationFields$fie17, _configs$facebook_log, _configs$facebook_log2, _configs$facebook_id;

  const {
    navigation,
    loginButtonText,
    signupButtonText,
    onNavigationRedirect,
    formState,
    validationFields,
    showField,
    isRequiredField,
    useChekoutFileds,
    useSignupByEmail,
    useSignupByCellphone,
    handleSuccessSignup,
    handleButtonSignupClick,
    verifyPhoneState,
    checkPhoneCodeState,
    setCheckPhoneCodeState,
    handleSendVerifyCode,
    handleCheckPhoneCode
  } = props;
  const showInputPhoneNumber = (_validationFields$fie = validationFields === null || validationFields === void 0 ? void 0 : (_validationFields$fie2 = validationFields.fields) === null || _validationFields$fie2 === void 0 ? void 0 : (_validationFields$fie3 = _validationFields$fie2.checkout) === null || _validationFields$fie3 === void 0 ? void 0 : (_validationFields$fie4 = _validationFields$fie3.cellphone) === null || _validationFields$fie4 === void 0 ? void 0 : _validationFields$fie4.enabled) !== null && _validationFields$fie !== void 0 ? _validationFields$fie : false;
  const {
    showToast
  } = useToast();
  const [, t] = useLanguage();
  const [, {
    login
  }] = useSession();
  const [{
    configs
  }] = useConfig();
  const {
    control,
    handleSubmit,
    errors
  } = useForm();
  const [passwordSee, setPasswordSee] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
  const [signupTab, setSignupTab] = useState(useSignupByCellphone && !useSignupByEmail ? 'cellphone' : 'email');
  const [isFBLoading, setIsFBLoading] = useState(false);
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  });

  const handleSuccessFacebook = user => {
    login({
      user,
      token: user.session.access_token
    });
    navigation.navigate('Home');
  };

  const handleChangeTab = val => {
    setSignupTab(val);
    setPasswordSee(false);
  };

  const onSubmit = values => {
    var _validationFields$fie5, _validationFields$fie6, _validationFields$fie7, _validationFields$fie8, _validationFields$fie9, _validationFields$fie10;

    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (!phoneInputData.phone.country_phone_code && !phoneInputData.phone.cellphone && validationFields !== null && validationFields !== void 0 && (_validationFields$fie5 = validationFields.fields) !== null && _validationFields$fie5 !== void 0 && (_validationFields$fie6 = _validationFields$fie5.checkout) !== null && _validationFields$fie6 !== void 0 && (_validationFields$fie7 = _validationFields$fie6.cellphone) !== null && _validationFields$fie7 !== void 0 && _validationFields$fie7.enabled && validationFields !== null && validationFields !== void 0 && (_validationFields$fie8 = validationFields.fields) !== null && _validationFields$fie8 !== void 0 && (_validationFields$fie9 = _validationFields$fie8.checkout) !== null && _validationFields$fie9 !== void 0 && (_validationFields$fie10 = _validationFields$fie9.cellphone) !== null && _validationFields$fie10 !== void 0 && _validationFields$fie10.required) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.'));
      return;
    }

    if (signupTab === 'email' || !useSignupByCellphone) {
      handleButtonSignupClick && handleButtonSignupClick({ ...values,
        ...phoneInputData.phone
      });

      if (!formState.loading && formState.result.result && !formState.result.error) {
        handleSuccessSignup && handleSuccessSignup(formState.result.result);
      }

      return;
    }

    setFormValues(values);
    handleVerifyCodeClick(values);
  };

  const handleVerifyCodeClick = values => {
    const formData = values || formValues;
    handleSendVerifyCode && handleSendVerifyCode({ ...formData,
      ...phoneInputData.phone
    });
    setIsLoadingVerifyModal(true);
  }; // get object with rules for hook form inputs


  const getInputRules = field => {
    const rules = {
      required: isRequiredField(field.code) ? t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `${field.name} is required`).replace('_attribute_', t(field.name, field.code)) : null
    };

    if (field.code && field.code === 'email') {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
      };
    }

    return rules;
  };

  const handleChangeInputEmail = (value, onChange) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  useEffect(() => {
    var _formState$result;

    if (!formState.loading && (_formState$result = formState.result) !== null && _formState$result !== void 0 && _formState$result.error) {
      var _formState$result2, _formState$result3;

      ((_formState$result2 = formState.result) === null || _formState$result2 === void 0 ? void 0 : _formState$result2.result) && showToast(ToastType.Error, (_formState$result3 = formState.result) === null || _formState$result3 === void 0 ? void 0 : _formState$result3.result[0]);
      setIsLoadingVerifyModal(false);
    }
  }, [formState]);
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      var _validationFields$fie11, _validationFields$fie12, _validationFields$fie13, _validationFields$fie14, _validationFields$fie15, _validationFields$fie16;

      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);

      if (phoneInputData.error) {
        list.push({
          message: phoneInputData.error
        });
      }

      if (!phoneInputData.error && !phoneInputData.phone.country_phone_code && !phoneInputData.phone.cellphone && validationFields !== null && validationFields !== void 0 && (_validationFields$fie11 = validationFields.fields) !== null && _validationFields$fie11 !== void 0 && (_validationFields$fie12 = _validationFields$fie11.checkout) !== null && _validationFields$fie12 !== void 0 && (_validationFields$fie13 = _validationFields$fie12.cellphone) !== null && _validationFields$fie13 !== void 0 && _validationFields$fie13.enabled && validationFields !== null && validationFields !== void 0 && (_validationFields$fie14 = validationFields.fields) !== null && _validationFields$fie14 !== void 0 && (_validationFields$fie15 = _validationFields$fie14.checkout) !== null && _validationFields$fie15 !== void 0 && (_validationFields$fie16 = _validationFields$fie15.cellphone) !== null && _validationFields$fie16 !== void 0 && _validationFields$fie16.required) {
        list.push({
          message: t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.')
        });
      }

      let stringError = '';
      list.map((item, i) => {
        stringError += i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
      setIsLoadingVerifyModal(false);
    }
  }, [errors]);
  useEffect(() => {
    if (verifyPhoneState && !(verifyPhoneState !== null && verifyPhoneState !== void 0 && verifyPhoneState.loading)) {
      var _verifyPhoneState$res, _verifyPhoneState$res6;

      if ((_verifyPhoneState$res = verifyPhoneState.result) !== null && _verifyPhoneState$res !== void 0 && _verifyPhoneState$res.error) {
        var _verifyPhoneState$res2, _verifyPhoneState$res3, _verifyPhoneState$res4, _verifyPhoneState$res5;

        const message = typeof (verifyPhoneState === null || verifyPhoneState === void 0 ? void 0 : (_verifyPhoneState$res2 = verifyPhoneState.result) === null || _verifyPhoneState$res2 === void 0 ? void 0 : _verifyPhoneState$res2.result) === 'string' ? verifyPhoneState === null || verifyPhoneState === void 0 ? void 0 : (_verifyPhoneState$res3 = verifyPhoneState.result) === null || _verifyPhoneState$res3 === void 0 ? void 0 : _verifyPhoneState$res3.result : verifyPhoneState === null || verifyPhoneState === void 0 ? void 0 : (_verifyPhoneState$res4 = verifyPhoneState.result) === null || _verifyPhoneState$res4 === void 0 ? void 0 : _verifyPhoneState$res4.result[0];
        ((_verifyPhoneState$res5 = verifyPhoneState.result) === null || _verifyPhoneState$res5 === void 0 ? void 0 : _verifyPhoneState$res5.result) && showToast(ToastType.Error, message);
        setIsLoadingVerifyModal(false);
        return;
      }

      const okResult = ((_verifyPhoneState$res6 = verifyPhoneState.result) === null || _verifyPhoneState$res6 === void 0 ? void 0 : _verifyPhoneState$res6.result) === 'OK';

      if (okResult) {
        !isModalVisible && setIsModalVisible(true);
        setIsLoadingVerifyModal(false);
      }
    }
  }, [verifyPhoneState]);
  return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(NavBar, {
    title: t('SIGNUP', 'Signup'),
    titleAlign: 'center',
    onActionLeft: () => navigation.goBack(),
    showCall: false,
    btnStyle: {
      paddingLeft: 0
    }
  }), /*#__PURE__*/React.createElement(FormSide, null, useSignupByEmail && useSignupByCellphone && configs && Object.keys(configs).length > 0 && ((configs === null || configs === void 0 ? void 0 : (_configs$twilio_servi = configs.twilio_service_enabled) === null || _configs$twilio_servi === void 0 ? void 0 : _configs$twilio_servi.value) === 'true' || (configs === null || configs === void 0 ? void 0 : (_configs$twilio_servi2 = configs.twilio_service_enabled) === null || _configs$twilio_servi2 === void 0 ? void 0 : _configs$twilio_servi2.value) === '1') && /*#__PURE__*/React.createElement(SignupWith, {
    style: {
      paddingBottom: 25
    }
  }, /*#__PURE__*/React.createElement(OTabs, null, useSignupByEmail && /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => handleChangeTab('email')
  }, /*#__PURE__*/React.createElement(OTab, null, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    color: signupTab === 'email' ? colors.primary : colors.disabled
  }, t('SIGNUP_BY_EMAIL', 'Signup by Email')))), useSignupByCellphone && /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => handleChangeTab('cellphone')
  }, /*#__PURE__*/React.createElement(OTab, null, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    color: signupTab === 'cellphone' ? colors.primary : colors.disabled
  }, t('SIGNUP_BY_PHONE', 'Signup by Phone')))))), /*#__PURE__*/React.createElement(FormInput, null, !(useChekoutFileds && validationFields !== null && validationFields !== void 0 && validationFields.loading) ? /*#__PURE__*/React.createElement(React.Fragment, null, sortInputFields({
    values: validationFields === null || validationFields === void 0 ? void 0 : (_validationFields$fie17 = validationFields.fields) === null || _validationFields$fie17 === void 0 ? void 0 : _validationFields$fie17.checkout
  }).map(field => !notValidationFields.includes(field.code) && showField && showField(field.code) && /*#__PURE__*/React.createElement(Controller, {
    key: field.id,
    control: control,
    render: ({
      onChange,
      value
    }) => /*#__PURE__*/React.createElement(OInput, {
      placeholder: t(field.name),
      style: style.inputStyle,
      icon: field.code === 'email' ? IMAGES.email : IMAGES.user,
      value: value,
      onChange: val => field.code !== 'email' ? onChange(val) : handleChangeInputEmail(val, onChange),
      autoCapitalize: field.code === 'email' ? 'none' : 'sentences',
      autoCorrect: field.code === 'email' && false,
      type: field.code === 'email' ? 'email-address' : 'default',
      isSecured: field.code === 'email'
    }),
    name: field.code,
    rules: getInputRules(field),
    defaultValue: ""
  })), !!showInputPhoneNumber && /*#__PURE__*/React.createElement(View, {
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement(PhoneInputNumber, {
    data: phoneInputData,
    handleData: val => setPhoneInputData(val)
  })), signupTab !== 'cellphone' && /*#__PURE__*/React.createElement(Controller, {
    control: control,
    render: ({
      onChange,
      value
    }) => /*#__PURE__*/React.createElement(OInput, {
      isSecured: !passwordSee ? true : false,
      placeholder: t('PASSWORD', 'Password'),
      style: style.inputStyle,
      icon: IMAGES.lock,
      iconCustomRight: !passwordSee ? /*#__PURE__*/React.createElement(MaterialCommunityIcons, {
        name: "eye-outline",
        size: 24,
        onPress: () => setPasswordSee(!passwordSee)
      }) : /*#__PURE__*/React.createElement(MaterialCommunityIcons, {
        name: "eye-off-outline",
        size: 24,
        onPress: () => setPasswordSee(!passwordSee)
      }),
      value: value,
      onChange: val => onChange(val)
    }),
    name: "password",
    rules: {
      required: isRequiredField('password') ? t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required').replace('_attribute_', t('PASSWORD', 'password')) : null,
      minLength: {
        value: 8,
        message: t('VALIDATION_ERROR_PASSWORD_MIN_STRING', 'The Password must be at least 8 characters.').replace('_attribute_', t('PASSWORD', 'Password')).replace('_min_', 8)
      }
    },
    defaultValue: ""
  })) : /*#__PURE__*/React.createElement(Spinner, {
    visible: true
  }), signupTab === 'cellphone' && useSignupByEmail && useSignupByCellphone ? /*#__PURE__*/React.createElement(OButton, {
    onClick: handleSubmit(onSubmit),
    text: t('GET_VERIFY_CODE', 'Get Verify Code'),
    borderColor: colors.primary,
    imgRightSrc: null,
    textStyle: {
      color: 'white'
    },
    isLoading: isLoadingVerifyModal,
    indicatorColor: colors.white
  }) : /*#__PURE__*/React.createElement(OButton, {
    onClick: handleSubmit(onSubmit),
    text: signupButtonText,
    bgColor: colors.primary,
    borderColor: colors.primary,
    textStyle: {
      color: 'white'
    },
    imgRightSrc: null,
    isDisabled: formState.loading || validationFields.loading
  })), onNavigationRedirect && loginButtonText && /*#__PURE__*/React.createElement(View, {
    style: style.wrappText
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    style: {
      marginRight: 5
    }
  }, t('MOBILE_FRONT_ALREADY_HAVE_AN_ACCOUNT', 'Already have an account?')), /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => onNavigationRedirect('Login')
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    color: colors.primary
  }, loginButtonText))), configs && Object.keys(configs).length > 0 && ((configs === null || configs === void 0 ? void 0 : (_configs$facebook_log = configs.facebook_login) === null || _configs$facebook_log === void 0 ? void 0 : _configs$facebook_log.value) === 'true' || (configs === null || configs === void 0 ? void 0 : (_configs$facebook_log2 = configs.facebook_login) === null || _configs$facebook_log2 === void 0 ? void 0 : _configs$facebook_log2.value) === '1') && (configs === null || configs === void 0 ? void 0 : (_configs$facebook_id = configs.facebook_id) === null || _configs$facebook_id === void 0 ? void 0 : _configs$facebook_id.value) && /*#__PURE__*/React.createElement(ButtonsSection, null, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    color: colors.disabled
  }, t('SELECT_AN_OPTION_TO_LOGIN', 'Select an option to login')), /*#__PURE__*/React.createElement(SocialButtons, null, /*#__PURE__*/React.createElement(FacebookLogin, {
    handleErrors: err => showToast(ToastType.Error, err),
    handleLoading: val => setIsFBLoading(val),
    handleSuccessFacebookLogin: handleSuccessFacebook
  })))), /*#__PURE__*/React.createElement(OModal, {
    open: isModalVisible,
    onClose: () => setIsModalVisible(false)
  }, /*#__PURE__*/React.createElement(VerifyPhone, {
    phone: phoneInputData.phone,
    formValues: formValues,
    verifyPhoneState: verifyPhoneState,
    checkPhoneCodeState: checkPhoneCodeState,
    handleCheckPhoneCode: handleCheckPhoneCode,
    setCheckPhoneCodeState: setCheckPhoneCodeState,
    handleVerifyCodeClick: onSubmit
  })), /*#__PURE__*/React.createElement(Spinner, {
    visible: formState.loading || validationFields.loading || isFBLoading
  }));
};

const style = StyleSheet.create({
  btnOutline: {
    backgroundColor: '#FFF',
    color: colors.primary
  },
  inputStyle: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.disabled
  },
  wrappText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  }
});
export const SignupForm = props => {
  const signupProps = { ...props,
    UIComponent: SignupFormUI
  };
  return /*#__PURE__*/React.createElement(SignUpController, signupProps);
};
//# sourceMappingURL=index.js.map