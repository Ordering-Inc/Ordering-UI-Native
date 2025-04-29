import React, { useEffect, useState } from 'react';
import { Platform, Text, StyleSheet } from 'react-native';
import { useApi, useSession, useLanguage, useConfig } from 'ordering-components/native';
import { appleAuthAndroid, appleAuth } from '@invertase/react-native-apple-authentication';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Container, AppleButton } from './styles';

export const AppleLogin = (props: any) => {
  const {
    handleErrors,
    handleLoading,
    handleSuccessAppleLogin,
    notificationState
  } = props

  const [ordering] = useApi();
  const [{ auth }] = useSession();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [credentialStateForUser, updateCredentialStateForUser] = useState<any>(-1);

  let user: any = null

  const buttonText = auth
    ? t('CONTINUE_WITH_APPLE', 'Logout with Apple')
    : t('CONTINUE_WITH_APPLE', 'Continue with Apple');

  const performAppleLogin = async (code: string) => {
    try {
      const response: any = await fetch(`${ordering.root}/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          platform: Platform.OS === 'ios' ? 'ios' : 'other'
        })
      })
      const { result, error } = await response.json()
      if (!error) {
        if (handleSuccessAppleLogin) {
          handleSuccessAppleLogin(result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleErrors && handleErrors(result)
        handleLoading && handleLoading(false)
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const fetchAndUpdateCredentialState = async (updateCredentialStateForUser: any) => {
    if (user === null) {
      updateCredentialStateForUser('N/A');
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        updateCredentialStateForUser('AUTHORIZED');
      } else {
        updateCredentialStateForUser(credentialState);
      }
    }
  }

  const onIOSButtonPress = async (updateCredentialStateForUser: any) => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {
        user: newUser,
        email,
        identityToken,
        authorizationCode
      } = appleAuthRequestResponse;
      user = newUser;

      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
      );

      if (identityToken && authorizationCode) {
        performAppleLogin(authorizationCode)
      } else {
        handleErrors && handleErrors('UNABLE_LOGIN_TOKEN', 'Unable to login, no token found')
      }

    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const onAndroidButtonPress = async () => {
    try {
      // Generate secure, random values for state and nonce
      const rawNonce: any = uuid.v4();
      const state: any = uuid.v4();

      // Configure the request
      appleAuthAndroid.configure({
        // The Service ID you registered with Apple
        clientId: configs?.apple_login_client_id?.value,
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
      if (response.code) {
        performAppleLogin(response.code)
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }

  }

  useEffect(() => {
    if (!appleAuth.isSupported || Platform.OS === 'android') return;

    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );
  }, []);

  useEffect(() => {
    if (!appleAuth.isSupported || Platform.OS === 'android') return;

    return appleAuth.onCredentialRevoked(async () => {
      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
      );
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
          onPress={() => Platform.OS == 'android' ? onAndroidButtonPress() : onIOSButtonPress(updateCredentialStateForUser)}
        >
          <Icon
            name="apple"
            size={20}
            color={'black'}
            style={style.fbBtn}
          />
          <Text style={style.textBtn}>
            {buttonText}
          </Text>
        </AppleButton>
      }
    </Container>
  );
}

const style = StyleSheet.create({
  fbBtn: {
    position: 'absolute',
    left: 0,
    marginHorizontal: 16
  },
  textBtn: {
    fontSize: 14,
    color: '#000000'
  }
})
