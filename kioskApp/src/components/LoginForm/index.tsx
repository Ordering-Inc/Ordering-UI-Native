import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import OIcon from '../../components/shared/OIcon';

import {
  LoginForm as LoginFormController,
  useLanguage,
} from 'ordering-components/native';

import {
  Container,
  FormSide,
  WelcomeTextContainer,
  LogoWrapper
} from './styles';

import { ToastType, useToast } from '../../providers/ToastProvider';
import { LOGO_IMAGES } from '../../config/constants';

import { OText, OButton, OInput } from '../shared';
import { LoginParams } from '../../types';
import { colors } from '../../theme.json';

const LoginFormUI = (props: LoginParams) => {
  const {
    formState,
    handleButtonLoginClick,
  } = props;

  const {showToast} = useToast();
  const [, t] = useLanguage();
  const {control, handleSubmit, formState: {errors}} = useForm();

  const onSubmit = (values: any) => {
    handleButtonLoginClick(values);
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      formState.result?.result && showToast(
        ToastType.Error,
        formState.result?.result[0]
      )
    }
  }, [formState]);


  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  return (
    <Container>

      <LogoWrapper>
        <OIcon src={LOGO_IMAGES.logotype} style={styles.logo}/>
      </LogoWrapper>

      <FormSide>

        <WelcomeTextContainer>
          <OText
            size={22}>
            {t('WELCOME_TEXT_A', 'Hi There!')}
          </OText>

          <OText
            size={28}
            style={styles.welcomeTextB}
            weight={'bold'}>
            {t('WELCOME_TEXT_B', 'Login To start')}
          </OText>

          <OText
            size={20}>
            {t('WELCOME_TEXT_C', 'You just need to login once.')}
          </OText>
        </WelcomeTextContainer>

        <Controller
          control={control}
          render={(p: any) => (
            <OInput
              placeholder={t('USER', 'User')}
              style={styles.inputStyle}
              value={p.field.value}
              autoCapitalize="none"
              autoCorrect={false}
              type="email-address"
              onChange={(e: any) => {
                handleChangeInputEmail(e, p.field.onChange);
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

        <Controller
          control={control}
          render={(p: any) => (
            <OInput
              isSecured={true}
              placeholder={t('PASSWORD', 'Password')}
              style={styles.inputStyle}
              value={p.field.value}
              onChange={(val: any) => p.field.onChange(val)}
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

        <OButton
          onClick={handleSubmit(onSubmit)}
          text={t('LOGIN', 'Login')}
          textStyle={styles.buttonTextStyle}
          style={styles.buttonStyle}
          imgRightSrc={null}
          isLoading={formState.loading}
        />

        <Pressable>
          <OText size={14} mBottom={18} style={styles.forgotStyle}>
            {t('FORGOT_PASSWORD', 'I forgot my password')}
          </OText>
        </Pressable>

        <OText size={12} mBottom={18}>
          {t('IF_NOT_HAVE_ACCOUNT', 'If you don\'t have and account, please contact Ordering')}&nbsp;
          <OText size={12} mBottom={18} color={colors.skyBlue}>
            {t('SUPPORT_DEPARTMENT', 'support department')}
          </OText>
        </OText>

      </FormSide>

    </Container>
  );
};

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
    borderColor: colors.disabled,
    height: 44
  },
  buttonStyle: {
    height: 44,
    marginBottom: 16
  },
  buttonTextStyle: {
    color: 'white'
  },
  forgotStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.skyBlue,
    marginBottom: 36
  }
});

export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    UIComponent: LoginFormUI,
  };
  return <LoginFormController {...loginProps} />;
};
