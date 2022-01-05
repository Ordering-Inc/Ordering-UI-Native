import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useLanguage, useSession, useApi } from 'ordering-components/native';
import { appleAuthAndroid, AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import uuid from 'react-native-uuid';

import { Container } from './styles';
import { useTheme } from 'styled-components/native';

export const AppleLogin = (props: any) => {
  const {
    handleErrors,
    handleLoading,
    handleSuccessAppleLogin,
    notificationState
  } = props

  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [{ auth }] = useSession()

  const performAppleLogin = async (code: string) => {
    try {
      const response: any = await fetch(`${ordering.root}/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code
        })
      })
      if (!response.content.error) {
        if (handleSuccessAppleLogin) {
          handleSuccessAppleLogin(response.content.result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleLoading && handleLoading(false)
        logoutFromApple()
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const logoutFromApple = () => {

  }

  const onIOSButtonPress = async () => {
    
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
      if (appleAuthRequestResponse.authorizationCode) {
        performAppleLogin(appleAuthRequestResponse.authorizationCode)
      }
    }

  }

  const onAndroidButtonPress = async () => {
    // Generate secure, random values for state and nonce
    const rawNonce: any = uuid.v4();
    const state: any = uuid.v4();

    // Configure the request
    appleAuthAndroid.configure({
      clientId: 'com.example.client-android',
      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: 'https://example.com/auth/callback',
      responseType: appleAuthAndroid.ResponseType.ALL,
      scope: appleAuthAndroid.Scope.ALL,
      // Random nonce value that will be SHA256 hashed before sending to Apple.
      nonce: rawNonce,
      state,
    });

    // Open the browser window for user sign in
    const response = await appleAuthAndroid.signIn();

    try {
      if (response.code) {
        performAppleLogin(response.code)
      }
    } catch (err: any) {

    }
  }

  useEffect(() => {
    if (Platform.OS == 'android') return;
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.warn('If this function executes, User Credentials have been Revoked');
    });
  }, []);

  const canShowButton = () => {
    if (Platform.OS === 'ios') return true;
    if (Platform.OS === 'android') return appleAuthAndroid.isSupported;
    return false;
  }
  return (
    <Container>
      {canShowButton() && 
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.CONTINUE}
          style={{
            width: '100%',
            height: 42,
          }}
          cornerRadius={30}
          onPress={() => onIOSButtonPress()}
        />
      }
    </Container>
  );
}
