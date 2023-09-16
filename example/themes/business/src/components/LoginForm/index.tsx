import React, { useEffect, useState, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Keyboard,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Recaptcha from 'react-native-recaptcha-that-works'
import ReCaptcha from '@fatnlazycat/react-native-recaptcha-v3'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ToastType,
  useToast,
  LoginForm as LoginFormController,
  useLanguage,
  useConfig,
  useApi
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
  LoginWith,
  ButtonsWrapper,
  FormInput,
  TabsContainer,
  OrSeparator,
  LineSeparator,
  RecaptchaButton,
  TabBtn,
  OTab
} from './styles';
import { _setStoreData } from '../../providers/StoreUtil'
import { OText, OButton, OInput, OIconButton, OModal } from '../shared';
import { PhoneInputNumber } from '../PhoneInputNumber';
import { VerifyPhone } from '../VerifyPhone';
import { LoginParams } from '../../types';
import RNRestart from 'react-native-restart'

import { Otp } from './Otp'
import Alert from '../../../../../src/providers/AlertProvider'

const LoginFormUI = (props: LoginParams) => {
  const {
    navigation,
    formState,
    handleButtonLoginClick,
    onNavigationRedirect,
    loginTab,
    useLoginByCellphone,
    useLoginByEmail,
    handleSendVerifyCode,
    verifyPhoneState,
    checkPhoneCodeState,
    handleCheckPhoneCode,
    setCheckPhoneCodeState,
    allowedLevels,
    useRootPoint,
    notificationState,
    handleReCaptcha,
    enableReCaptcha,

    useLoginOtp,
    otpType,
    setOtpType,
    generateOtpCode,
    useLoginOtpEmail,
    useLoginOtpCellphone,
  } = props;

  const [ordering, { setOrdering }] = useApi();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const theme = useTheme();
  const [{ configs }] = useConfig();
  const { control, handleSubmit, errors, clearErrors } = useForm();

  const scrollRefTab = useRef() as React.MutableRefObject<ScrollView>;
  const inputRef = useRef<any>(null);
  const inputMailRef = useRef<any>(null);

  const [projectName, setProjectName] = useState({ name: '', isFocued: false });
  const [passwordSee, setPasswordSee] = useState(false);
  const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });
  const [windowWidth, setWindowWidth] = useState(
    parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
  );
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const [recaptchaConfig, setRecaptchaConfig] = useState<any>({})
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)

  const recaptchaRef = useRef<any>({});

  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false)
  const [alertState, setAlertState] = useState({ open: false, title: '', content: [] })
  const isOtpEmail = loginTab === 'otp' && otpType === 'email'
  const isOtpCellphone = loginTab === 'otp' && otpType === 'cellphone'

  const handleOpenRecaptcha = () => {
    setRecaptchaVerified(false)
    if (!recaptchaConfig?.siteKey) {
      showToast(ToastType.Error, t('NO_RECAPTCHA_SITE_KEY', 'The config doesn\'t have recaptcha site key'));
      return
    }
    if (!recaptchaConfig?.baseUrl) {
      showToast(ToastType.Error, t('NO_RECAPTCHA_BASE_URL', 'The config doesn\'t have recaptcha base url'));
      return
    }
    recaptchaRef.current.open()
  }

  const onRecaptchaVerify = (token: any) => {
    setRecaptchaVerified(true)
    handleReCaptcha({ code: token, version: recaptchaConfig?.version })
  }

  useEffect(() => {
    if (configs && Object.keys(configs).length > 0 && enableReCaptcha) {
      if (configs?.security_recaptcha_type?.value === 'v3' &&
        configs?.security_recaptcha_score_v3?.value > 0 &&
        configs?.security_recaptcha_site_key_v3?.value
      ) {
        setRecaptchaConfig({
          version: 'v3',
          siteKey: configs?.security_recaptcha_site_key_v3?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        return
      }
      if (configs?.security_recaptcha_site_key?.value) {
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
      }
    }
  }, [configs, enableReCaptcha])

  useEffect(() => {
    const projectInputInterval = setInterval(() => {
      if (projectName.name && useRootPoint && projectName.isFocued) {
        setOrdering({
          ...ordering,
          project: projectName.name
        })
      }
    }, 1500)
    return () => clearInterval(projectInputInterval);
  }, [projectName])

  const getTraduction = (key: string) => {
    const keyList: any = {
      // Add the key and traduction that you need below
      ERROR_ORDER_WITHOUT_CART: 'The order was placed without a cart',
      ERROR_INVALID_COUPON: "The coupon doesn't exist",
      ERROR_IVALID_COUPON_MINIMUM:
        'You must have more products in your cart to use the coupon',
      ERROR_ADD_PRODUCT_VERY_FAR_FOR_PICKUP:
        'The business is too far for order type pickup',
      ERROR_PLACE_PAY_WITH_CARD2:
        'An error occurred while trying to pay by card',
      ERROR_ADD_PRODUCT_BUSINESS_CLOSED: 'The business is closed at the moment',
      INTERNAL_ERROR: 'Server Error, please wait, we are working to fix it',
      ERROR_NOT_FOUND_BUSINESSES: 'No businesses found near your location',
      YOU_DO_NOT_HAVE_PERMISSION: 'You do not have permission',
      INVALID_CODE: 'Invalid verify code',
      STRIPE_ERROR: 'Payment service error. Try again later.',
      ERROR_AUTH_TWILIO_DISABLED: 'Auth error, twilio is disabled',
      ERROR_CART_SELECT_PAYMETHOD: 'An error occurred with selected pay method',
      ERROR_YOU_HAVE_ACTIVE_CART: "You can't reorder this cart",
      ERROR_YOU_HAVE_NOT_CART: 'Cart not found',
      ERROR_PLACE_PAY_WITH_REDIRECT:
        'An error occurred while trying to pay by redirect',
      ERROR_PLACE_PAY_WITH_CARD1:
        'An error occurred while trying to pay by card',
      ERROR_PLACE_PAY_WITH_PAYPAL_CAPTURE:
        'An error occurred while trying to pay by PayPal',
      ERROR_ADD_PRODUCT_VERY_FAR_FOR_DELIVERY:
        'Error adding product, very far for delivery',
      ERROR_AUTH_DRIVER_LOGIN_VALIDATION: 'Error auth driver login validation'
    };

    return keyList[key] ? t(key, keyList[key]) : t(key);
  };

  const handleChangeTab = (val: string) => {
    setPhoneInputData({ ...phoneInputData, error: '' });
    clearErrors([val]);
    props.handleChangeTab(val);

    if (loginTab === 'email') {
      scrollRefTab?.current?.scrollToEnd && scrollRefTab.current?.scrollToEnd({ animated: true });
    }

    if (loginTab === 'cellphone') {
      scrollRefTab?.current?.scrollTo && scrollRefTab.current?.scrollTo({ animated: true });
    }
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  const handleLogin = () => {
    setLoading(true);

    handleSubmit(onSubmit)();
  };

  const mainLogin = (values : any, isSubmitted?: boolean) => {
    if (loginTab === 'otp') {
      if (phoneInputData.error && (loginTab !== 'otp' || (otpType === 'cellphone' && loginTab === 'otp'))) {
        showToast(ToastType.Error, t('INVALID_PHONE_NUMBER', 'Invalid phone number'));
        return
      }
      if (loginTab === 'otp') {
        generateOtpCode({
          ...values,
          ...phoneInputData.phone
        })
      }
      setWillVerifyOtpState(true)
    } else {
      if (phoneInputData.error) {
        showToast(ToastType.Error, phoneInputData.error);
        return;
      }
      handleButtonLoginClick({
        ...values,
        ...phoneInputData.phone,
      }, isSubmitted ? () => RNRestart.Restart() : () => { });
    }
  }

  const onSubmit = (values: any) => {
    Keyboard.dismiss();

    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (values?.project_name) {
      setOrdering({
        ...ordering,
        project: values?.project_name
      })
      _setStoreData('project_name', values?.project_name)
      setFormValues({ ...values, ...phoneInputData.phone })
      setSubmitted(true)
      return
    }
    mainLogin(values, true)
  };

  const handleChangeOtpType = (type: string) => {
    handleChangeTab('otp', type)
    setOtpType(type)
  }

  const handleLoginOtp = (code: string) => {
    handleButtonLoginClick({ code })
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      title: '',
      content: []
    })
  }

  const handleVerifyCodeClick = () => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (
      !phoneInputData.error &&
      !phoneInputData.phone.country_phone_code &&
      !phoneInputData.phone.cellphone
    ) {
      showToast(
        ToastType.Error,
        t(
          'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
          'The field Mobile phone is required.',
        ),
      );
      return;
    }

    handleSendVerifyCode && handleSendVerifyCode(phoneInputData.phone);
    setIsLoadingVerifyModal(true);
  };

  useEffect(() => {
    if (!formState?.loading && formState?.result?.error) {
      if (formState.result?.result?.[0] === 'ERROR_AUTH_VERIFICATION_CODE') {
        setRecaptchaVerified(false)
        setSubmitted(false)
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        showToast(ToastType.Info, t('TRY_AGAIN', 'Please try again'))
        return
      }
      formState.result?.result && showToast(
        ToastType.Error,
        typeof formState.result?.result === 'string'
          ? formState.result?.result
          : formState.result?.result[0]
      )
      setSubmitted(false)
    }
    if (!formState?.loading && !formState?.result?.error) {
      setWillVerifyOtpState(false)
    }
  }, [formState]);

  useEffect(() => {
    if (verifyPhoneState && !verifyPhoneState?.loading) {
      if (verifyPhoneState.result?.error) {
        const message =
          typeof verifyPhoneState?.result?.result === 'string'
            ? verifyPhoneState?.result?.result
            : verifyPhoneState?.result?.result[0];
        verifyPhoneState.result?.result && showToast(ToastType.Error, message);
        setIsLoadingVerifyModal(false);
        return;
      }

      const okResult = verifyPhoneState.result?.result === 'OK';
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
        list.unshift({ message: phoneInputData.error });
      }

      if (
        loginTab === 'cellphone' &&
        !phoneInputData.error &&
        !phoneInputData.phone.country_phone_code &&
        !phoneInputData.phone.cellphone
      ) {
        list.unshift({
          message: t(
            'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
            'The field Mobile phone is required.',
          ),
        });
      }

      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });

      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  useEffect(() => {
    if (loading && !formState?.loading) {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (ordering.project === null || !submitted || !useRootPoint) return
    const values: any = formValues
    if (values?.project_name) {
      delete values.project_name
    }
    mainLogin(values)
    setSubmitted(false)
  }, [ordering, submitted])

  useEffect(() => {
    if (checkPhoneCodeState?.result?.error) {
      setAlertState({
        open: true,
        content: t(checkPhoneCodeState?.result?.error, checkPhoneCodeState?.result?.error),
        title: ''
      })
    }
  }, [checkPhoneCodeState])

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    setWindowWidth(
      parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
    );

    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 40,
    },
    header: {
      marginBottom: 30,
      justifyContent: 'space-between',
      width: '100%',
    },
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
      marginBottom: 25,
    },
    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 26,
      color: theme.colors.textGray,
    },
    btnTab: {
      flex: 1,
      minWidth: 88,
      alignItems: 'center',
    },
    btnTabText: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontSize: 16,
      marginBottom: 10,
      paddingLeft: 8,
      paddingRight: 8,
    },
    input: {
      color: theme.colors.arrowColor,
      marginBottom: 20,
      borderWidth: 1,
      borderRadius: 7.6,
      borderColor: theme.colors.inputSignup,
      backgroundColor: theme.colors.transparent,
      minHeight: 50,
      maxHeight: 50
    },
    btn: {
      borderRadius: 7.6,
      height: 44,
    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    btnFlag: {
      width: 79,
      borderWidth: 1,
      borderRadius: 7.6,
      marginRight: 9,
      borderColor: theme.colors.inputSignup,
    },
    textForgot: {
      color: theme.colors.arrowColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 16,
    },

    borderStyleBase: {
      width: 30,
      height: 45
    },
    borderStyleHighLighted: {
      borderColor: "#03DAC6",
    },
    underlineStyleBase: {
      width: 45,
      height: 60,
      borderWidth: 1,
      fontSize: 16
    },
    underlineStyleHighLighted: {
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      fontSize: 16
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <OIconButton
          icon={theme.images.general.arrow_left}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 20, height: 20 }}
          style={styles.arrowLeft}
          onClick={() => navigation?.canGoBack() && navigation.goBack()}
        />

        <OText style={styles.title}>{t('LOGIN', 'Login')}</OText>
      </View>

      {(Number(useLoginByEmail) + Number(useLoginByCellphone) + Number(useLoginOtpEmail) + Number(useLoginOtpCellphone) > 1) && (
        <LoginWith>
          <ScrollView
            ref={scrollRefTab}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal>
            <TabsContainer width={windowWidth - 42}>
              {useLoginByEmail && (
                <Pressable
                  style={styles.btnTab}
                  onPress={() => handleChangeTab('email')}>
                  <OText
                    style={styles.btnTabText}
                    color={
                      loginTab === 'email'
                        ? theme.colors.textGray
                        : theme.colors.unselectText
                    }
                    weight={loginTab === 'email' ? '600' : 'normal'}>
                    {t('BY_EMAIL', 'by Email')}
                  </OText>

                  <View
                    style={{
                      width: '100%',
                      borderBottomColor:
                        loginTab === 'email'
                          ? theme.colors.textGray
                          : theme.colors.tabBar,
                      borderBottomWidth: 2,
                    }}></View>
                </Pressable>
              )}

              {useLoginByCellphone && (
                <Pressable
                  style={styles.btnTab}
                  onPress={() => handleChangeTab('cellphone')}>
                  <OText
                    style={styles.btnTabText}
                    color={
                      loginTab === 'cellphone'
                        ? theme.colors.textGray
                        : theme.colors.unselectText
                    }
                    weight={loginTab === 'cellphone' ? '600' : 'normal'}>
                    {t('BY_PHONE', 'by Phone')}
                  </OText>

                  <View
                    style={{
                      width: '100%',
                      borderBottomColor:
                        loginTab === 'cellphone'
                          ? theme.colors.textGray
                          : theme.colors.tabBar,
                      borderBottomWidth: 2,
                    }}></View>
                </Pressable>
              )}

              {useLoginOtpEmail && (
                <Pressable
                  style={styles.btnTab}
                  onPress={() => handleChangeOtpType('email')}>
                  <OText
                    style={styles.btnTabText}
                    color={
                      isOtpEmail
                        ? theme.colors.textNormal
                        : theme.colors.disabled
                    }
                    weight={isOtpEmail ? 'bold' : 'normal'}>
                    {t('BY_OTP_EMAIL', 'By Otp Email')}
                  </OText>
                  <View
                    style={{
                      width: '100%',
                      borderBottomColor:
                        isOtpEmail
                          ? theme.colors.textGray
                          : theme.colors.tabBar,
                      borderBottomWidth: 2,
                    }} />
                </Pressable>
              )}
              {useLoginOtpCellphone && (
                <Pressable
                  style={styles.btnTab}
                  onPress={() => handleChangeOtpType('cellphone')}>
                  <OText
                    style={styles.btnTabText}
                    color={
                      isOtpCellphone
                        ? theme.colors.textNormal
                        : theme.colors.disabled
                    }
                    weight={isOtpCellphone ? 'bold' : 'normal'}>
                    {t('BY_OTP_PHONE', 'By Otp Phone')}
                  </OText>
                  <View
                    style={{
                      width: '100%',
                      borderBottomColor:
                        isOtpCellphone
                          ? theme.colors.textGray
                          : theme.colors.tabBar,
                      borderBottomWidth: 2,
                    }} />
                </Pressable>
              )}
            </TabsContainer>
          </ScrollView>
        </LoginWith>
      )}

      {(useLoginByCellphone || useLoginByEmail || useLoginOtp) && (
        <FormInput>
          {useRootPoint && (
            <Controller
              control={control}
              name='project_name'
              rules={{ required: t(`VALIDATION_ERROR_PROJECT_NAME_REQUIRED`, 'The field project name is required') }}
              defaultValue=""
              render={({ onChange, value }: any) => (
                <OInput
                  name='project_name'
                  placeholderTextColor={theme.colors.arrowColor}
                  placeholder={t('PROJECT_NAME', 'Project Name')}
                  icon={theme.images.general.project}
                  iconColor={theme.colors.arrowColor}
                  onChange={(e: any) => {
                    setProjectName({ name: e?.target?.value, isFocued: true })
                    onChange(e?.target?.value);
                    setSubmitted(false);
                  }}
                  selectionColor={theme.colors.primary}
                  color={theme.colors.textGray}
                  value={value}
                  style={styles.input}
                  returnKeyType='next'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onSubmitEditing={() => inputMailRef.current?.focus()}
                  blurOnSubmit={false}
                />
              )}
            />
          )}

          {((useLoginByEmail && loginTab === 'email') || (loginTab === 'otp' && otpType === 'email')) && (
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  placeholder={t('EMAIL', 'Email')}
                  placeholderTextColor={theme.colors.arrowColor}
                  style={styles.input}
                  icon={theme.images.logos.emailInputIcon}
                  iconColor={theme.colors.arrowColor}
                  onChange={(e: any) => {
                    setProjectName({ ...projectName, isFocued: false })
                    handleChangeInputEmail(e, onChange);
                  }}
                  selectionColor={theme.colors.primary}
                  color={theme.colors.textGray}
                  value={value}
                  autoCapitalize="none"
                  autoCorrect={false}
                  type="email-address"
                  autoCompleteType="email"
                  forwardRef={inputMailRef}
                  returnKeyType="next"
                  onSubmitEditing={() => inputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              )}
              name="email"
              rules={{
                required: t(
                  'VALIDATION_ERROR_EMAIL_REQUIRED',
                  'The field Email is required',
                ).replace('_attribute_', t('EMAIL', 'Email')),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t(
                    'INVALID_ERROR_EMAIL',
                    'Invalid email address',
                  ).replace('_attribute_', t('EMAIL', 'Email')),
                },
              }}
              defaultValue=""
            />
          )}

          {((useLoginByCellphone && loginTab === 'cellphone') || (loginTab === 'otp' && otpType === 'cellphone')) && (
            <View style={{ marginBottom: 20 }}>
              <PhoneInputNumber
                data={phoneInputData}
                handleData={(val: any) => setPhoneInputData(val)}
                flagProps={styles.btnFlag}
                onSubmitEditing={() => null}
                textInputProps={{
                  returnKeyType: 'next',
                  onSubmitEditing: () => inputRef?.current?.focus?.(),
                }}
              />
            </View>
          )}

          {loginTab !== 'otp' && (
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  isSecured={!passwordSee ? true : false}
                  placeholder={t('PASSWORD', 'Password')}
                  placeholderTextColor={theme.colors.arrowColor}
                  style={styles.input}
                  icon={theme.images.logos.passwordInputIcon}
                  iconColor={theme.colors.arrowColor}
                  iconCustomRight={
                    !passwordSee ? (
                      <MaterialCommunityIcons
                        name="eye-outline"
                        size={24}
                        color={theme.colors.arrowColor}
                        onPress={() => setPasswordSee(!passwordSee)}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="eye-off-outline"
                        size={24}
                        color={theme.colors.arrowColor}
                        onPress={() => setPasswordSee(!passwordSee)}
                      />
                    )
                  }
                  selectionColor={theme.colors.primary}
                  color={theme.colors.textGray}
                  value={value}
                  forwardRef={inputRef}
                  onChange={(val: any) => onChange(val)}
                  returnKeyType="done"
                  onSubmitEditing={() => handleLogin()}
                  blurOnSubmit
                />
              )}
              name="password"
              rules={{
                required: t(
                  'VALIDATION_ERROR_PASSWORD_REQUIRED',
                  'The field Password is required',
                ).replace('_attribute_', t('PASSWORD', 'Password')),
              }}
              defaultValue=""
            />
          )}

          {onNavigationRedirect && loginTab !== 'otp' && (
            <Pressable
              style={{ marginRight: 'auto', marginBottom: 20 }}
              onPress={() => onNavigationRedirect('Forgot')}>
              <OText style={styles.textForgot}>
                {t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
              </OText>
            </Pressable>
          )}
          {(enableReCaptcha && recaptchaConfig?.version) && (
            <>
              {recaptchaConfig?.version === 'v3' ? (
                <ReCaptcha
                  url={recaptchaConfig?.baseUrl}
                  siteKey={recaptchaConfig?.siteKey}
                  containerStyle={{ height: 40 }}
                  onExecute={onRecaptchaVerify}
                  reCaptchaType={1}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={{ marginBottom: 15 }}
                    onPress={handleOpenRecaptcha}
                  >
                    <RecaptchaButton>
                      {recaptchaVerified ? (
                        <MaterialCommunityIcons
                          name="checkbox-marked"
                          size={26}
                          color={theme.colors.primary}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="checkbox-blank-outline"
                          size={26}
                          color={theme.colors.mediumGray}
                        />
                      )}
                      <OText size={14} mLeft={8}>{t('VERIFY_ReCAPTCHA', 'Verify reCAPTCHA')}</OText>
                    </RecaptchaButton>
                  </TouchableOpacity>
                  <Recaptcha
                    ref={recaptchaRef}
                    siteKey={recaptchaConfig?.siteKey}
                    baseUrl={recaptchaConfig?.baseUrl}
                    onVerify={onRecaptchaVerify}
                    onExpire={() => setRecaptchaVerified(false)}
                  />
                </>)
              }
            </>
          )}
          <OButton
            onClick={handleLogin}
            text={loginTab !== 'otp' ? t('LOGIN', 'Login') : t('GET_VERIFY_CODE', 'Get verify code')}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            textStyle={styles.btnText}
            imgRightSrc={null}
            isLoading={formState?.loading || loading}
            style={styles.btn}
          />
        </FormInput>
      )}

      {useLoginByCellphone &&
        loginTab === 'cellphone' &&
        configs &&
        Object.keys(configs).length > 0 &&
        (configs?.twilio_service_enabled?.value === 'true' ||
          configs?.twilio_service_enabled?.value === '1') && (
          <>
            <OrSeparator>
              <LineSeparator />
              <OText size={18} mRight={20} mLeft={20}>
                {t('OR', 'Or')}
              </OText>
              <LineSeparator />
            </OrSeparator>

            <ButtonsWrapper mBottom={20}>
              <OButton
                onClick={handleVerifyCodeClick}
                text={t('GET_VERIFY_CODE', 'Get Verify Code')}
                borderColor={theme.colors.primary}
                style={styles.btn}
                imgRightSrc={null}
                isLoading={isLoadingVerifyModal}
                indicatorColor={theme.colors.primary}
              />
            </ButtonsWrapper>
          </>
        )}

      <OModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <VerifyPhone
          phone={phoneInputData.phone}
          verifyPhoneState={verifyPhoneState}
          checkPhoneCodeState={checkPhoneCodeState}
          handleCheckPhoneCode={handleCheckPhoneCode}
          setCheckPhoneCodeState={setCheckPhoneCodeState}
          handleVerifyCodeClick={handleVerifyCodeClick}
        />
      </OModal>
      <OModal
        open={willVerifyOtpState}
        onClose={() => setWillVerifyOtpState(false)}
        entireModal
        hideIcons
        title={t('ENTER_VERIFICATION_CODE', 'Enter verification code')}
      >
        <Otp
          willVerifyOtpState={willVerifyOtpState}
          setWillVerifyOtpState={setWillVerifyOtpState}
          handleLoginOtp={handleLoginOtp}
          onSubmit={handleLogin}
          setAlertState={setAlertState}
          formState={formState}
        />
      </OModal>
      <Alert
        open={alertState.open}
        content={alertState.content}
        title={alertState.title || ''}
        onAccept={closeAlert}
        onClose={closeAlert}
      />
    </View>
  );
};

export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    isRecaptchaEnable: true,
    UIComponent: LoginFormUI,
  };

  return <LoginFormController {...loginProps} />;
};

