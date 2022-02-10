import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { appleAuthAndroid, appleAuth } from '@invertase/react-native-apple-authentication';
import { useConfig, useApi, useLanguage } from 'ordering-components/native'
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Container, AppleButton } from './styles';
import { useTheme } from 'styled-components/native';
import { OText } from '../shared';
import { AppleLoginParams } from '../../types';

export const AppleLogin = (props: AppleLoginParams) => {
  const {
    notificationState,
    handleErrors,
    handleLoading,
    handleSuccessApple,
  } = props

  const [{ configs }] = useConfig()
  const [ordering] = useApi()
  const [, t] = useLanguage()
  const theme = useTheme()
  const buttonText = t('LOGIN_WITH_APPLE', 'Login with Apple');

  const onAppleButtonPress = async () => {
    const rawNonce: any = uuid.v4()
    const state: any = uuid.v4()

    if (Platform.OS === 'ios') {
      try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          nonce: rawNonce,
          state
        });
        console.log('appleAuthRequestResponse', appleAuthRequestResponse);

        const {
          user,
          email,
          identityToken,
          authorizationCode,
        } = appleAuthRequestResponse
        if (identityToken) {
          console.log('auth code: ', authorizationCode)
          handleLoginApple(authorizationCode)
        } else {
          handleErrors && handleErrors(t('ERROR_LOGIN_APPLE', 'Error login with apple'))
        }

      } catch (error: any) {
        handleErrors && handleErrors(error.message)
      }
    } else {
      try {
        appleAuthAndroid.configure({
          clientId: configs?.apple_login_client_id?.value,
          redirectUri: 'https://example-app.com/redirect',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state,
        });
        const { code } = await appleAuthAndroid.signIn();
        handleLoginApple(code)
      } catch (error: any) {
        handleErrors && handleErrors(error?.message)
      }
    }
  }
  const handleLoginApple = async (code: string | null) => {
    let body: any
    if (Platform.OS === 'ios') {
      body = {
        code,
        platform: 'ios'
      }
    } else {
      body = {
        code
      }
    }
    if (notificationState?.notification_token) {
      body.notification_token = notificationState.notification_token
      body.notification_app = notificationState.notification_app
    }

    try {
      handleLoading && handleLoading(true)
      const response: any = await fetch(`${ordering.root}/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const { error, result } = await response.json()
      handleLoading && handleLoading(false)
      if (!error && result) {
        handleSuccessApple && handleSuccessApple(result)
      } else {
        handleErrors && handleErrors(result || t('ERROR_LOGIN_AUTH_APPLE', 'Error login auth with apple'))
      }
    } catch (error: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(error?.message)
    }
  }

  useEffect(() => {
    if (Platform.OS !== 'ios' && !appleAuth.isSupported) return
    return appleAuth.onCredentialRevoked(async () => {
      handleErrors && handleErrors(t('USER_CREDENTIALS_REVOKED', 'User credentials revoked'))
    });
  }, []);

  return (
    <Container>
      <AppleButton
        onPress={onAppleButtonPress}
      >
        <Icon
          name="apple"
          size={34}
          color={theme.colors.black}
          style={style.appleBtn}
        />
        <OText style={style.textBtn}>
          {buttonText}
        </OText>
      </AppleButton>
    </Container>
  );
}

const style = StyleSheet.create({
  appleBtn: {
    position: 'absolute',
    left: 0,
    marginHorizontal: 10
  },
  textBtn: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 20
  }
})
