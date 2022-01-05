import React, { useEffect, useState, useRef } from 'react';
import { Pressable, StyleSheet, View, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import { PhoneInputNumber } from '../PhoneInputNumber'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  LoginForm as LoginFormController,
  useLanguage,
  useConfig,
  useSession,
  ToastType,
  useToast
} from 'ordering-components/native';

import { FacebookLogin } from '../FacebookLogin';
import { VerifyPhone } from '../VerifyPhone';

import {
  Container,
  ButtonsWrapper,
  LoginWith,
  FormSide,
  FormInput,
  OTabs,
  OTab,
  SocialButtons,
  OrSeparator,
  LineSeparator  
} from './styles';

import { _removeStoreData } from '../../providers/StoreUtil';
import NavBar from '../NavBar'

import { OText, OButton, OInput, OModal } from '../shared';
import { LoginParams } from '../../types';
import { useTheme } from 'styled-components/native';

const LoginFormUI = (props: LoginParams) => {
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
    onNavigationRedirect,
    notificationState
  } = props

  const theme = useTheme()

  const loginStyle = StyleSheet.create({
    btnOutline: {
      backgroundColor: '#FFF',
      color: theme.colors.primary,
      borderRadius: 0
    },
    inputStyle: {
      marginBottom: 25,
      backgroundColor: theme.colors.backgroundGray,
      borderRadius: 0
    },
    wrapperTxt: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: 8
    },
    linkTxt: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 40
    }
  });

  const [, { showToast }] = useToast()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [, { login }] = useSession()
  const { control, handleSubmit, errors } = useForm();
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

  const inputRef = useRef<any>({})

  const handleChangeTab = (val: string) => {
    props.handleChangeTab(val);
    setPasswordSee(false);
  }

  const onSubmit = (values: any) => {
    Keyboard.dismiss()
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return
    }
    handleButtonLoginClick({
      ...values,
      ...phoneInputData.phone
    });
  }

  const handleVerifyCodeClick = () => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return
    }
    if (
      !phoneInputData.error &&
      !phoneInputData.phone.country_phone_code &&
      !phoneInputData.phone.cellphone
    ) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.'))
      return
    }
    handleSendVerifyCode && handleSendVerifyCode(phoneInputData.phone)
    setIsLoadingVerifyModal(true)
  }

  const handleSuccessFacebook = (user: any) => {
    _removeStoreData('isGuestUser')
    login({
      user,
      token: user.session.access_token
    })
  }

  const handleChangeInputEmail = (value : string, onChange : any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
  }

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      formState.result?.result && showToast(
        ToastType.Error,
        typeof formState.result?.result === 'string'
          ? formState.result?.result
          : formState.result?.result[0]
      )
    }
  }, [formState])

  useEffect(() => {
    if (verifyPhoneState && !verifyPhoneState?.loading) {
      if (verifyPhoneState.result?.error) {
        const message = typeof verifyPhoneState?.result?.result === 'string'
          ? verifyPhoneState?.result?.result
          : verifyPhoneState?.result?.result[0]
        verifyPhoneState.result?.result && showToast(
          ToastType.Error,
          message
        )
        setIsLoadingVerifyModal(false)
        return
      }

      const okResult = verifyPhoneState.result?.result === 'OK'
      if (okResult) {
        !isModalVisible && setIsModalVisible(true)
        setIsLoadingVerifyModal(false)
      }
    }
  }, [verifyPhoneState])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors)
      let stringError = ''
      if (phoneInputData.error) {
        list.unshift({ message: phoneInputData.error })
      }
      if (
        loginTab === 'cellphone' &&
        !phoneInputData.error &&
        !phoneInputData.phone.country_phone_code &&
        !phoneInputData.phone.cellphone
      ) {
        list.unshift({ message: t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.') })
      }
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      })
      showToast(ToastType.Error, stringError)
    }
  }, [errors])

  return (
    <Container>
      <NavBar
        title={t('SIGN_IN', 'Sign in')}
        titleAlign={'center'}
        onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
        showCall={false}
        style={{ marginHorizontal: 10 }}
        paddingTop={0}
      />
      <FormSide>
        {useLoginByEmail && useLoginByCellphone && (
          <LoginWith>
            <OTabs>
              {useLoginByEmail && (
                <Pressable onPress={() => handleChangeTab('email')}>
                  <OTab>
                    <OText size={16} numberOfLines={2} color={loginTab === 'email' ? theme.colors.primary : theme.colors.disabled}>
                      {t('BY_EMAIL', 'by Email')}
                    </OText>
                  </OTab>
                </Pressable>
              )}
              {useLoginByCellphone && (
                <Pressable onPress={() => handleChangeTab('cellphone')}>
                  <OTab>
                    <OText size={16} color={loginTab === 'cellphone' ? theme.colors.primary : theme.colors.disabled}>
                      {t('BY_PHONE', 'by Phone')}
                    </OText>
                  </OTab>
                </Pressable>
              )}
            </OTabs>
          </LoginWith>
        )}

        {(useLoginByCellphone || useLoginByEmail) && (
          <FormInput>
            {useLoginByEmail && loginTab === 'email' && (
              <>
                <OText size={14} weight={500} mBottom={8} style={{ textAlign: 'left' }}>
                  {t('EMAIL', 'Email')}
                </OText>
                <Controller
                  control={control}
                  render={({ onChange, value }: any) => (
                    <OInput
                      placeholder={t('EMAIL', 'Email')}
                      style={loginStyle.inputStyle}
                      onChange={(e: any) => {
                        handleChangeInputEmail(e, onChange)
                      }}
                      value={value}
                      autoCapitalize='none'
                      autoCorrect={false}
                      type='email-address'
                      autoCompleteType='email'
                      returnKeyType='next'
                      onSubmitEditing={() => inputRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  )}
                  name="email"
                  rules={{
                    required: t('VALIDATION_ERROR_EMAIL_REQUIRED', 'The field Email is required').replace('_attribute_', t('EMAIL', 'Email')),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
                    }
                  }}
                  defaultValue=""
                />
              </>
            )}
            {useLoginByCellphone && loginTab === 'cellphone' && (
              <View style={{ marginBottom: 25 }}>
                <OText size={14} weight={500} mBottom={8}>
                  {t('MOBILE_CHECKOUT_PHONE', 'Phone')}
                </OText>
                <PhoneInputNumber
                  data={phoneInputData}
                  handleData={(val: any) => setPhoneInputData(val)}
                  textInputProps={{
                    returnKeyType: 'next',
                    onSubmitEditing: () => inputRef?.current?.focus?.(),
                  }}
                />
              </View>
            )}

            <View style={loginStyle.wrapperTxt}>
              <OText size={14} weight={500}>
                {t('PASSWORD', 'Password')}
              </OText>

              {onNavigationRedirect && forgotButtonText && (
                <Pressable onPress={() => onNavigationRedirect('Forgot')}>
                  <OText size={14} color={theme.colors.gray}>
                    {forgotButtonText}
                  </OText>
                </Pressable>
              )}
            </View>
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  isSecured={!passwordSee ? true : false}
                  placeholder={t('PASSWORD', 'Password')}
                  style={loginStyle.inputStyle}
                  iconCustomRight={
                    !passwordSee ?
                      <MaterialCommunityIcons name='eye-outline' size={24} onPress={() => setPasswordSee(!passwordSee)} /> :
                      <MaterialCommunityIcons name='eye-off-outline' size={24} onPress={() => setPasswordSee(!passwordSee)} />
                  }
                  value={value}
                  forwardRef={inputRef}
                  onChange={(val: any) => onChange(val)}
                  returnKeyType='done'
                  onSubmitEditing={handleSubmit(onSubmit)}
                  blurOnSubmit
                />
              )}
              name="password"
              rules={{ required: t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required').replace('_attribute_', t('PASSWORD', 'Password')) }}
              defaultValue=""
            />

            {onNavigationRedirect && registerButtonText && (
              <View style={loginStyle.linkTxt}>
                <OText size={14} space>
                  {t('NEW_ON_PLATFORM', 'New on Ordering?')}
                </OText>
                <Pressable onPress={() => onNavigationRedirect('Signup')}>
                  <OText size={14} color={theme.colors.green}>
                    {registerButtonText}
                  </OText>
                </Pressable>
              </View>
            )}

            <OButton
              onClick={handleSubmit(onSubmit)}
              text={loginButtonText}
              bgColor={theme.colors.primary}
              borderColor={theme.colors.primary}
              textStyle={{ color: 'white' }}
              style={{ borderRadius: 0 }}
              imgRightSrc={null}
              isLoading={formState.loading}
            />
          </FormInput>
        )}

        {useLoginByCellphone &&
          loginTab === 'cellphone' &&
          configs && Object.keys(configs).length > 0 &&
          (configs?.twilio_service_enabled?.value === 'true' ||
            configs?.twilio_service_enabled?.value === '1') &&
          (
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
                  style={loginStyle.btnOutline}
                  imgRightSrc={null}
                  isLoading={isLoadingVerifyModal}
                  indicatorColor={theme.colors.primary}
                />
              </ButtonsWrapper>
            </>
          )
        }

        {configs && Object.keys(configs).length > 0 && (
          (configs?.facebook_login?.value === 'true' ||
            configs?.facebook_login?.value === '1') &&
          configs?.facebook_id?.value &&
          (
            <ButtonsWrapper>
              <SocialButtons>
                <FacebookLogin
                  notificationState={notificationState}
                  handleErrors={(err: any) => showToast(ToastType.Error, err)}
                  handleLoading={(val: boolean) => setIsFBLoading(val)}
                  handleSuccessFacebookLogin={handleSuccessFacebook}
                />
              </SocialButtons>
            </ButtonsWrapper>
          )
        )}
      </FormSide>
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
      <Spinner visible={isFBLoading} />
    </Container>
  );
};


export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    UIComponent: LoginFormUI,
    handleSuccessLogin: () => _removeStoreData('isGuestUser')
  };
  return <LoginFormController {...loginProps} />;
};
