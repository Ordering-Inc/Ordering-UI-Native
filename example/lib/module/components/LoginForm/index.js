import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import { PhoneInputNumber } from '../PhoneInputNumber';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LoginForm as LoginFormController, useLanguage, useConfig, useSession } from 'ordering-components/native';
import { FacebookLogin } from '../FacebookLogin';
import { VerifyPhone } from '../VerifyPhone';
import { Container, ButtonsWrapper, LoginWith, FormSide, FormInput, OTabs, OTab, SocialButtons, OrSeparator, LineSeparator } from './styles';
import { IMAGES } from '../../config/constants';
import { ToastType, useToast } from '../../providers/ToastProvider';
import NavBar from '../NavBar';
import { OText, OButton, OInput, OModal } from '../shared';
import { colors } from '../../theme';

const LoginFormUI = props => {
  var _configs$twilio_servi, _configs$twilio_servi2, _configs$facebook_log, _configs$facebook_log2, _configs$facebook_id;

  const {
    loginTab,
    formState,
    navigation,
    useLoginByEmail,
    useLoginByCellphone,
    loginButtonText,
    forgotButtonText,
    verifyPhoneState,
    checkPhoneCodeState,
    registerButtonText,
    setCheckPhoneCodeState,
    handleButtonLoginClick,
    handleSendVerifyCode,
    handleCheckPhoneCode,
    onNavigationRedirect
  } = props;
  const {
    showToast
  } = useToast();
  const [, t] = useLanguage();
  const [{
    configs
  }] = useConfig();
  const [, {
    login
  }] = useSession();
  const {
    control,
    handleSubmit,
    errors
  } = useForm();
  const [passwordSee, setPasswordSee] = useState(false);
  const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFBLoading, setIsFBLoading] = useState(false);
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  });

  const handleChangeTab = val => {
    props.handleChangeTab(val);
    setPasswordSee(false);
  };

  const onSubmit = values => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    handleButtonLoginClick({ ...values,
      ...phoneInputData.phone
    });
  };

  const handleVerifyCodeClick = () => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (!phoneInputData.error && !phoneInputData.phone.country_phone_code && !phoneInputData.phone.cellphone) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.'));
      return;
    }

    handleSendVerifyCode && handleSendVerifyCode(phoneInputData.phone);
    setIsLoadingVerifyModal(true);
  };

  const handleSuccessFacebook = user => {
    login({
      user,
      token: user.session.access_token
    });
  };

  const handleChangeInputEmail = (value, onChange) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  useEffect(() => {
    var _formState$result;

    if (!formState.loading && (_formState$result = formState.result) !== null && _formState$result !== void 0 && _formState$result.error) {
      var _formState$result2, _formState$result3;

      ((_formState$result2 = formState.result) === null || _formState$result2 === void 0 ? void 0 : _formState$result2.result) && showToast(ToastType.Error, (_formState$result3 = formState.result) === null || _formState$result3 === void 0 ? void 0 : _formState$result3.result[0]);
    }
  }, [formState]);
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
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';

      if (phoneInputData.error) {
        list.unshift({
          message: phoneInputData.error
        });
      }

      if (loginTab === 'cellphone' && !phoneInputData.error && !phoneInputData.phone.country_phone_code && !phoneInputData.phone.cellphone) {
        list.unshift({
          message: t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.')
        });
      }

      list.map((item, i) => {
        stringError += i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);
  return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(NavBar, {
    title: t('LOGIN', 'Login'),
    titleAlign: 'center',
    onActionLeft: () => navigation.goBack(),
    showCall: false,
    btnStyle: {
      paddingLeft: 0
    },
    paddingTop: 0
  }), /*#__PURE__*/React.createElement(FormSide, null, useLoginByEmail && useLoginByCellphone && /*#__PURE__*/React.createElement(LoginWith, null, /*#__PURE__*/React.createElement(OTabs, null, useLoginByEmail && /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => handleChangeTab('email')
  }, /*#__PURE__*/React.createElement(OTab, null, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    color: loginTab === 'email' ? colors.primary : colors.disabled
  }, t('LOGIN_BY_EMAIL', 'Login by Email')))), useLoginByCellphone && /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => handleChangeTab('cellphone')
  }, /*#__PURE__*/React.createElement(OTab, null, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    color: loginTab === 'cellphone' ? colors.primary : colors.disabled
  }, t('LOGIN_BY_PHONE', 'Login by Phone')))))), (useLoginByCellphone || useLoginByEmail) && /*#__PURE__*/React.createElement(FormInput, null, useLoginByEmail && loginTab === 'email' && /*#__PURE__*/React.createElement(Controller, {
    control: control,
    render: ({
      onChange,
      value
    }) => /*#__PURE__*/React.createElement(OInput, {
      placeholder: t('EMAIL', 'Email'),
      style: loginStyle.inputStyle,
      icon: IMAGES.email,
      onChange: e => {
        handleChangeInputEmail(e, onChange);
      },
      value: value,
      autoCapitalize: "none",
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
  }), useLoginByCellphone && loginTab === 'cellphone' && /*#__PURE__*/React.createElement(View, {
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/React.createElement(PhoneInputNumber, {
    data: phoneInputData,
    handleData: val => setPhoneInputData(val)
  })), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    render: ({
      onChange,
      value
    }) => /*#__PURE__*/React.createElement(OInput, {
      isSecured: !passwordSee ? true : false,
      placeholder: t('PASSWORD', 'Password'),
      style: loginStyle.inputStyle,
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
      required: t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required').replace('_attribute_', t('PASSWORD', 'Password'))
    },
    defaultValue: ""
  }), /*#__PURE__*/React.createElement(OButton, {
    onClick: handleSubmit(onSubmit),
    text: loginButtonText,
    bgColor: colors.primary,
    borderColor: colors.primary,
    textStyle: {
      color: 'white'
    },
    imgRightSrc: null,
    isLoading: formState.loading
  })), onNavigationRedirect && forgotButtonText && /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => onNavigationRedirect('Forgot')
  }, /*#__PURE__*/React.createElement(OText, {
    size: 20,
    mBottom: 18
  }, forgotButtonText)), useLoginByCellphone && loginTab === 'cellphone' && configs && Object.keys(configs).length > 0 && ((configs === null || configs === void 0 ? void 0 : (_configs$twilio_servi = configs.twilio_service_enabled) === null || _configs$twilio_servi === void 0 ? void 0 : _configs$twilio_servi.value) === 'true' || (configs === null || configs === void 0 ? void 0 : (_configs$twilio_servi2 = configs.twilio_service_enabled) === null || _configs$twilio_servi2 === void 0 ? void 0 : _configs$twilio_servi2.value) === '1') && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OrSeparator, null, /*#__PURE__*/React.createElement(LineSeparator, null), /*#__PURE__*/React.createElement(OText, {
    size: 18,
    mRight: 20,
    mLeft: 20
  }, t('OR', 'Or')), /*#__PURE__*/React.createElement(LineSeparator, null)), /*#__PURE__*/React.createElement(ButtonsWrapper, {
    mBottom: 20
  }, /*#__PURE__*/React.createElement(OButton, {
    onClick: handleVerifyCodeClick,
    text: t('GET_VERIFY_CODE', 'Get Verify Code'),
    borderColor: colors.primary,
    style: loginStyle.btnOutline,
    imgRightSrc: null,
    isLoading: isLoadingVerifyModal,
    indicatorColor: colors.primary
  }))), configs && Object.keys(configs).length > 0 && ((configs === null || configs === void 0 ? void 0 : (_configs$facebook_log = configs.facebook_login) === null || _configs$facebook_log === void 0 ? void 0 : _configs$facebook_log.value) === 'true' || (configs === null || configs === void 0 ? void 0 : (_configs$facebook_log2 = configs.facebook_login) === null || _configs$facebook_log2 === void 0 ? void 0 : _configs$facebook_log2.value) === '1') && (configs === null || configs === void 0 ? void 0 : (_configs$facebook_id = configs.facebook_id) === null || _configs$facebook_id === void 0 ? void 0 : _configs$facebook_id.value) && /*#__PURE__*/React.createElement(ButtonsWrapper, null, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    mBottom: 10,
    color: colors.disabled
  }, t('SELECT_AN_OPTION_TO_LOGIN', 'Select an option to login')), /*#__PURE__*/React.createElement(SocialButtons, null, /*#__PURE__*/React.createElement(FacebookLogin, {
    handleErrors: err => showToast(ToastType.Error, err),
    handleLoading: val => setIsFBLoading(val),
    handleSuccessFacebookLogin: handleSuccessFacebook
  }))), onNavigationRedirect && registerButtonText && /*#__PURE__*/React.createElement(ButtonsWrapper, null, /*#__PURE__*/React.createElement(OButton, {
    onClick: () => onNavigationRedirect('Signup'),
    text: registerButtonText,
    style: loginStyle.btnOutline,
    borderColor: colors.primary,
    imgRightSrc: null
  }))), /*#__PURE__*/React.createElement(OModal, {
    open: isModalVisible,
    onClose: () => setIsModalVisible(false)
  }, /*#__PURE__*/React.createElement(VerifyPhone, {
    phone: phoneInputData.phone,
    verifyPhoneState: verifyPhoneState,
    checkPhoneCodeState: checkPhoneCodeState,
    handleCheckPhoneCode: handleCheckPhoneCode,
    setCheckPhoneCodeState: setCheckPhoneCodeState,
    handleVerifyCodeClick: handleVerifyCodeClick
  })), /*#__PURE__*/React.createElement(Spinner, {
    visible: isFBLoading
  }));
};

const loginStyle = StyleSheet.create({
  btnOutline: {
    backgroundColor: '#FFF',
    color: colors.primary
  },
  inputStyle: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.disabled
  }
});
export const LoginForm = props => {
  const loginProps = { ...props,
    UIComponent: LoginFormUI
  };
  return /*#__PURE__*/React.createElement(LoginFormController, loginProps);
};
//# sourceMappingURL=index.js.map