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

  const [credentialStateForUser, updateCredentialStateForUser] = useState<any>(-1);


  const buttonText = t('LOGIN_WITH_APPLE', 'Login with Apple');
  let user : any = null

  const onAppleButtonPress = async (updateCredentialStateForUser : any) => {
    const rawNonce : any = uuid.v4()
    const state : any = uuid.v4()

    if (Platform.OS === 'ios') {
      try{
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          nonce: rawNonce,
          state
        });
        console.log('appleAuthRequestResponse', appleAuthRequestResponse);

        const {
          user : newUser,
          email,
          identityToken,
          realUserStatus,
          authorizationCode,
        } = appleAuthRequestResponse;

        user = newUser

        if(identityToken && authorizationCode){
          console.log('auth code: ', authorizationCode)
          handleLoginApple(authorizationCode)
        } else {
          console.log('failed login')
        }

        if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
          console.log("I'm a real person!");
        }

        console.warn(`Apple Authentication Completed, ${user}, ${email}`);
      } catch (error){
        if (error.code === appleAuth.Error.CANCELED) {
          console.warn('User canceled Apple Sign in.');
        } else {
          console.error(error);
        }
      }
    } else {
      appleAuthAndroid.configure({
        clientId: configs?.apple_login_client_id?.value,
        redirectUri: 'https://example-app.com/redirect',
        responseType: appleAuthAndroid.ResponseType.ALL,
        scope: appleAuthAndroid.Scope.ALL,
        nonce: rawNonce,
        state,
      });
      const {code} = await appleAuthAndroid.signIn();

      handleLoginApple(code)
    }
  }
  const handleLoginApple = async (code : string) => {
    const body : any = {
      code,
    }
    if (notificationState?.notification_token) {
      body.notification_token = notificationState.notification_token
      body.notification_app = notificationState.notification_app
    }

    try {
      handleLoading && handleLoading(true)
      const response : any = await fetch(`${ordering.root}/auth/apple`, {
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
    if(Platform.OS !== 'ios' && !appleAuth.isSupported) return
      return appleAuth.onCredentialRevoked(async () => {
        console.warn('User Credentials have been Revoked');
      });
  }, []);

  return (
    <Container>
      <AppleButton
        onPress={() => onAppleButtonPress(credentialStateForUser)}
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
