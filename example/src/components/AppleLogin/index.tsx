import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { appleAuthAndroid, appleAuth } from '@invertase/react-native-apple-authentication';
import {useConfig, useApi, useLanguage} from 'ordering-components/native'
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Container, AppleButton } from './styles';
import { useTheme } from 'styled-components/native';
import { OText } from '../shared';

export const AppleLogin = (props) => {

  const {
    handleErrors,
    handleLoading,
    handleSuccessApple,
    notificationState,
  } = props

  const [{configs}] = useConfig()
  const [ordering] = useApi()
  const [,t] = useLanguage()
  const theme = useTheme()

  const buttonText = t('LOGIN_WITH_APPLE', 'Login with Apple');


  const onAppleButtonPress = async () => {
    // Generate secure, random values for state and nonce
    const rawNonce = uuid.v4()
    const state = uuid.v4()

    if (Platform.OS === 'ios') {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
      }
    } else {
      // Configure the request
      appleAuthAndroid.configure({
        // The Service ID you registered with Apple
        clientId: configs?.apple_login_client_id?.value,

        // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
        // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
        redirectUri: 'https://example-app.com/redirect',

        // The type of response requested - code, id_token, or both.
        responseType: appleAuthAndroid.ResponseType.ALL,

        // The amount of user information requested from Apple.
        scope: appleAuthAndroid.Scope.ALL,

        // Random nonce value that will be SHA256 hashed before sending to Apple.
        nonce: rawNonce,

        // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
        state,
      });
      // Open the browser window for user sign in
      const {code} = await appleAuthAndroid.signIn();

      // Send the authorization code to your backend for verification
      handleLoginApple(code)
    }
  }
  const handleLoginApple = async (code) => {
    const body = {
      code,
    }
    if (notificationState?.notification_token) {
      body.notification_token = notificationState.notification_token
      body.notification_app = notificationState.notification_app
    }
    console.log(body)
    try {
      handleLoading && handleLoading(true)
      const response = await fetch(`${ordering.root}/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      handleLoading && handleLoading(false)
      if (!response?.content?.error && response?.content?.result) {
          handleSuccessApple(response?.content?.result)
      } else {
        if (handleErrors) {
          handleErrors(response?.content?.result || t('ERROR_API_RESPONSE', 'Error Api response'))
        }
      }
    } catch (err) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err)
    }
  }

  useEffect(() => {
    if(Platform.OS === 'ios'){
      return appleAuth.onCredentialRevoked(async () => {
        console.warn('If this function executes, User Credentials have been Revoked');
      });
    }
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
