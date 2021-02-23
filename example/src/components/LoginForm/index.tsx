import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';

import {
  LoginForm as LoginFormController,
  useLanguage,
  useConfig,
  useSession
} from 'ordering-components/native';

import { FacebookLogin } from '../FacebookLogin'

import {
  ButtonsSection,
  LoginWith,
  FormSide,
  FormInput,
  OTabs,
  OTab,
  SocialButtons
} from './styles';

import { IMAGES } from '../../config/constants';
import { ToastType, useToast } from '../../providers/ToastProvider';
import NavBar from '../NavBar'

import { OText, OButton, OInput } from '../shared';
import { LoginParams } from '../../types';
import { colors } from '../../theme'

const LoginFormUI = (props: LoginParams) => {
  const {
    loginTab,
    formState,
    navigation,
    useLoginByEmail,
    useLoginByCellphone,
    loginButtonText,
    forgotButtonText,
    registerButtonText,
    handleChangeTab,
    handleButtonLoginClick,
    onNavigationRedirect
  } = props

  const { showToast } = useToast();
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [, { login }] = useSession()
  const { control, handleSubmit, errors } = useForm();

  const [isFBLoading, setIsFBLoading] = useState(false)

  const onSubmit = (values: any) => handleButtonLoginClick(values);

  const handleSuccessFacebook = (user: any) => {
    login({
      user,
      token: user.session.access_token
    })
    navigation.navigate('Home');
  }

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      formState.result?.result && showToast(
        ToastType.Error,
        formState.result?.result[0]
      )
    }
  }, [formState])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors)
      let stringError = ''
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      })
      showToast(ToastType.Error, stringError)
    }
  }, [errors])

  return (
    <View>
      <NavBar
        title={t('LOGIN', 'Login')}
        titleAlign={'center'}
        onActionLeft={() => navigation.goBack()}
        showCall={false}
        btnStyle={{ paddingLeft: 0 }}
        paddingTop={0}
      />
      <FormSide>
        {useLoginByEmail && useLoginByCellphone && (
          <LoginWith>
            <OTabs>
              {useLoginByEmail && (
                <Pressable onPress={() => handleChangeTab('email')}>
                  <OTab>
                    <OText size={18} color={loginTab === 'email' ? colors.primary : colors.disabled}>
                      {t('LOGIN_BY_EMAIL', 'Login by Email')}
                    </OText>
                  </OTab>
                </Pressable>
              )}
              {useLoginByCellphone && (
                <Pressable onPress={() => handleChangeTab('cellphone')}>
                  <OTab>
                    <OText size={18} color={loginTab === 'cellphone' ? colors.primary : colors.disabled}>
                      {t('LOGIN_BY_CELLPHONE', 'Login by Cellphone')}
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
              <Controller
                control={control}
                render={({ onChange, value }) => (
                  <OInput
                    placeholder={'Email'}
                    style={loginStyle.inputStyle}
                    icon={IMAGES.email}
                    value={value}
                    onChange={(val: any) => onChange(val)}
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
            )}

            {useLoginByCellphone && loginTab === 'cellphone' && (
              <Controller
                control={control}
                render={({ onChange, value }) => (
                  <OInput
                    type='number-pad'
                    isSecured={true}
                    placeholder={'Cellphone'}
                    style={loginStyle.inputStyle}
                    icon={IMAGES.phone}
                    value={value}
                    onChange={(val: any) => onChange(val)}
                  />
                )}
                name="cellphone"
                rules={{ required: t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required').replace('_attribute_', t('CELLPHONE', 'Cellphone')) }}
                defaultValue=""
              />
            )}

            <Controller
              control={control}
              render={({ onChange, value }) => (
                <OInput
                  isSecured={true}
                  placeholder={'Password'}
                  style={loginStyle.inputStyle}
                  icon={IMAGES.lock}
                  value={value}
                  onChange={(val: any) => onChange(val)}
                />
              )}
              name="password"
              rules={{ required: t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required').replace('_attribute_', t('PASSWORD', 'Password')) }}
              defaultValue=""
            />

            <OButton
              onClick={handleSubmit(onSubmit)}
              text={loginButtonText}
              bgColor={colors.primary}
              borderColor={colors.primary}
              textStyle={{color: 'white'}}
              imgRightSrc={null}
              isLoading={formState.loading}
            />
          </FormInput>
        )}

        {onNavigationRedirect && forgotButtonText && (
          <Pressable onPress={() => onNavigationRedirect('Forgot')}>
            <OText size={20} mBottom={18}>
              {forgotButtonText}
            </OText>
          </Pressable>
        )}

        {configs && Object.keys(configs).length > 0 && (
          (configs?.facebook_login?.value === 'true' ||
              configs?.facebook_login?.value === '1') &&
              configs?.facebook_id?.value &&
          (
            <ButtonsSection>
              <OText size={18} mBottom={10} color={colors.disabled}>
                {t('SELECT_AN_OPTION_TO_LOGIN', 'Select an option to login')}
              </OText>

              <SocialButtons>
                <FacebookLogin
                  handleErrors={(err: any) => showToast(ToastType.Error, err)}
                  handleLoading={(val: boolean) => setIsFBLoading(val)}
                  handleSuccessFacebookLogin={handleSuccessFacebook}
                />
              </SocialButtons>
            </ButtonsSection>
          )
        )}

        {onNavigationRedirect && registerButtonText && (
          <ButtonsSection>
            <OButton
              onClick={() => onNavigationRedirect('Signup')}
              text={registerButtonText}
              style={loginStyle.btnOutline}
              borderColor={colors.primary}
              imgRightSrc={null}
            />
          </ButtonsSection>
        )}
      </FormSide>
      <Spinner visible={isFBLoading} />
    </View>
  );
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

export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    UIComponent: LoginFormUI,
  };
  return <LoginFormController {...loginProps} />;
};
