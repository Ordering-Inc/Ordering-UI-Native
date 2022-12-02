import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Recaptcha from 'react-native-recaptcha-that-works'
import ReCaptcha from '@fatnlazycat/react-native-recaptcha-v3'

import {
  LoginForm as LoginFormController,
  useConfig,
  useLanguage,
  ToastType,
  useToast,
  useApi
} from 'ordering-components/native';

import {
  LoginWith,
  TabsContainer,
  WelcomeTextContainer,
  LogoWrapper,
  RecaptchaButton,
} from './styles';

import { OText, OButton, OInput, OIcon, OModal } from '../shared';
import { LoginParams } from '../../types';
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { _setStoreData } from '../../../../../src/providers/StoreUtil'
import { Otp } from './Otp'
import Alert from '../../../../../src/providers/AlertProvider'
import { PhoneInputNumber } from '../PhoneInputNumber'

const LoginFormUI = (props: LoginParams) => {
  const {
    loginButtonText,
    formState,
    handleButtonLoginClick,
    useRootPoint,
    handleReCaptcha,
    enableReCaptcha,
    checkPhoneCodeState,
    useLoginByCellphone,
    useLoginByEmail,
    loginTab,
		otpType,
		setOtpType,
		generateOtpCode,
		useLoginOtpEmail,
		useLoginOtpCellphone,
  } = props;

  const theme = useTheme()
  const [{ configs }] = useConfig()
  const [ordering, { setOrdering }] = useApi();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [recaptchaConfig, setRecaptchaConfig] = useState<any>({})
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const recaptchaRef = useRef<any>({});
  const { control, handleSubmit, formState: { errors }, clearErrors } = useForm();
  const [orientationState] = useDeviceOrientation();

  const [formsStateValues, setFormsStateValues] = useState<any>({ isSubmitted: false })

  const scrollRefTab = useRef() as React.MutableRefObject<ScrollView>;
  const inputRef = useRef<any>(null);
  const [windowWidth, setWindowWidth] = useState(
    parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
  );
  const [projectName, setProjectName] = useState('');
  const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false)
  const [alertState, setAlertState] = useState({ open: false, title: '', content: [] })
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });

  const isOtpEmail = loginTab === 'otp' && otpType === 'email'
	const isOtpCellphone = loginTab === 'otp' && otpType === 'cellphone'

  const mainLogin = (values) => {
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
			});
		}
  }

  const onSubmit = (values: any) => {
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
      setFormsStateValues({
        ...formsStateValues,
        isSubmitted: true,
        values
      })
      return
    }

    mainLogin(values)
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

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
    handleReCaptcha && handleReCaptcha({ code: token, version: recaptchaConfig?.version })
  }

  const styles = StyleSheet.create({
    logo: {
      height: 80,
      width: 250,
      marginTop: 10
    },
    welcomeTextB: {
      marginBottom: 5
    },
    inputStyle: {
      borderRadius: 4,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      minHeight: 44,
      maxHeight: 44
    },
    forgotStyle: {
      textAlign: 'center',
      fontWeight: '600',
      color: theme.colors.skyBlue,
      marginTop: orientationState?.dimensions?.height * 0.03,
    },
    btn: {
      borderRadius: 7.6,
      height: 44,
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
    btnFlag: {
      width: 79,
      borderWidth: 1,
      borderRadius: 7.6,
      marginRight: 9,
      borderColor: theme.colors.inputSignup,
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

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      if (formState.result?.result?.[0] === 'ERROR_AUTH_VERIFICATION_CODE') {
        setRecaptchaVerified(false)
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        showToast(ToastType.Info, t('TRY_AGAIN', 'Please try again'))
        setFormsStateValues({
          ...formsStateValues,
          isSubmitted: false,
        })
        return
      }
      formState.result?.result && showToast(
        ToastType.Error,
        typeof formState.result?.result === 'string'
          ? formState.result?.result
          : formState.result?.result[0]
      )
      setFormsStateValues({
        ...formsStateValues,
        isSubmitted: false,
      })
    }
  }, [formState]);

  useEffect(() => {
    if (ordering.project === null || !formsStateValues.isSubmitted || !useRootPoint) return
    const values: any = formsStateValues.values
    if (values?.project_name) {
      delete values.project_name
    }
    mainLogin(values)
    setFormsStateValues({
      ...formsStateValues,
      isSubmitted: false,
    })
  }, [ordering, formsStateValues.isSubmitted])


  useEffect(() => {
    if (Object.keys(errors)?.length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

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

  const handleChangeTab = (val: string) => {
    setPhoneInputData({ ...phoneInputData, error: '' });
    clearErrors([val]);
    props.handleChangeTab(val);

    if (loginTab === 'email') {
      scrollRefTab.current?.scrollToEnd({ animated: true });
    }

    if (loginTab === 'cellphone') {
      scrollRefTab.current?.scrollTo({ animated: true });
    }
  };

  const handleChangeOtpType = (type: string) => {
		handleChangeTab('otp', type)
		setOtpType(type)
	}

	const handleLoginOtp = (code: string) => {
		handleButtonLoginClick({ code })
		setWillVerifyOtpState(false)
	}

	const closeAlert = () => {
		setAlertState({
			open: false,
			title: '',
			content: []
		})
	}

  useEffect(() => {
		if (checkPhoneCodeState?.result?.error) {
			setAlertState({
				open: true,
				content: t(checkPhoneCodeState?.result?.error, checkPhoneCodeState?.result?.error),
				title: ''
			})
		}
	}, [checkPhoneCodeState])

  useEffect(() => {
    const projectInputTimeout = setTimeout(() => {
      if (projectName && useRootPoint) {
        setOrdering({
          ...ordering,
          project: projectName
        })
      }
    }, 1500)
    return () => clearTimeout(projectInputTimeout);
  }, [projectName])

  const logo = (
    <LogoWrapper>
      <OIcon src={theme.images.logos.logotype} style={styles.logo} />
    </LogoWrapper>
  );

  const welcome = (
    <WelcomeTextContainer>
      <OText
        size={orientationState?.dimensions?.width * 0.04}
      >
        {t('WELCOME_TEXT_A', 'Hi There!')}
      </OText>

      <OText
        size={orientationState?.dimensions?.width * 0.048}
        weight={'700'}
      >
        {t('WELCOME_TEXT_B', 'Login To start')}
      </OText>

      <OText
        size={orientationState?.dimensions?.width * 0.035}
      >
        {t('WELCOME_TEXT_C', 'You just need to login once.')}
      </OText>
    </WelcomeTextContainer>
  );

  const note = (
    <OText size={24} mBottom={18}>
      {t('IF_NOT_HAVE_ACCOUNT', 'If you don\'t have and account, please contact Ordering')}&nbsp;
      <OText size={24} mBottom={18} color={theme.colors.skyBlue}>
        {t('SUPPORT_DEPARTMENT', 'support department')}
      </OText>
    </OText>
  )

  return (
    <View>
      <View
        style={{
          flexDirection: orientationState?.orientation === PORTRAIT ? 'column' : 'row',
          height: orientationState?.dimensions?.height - 40,
          alignItems: 'center',
        }}
      >
        {orientationState?.orientation === PORTRAIT && (
          <View style={{ flexGrow: 1.5, justifyContent: 'center' }}>
            {logo}
          </View>
        )}

        <View
          style={{
            paddingHorizontal: orientationState?.orientation === LANDSCAPE ? 30 : 0,
            minWidth: orientationState?.orientation === PORTRAIT
              ? orientationState?.dimensions?.width * 0.6
              : orientationState?.dimensions?.width * 0.4,
            flexGrow: orientationState?.orientation === LANDSCAPE
              ? 0 : 0,
          }}
        >
          {welcome}
          {orientationState?.orientation === LANDSCAPE && (
            <View style={{
              justifyContent: 'flex-end',
              maxWidth: orientationState?.dimensions?.width * 0.4,
            }}>
              {note}
            </View>
          )}
        </View>

        <View
          style={{
            paddingHorizontal: orientationState?.orientation === LANDSCAPE ? 30 : 0,
            minWidth: orientationState?.orientation === PORTRAIT
              ? orientationState?.dimensions?.width * 0.6
              : orientationState?.dimensions?.width * 0.4,
            flexGrow: orientationState?.orientation === LANDSCAPE
              ? 10 : 1,
          }}
        >
          {orientationState?.orientation === LANDSCAPE && (
            <View style={{ marginBottom: orientationState?.dimensions?.height * 0.05 }}>
              {logo}
            </View>
          )}

          {(Number(useLoginByEmail) + Number(useLoginByCellphone) + Number(useLoginOtpEmail) + Number(useLoginOtpCellphone) > 1) && (
            <LoginWith>
              <ScrollView
                ref={scrollRefTab}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{
                  width: orientationState?.orientation === LANDSCAPE ? orientationState?.dimensions?.width * 0.4 : windowWidth - 42
                }}
              >
                <TabsContainer
                  width={orientationState?.orientation === LANDSCAPE ? orientationState?.dimensions?.width * 0.4 : windowWidth - 42}
                >
                  {useLoginByEmail && (
                    <Pressable
                      style={styles.btnTab}
                      onPress={() => handleChangeTab('email')}>
                      <OText
                        style={styles.btnTabText}
                        color={
                          loginTab === 'email'
                            ? theme.colors.black
                            : theme.colors.lightGray
                        }
                        weight={loginTab === 'email' ? '600' : 'normal'}>
                        {t('BY_EMAIL', 'by Email')}
                      </OText>

                      <View
                        style={{
                          width: '100%',
                          borderBottomColor:
                            loginTab === 'email'
                              ? theme.colors.black
                              : theme.colors.border,
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
                            ? theme.colors.black
                            : theme.colors.lightGray
                        }
                        weight={loginTab === 'cellphone' ? '600' : 'normal'}>
                        {t('BY_PHONE', 'by Phone')}
                      </OText>

                      <View
                        style={{
                          width: '100%',
                          borderBottomColor:
                            loginTab === 'cellphone'
                              ? theme.colors.black
                              : theme.colors.border,
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
                            ? theme.colors.black
                            : theme.colors.lightGray
                        }
                        weight={isOtpEmail ? '600' : 'normal'}>
                        {t('BY_OTP_EMAIL', 'By Otp Email')}
                      </OText>
                      <View
                        style={{
                          width: '100%',
                          borderBottomColor:
                            isOtpEmail
                              ? theme.colors.black
                              : theme.colors.border,
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
                            ? theme.colors.black
                            : theme.colors.lightGray
                        }
                        weight={isOtpCellphone ? '600' : 'normal'}>
                        {t('BY_OTP_PHONE', 'By Otp Phone')}
                      </OText>
                      <View
                        style={{
                          width: '100%',
                          borderBottomColor:
                          isOtpCellphone
                              ? theme.colors.black
                              : theme.colors.border,
                          borderBottomWidth: 2,
                        }} />
                    </Pressable>
                  )}
                </TabsContainer>
              </ScrollView>
            </LoginWith>
          )}

          {useRootPoint && (
            <Controller
              control={control}
              name='project_name'
              rules={{ required: t(`VALIDATION_ERROR_PROJECT_NAME_REQUIRED`, 'The field project name is required') }}
              defaultValue=""
              render={({ onChange, value }: any) => (
                <OInput
                  name='project_name'
                  placeholder={t('PROJECT_NAME', 'Project Name')}
                  style={styles.inputStyle}
                  value={value}
                  autoCapitalize='none'
                  autoCorrect={false}
                  inputStyle={{ textAlign: 'center' }}
                  onChange={(e: any) => {
                    setProjectName(e?.target?.value)
                    onChange(e?.target?.value);
                    setFormsStateValues({
                      ...formsStateValues,
                      isSubmitted: false,
                    })
                  }}
                />
              )}
            />
          )}

          {((useLoginByEmail && loginTab === 'email') || (loginTab === 'otp' && otpType === 'email')) && (
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  placeholder={t('USER', 'User')}
                  style={styles.inputStyle}
                  value={value}
                  autoCapitalize="none"
                  autoCorrect={false}
                  type="email-address"
                  inputStyle={{ textAlign: 'center' }}
                  onChange={(e: any) => {
                    handleChangeInputEmail(e, onChange);
                  }}
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
                  isSecured={true}
                  placeholder={t('PASSWORD', 'Password')}
                  style={styles.inputStyle}
                  value={value}
                  onChange={(val: any) => onChange(val)}
                  inputStyle={{ textAlign: 'center' }}
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
              forwardRef={inputRef}
            />
          )}

          {(recaptchaConfig?.version) && (
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
            onClick={handleSubmit(onSubmit)}
            text={loginTab !== 'otp' ? loginButtonText : t('GET_VERIFY_CODE', 'Get verify code')}
            imgRightSrc={null}
            isLoading={formState.loading}
            style={{ borderRadius: 0 }}
            textStyle={{ fontSize: 24 }}
          />
        </View>

        {orientationState?.orientation === PORTRAIT && (
          <View style={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            maxWidth: orientationState?.dimensions?.width * 0.6,
          }}>
            {note}
          </View>
        )}
      </View>
      <OModal
				open={willVerifyOtpState}
				onClose={() => setWillVerifyOtpState(false)}
				entireModal
				title={t('ENTER_VERIFICATION_CODE', 'Enter verification code')}
			>
				<Otp
					willVerifyOtpState={willVerifyOtpState}
					setWillVerifyOtpState={setWillVerifyOtpState}
					handleLoginOtp={handleLoginOtp}
					onSubmit={onSubmit}
					setAlertState={setAlertState}
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
    UIComponent: LoginFormUI,
    isRecaptchaEnable: true
  };
  return <LoginFormController {...loginProps} />;
};
