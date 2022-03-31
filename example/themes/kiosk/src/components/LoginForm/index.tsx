import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from 'styled-components/native';

import {
  LoginForm as LoginFormController,
  useLanguage,
  ToastType,
  useToast,
  useApi
} from 'ordering-components/native';

import {
  WelcomeTextContainer,
  LogoWrapper
} from './styles';

import { OText, OButton, OInput, OIcon } from '../shared';
import { LoginParams } from '../../types';
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { _setStoreData } from '../../../../../src/providers/StoreUtil'

const LoginFormUI = (props: LoginParams) => {
  const {
    loginButtonText,
    formState,
    handleButtonLoginClick,
    useRootPoint
  } = props;

  const theme = useTheme()
  const [ordering, { setOrdering }] = useApi();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const {control, handleSubmit, formState: {errors}} = useForm();
  const [orientationState] = useDeviceOrientation();

  const [formsStateValues, setFormsStateValues] = useState<any>({ isSubmitted: false })

  const onSubmit = (values: any) => {
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

    handleButtonLoginClick(values);
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
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
      borderColor: theme.colors.disabled,
      minHeight: 44,
      maxHeight: 44
    },
    forgotStyle: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: theme.colors.skyBlue,
      marginTop: orientationState?.dimensions?.height * 0.03,
    }
  });

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
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
    handleButtonLoginClick({ ...values })
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

  const logo = (
    <LogoWrapper>
      <OIcon src={theme.images.logos.logotype} style={styles.logo}/>
    </LogoWrapper>
  );

  const InputControllers = (
    <>
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
              inputStyle={{textAlign: 'center'}}
              onChange={(e: any) => {
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
            inputStyle={{textAlign: 'center'}}
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

      <Controller
        control={control}
        render={({ onChange, value }: any) => (
          <OInput
            isSecured={true}
            placeholder={t('PASSWORD', 'Password')}
            style={styles.inputStyle}
            value={value}
            onChange={(val: any) => onChange(val)}
            inputStyle={{textAlign: 'center'}}
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
        text={loginButtonText}
        imgRightSrc={null}
        isLoading={formState.loading}
        style={{ borderRadius: 0 }}
        textStyle={{ fontSize: 24 }}
      />
    </>
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
          { welcome }
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
          {InputControllers}
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
    </View>
  );
};


export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    UIComponent: LoginFormUI,
  };
  return <LoginFormController {...loginProps} />;
};
