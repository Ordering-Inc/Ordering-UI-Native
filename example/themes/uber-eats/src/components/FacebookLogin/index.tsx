import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { useLanguage, useSession, useApi } from 'ordering-components/native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { Container, FacebookButton } from './styles';
import { useTheme } from 'styled-components/native';

export const FacebookLogin = (props: any) => {
  const {
    handleErrors,
    handleLoading,
    handleSuccessFacebookLogin,
    notificationState
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [{ auth }] = useSession()

  const buttonText = auth
    ? t('LOGOUT_WITH_FACEBOOK', 'Logout with Facebook')
    : t('LOGIN_WITH_FACEBOOK', 'Login with Facebook');

  const logoutWithFacebook = () => {
    LoginManager.logOut();
  };

  const handleLoginClick = async (accessToken: string) => {
    try {
      const body: any = {
        access_token: accessToken
      }
      if (notificationState?.notification_token) {
        body.notification_token = notificationState.notification_token
        body.notification_app = notificationState.notification_app
      }
      const response = await ordering.users().authFacebook(body)
      if (!response.content.error) {
        if (handleSuccessFacebookLogin) {
          handleSuccessFacebookLogin(response.content.result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleLoading && handleLoading(false)
        logoutWithFacebook()
      }
    } catch (err) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const loginWithFacebook = () => {
    handleLoading && handleLoading(true)
    LoginManager.logInWithPermissions(['public_profile']).then(
      (login: any) => {
        if (login.isCancelled) {
          const err = t('LOGIN_WITH_FACEBOOK_CANCELLED', 'Login cancelled')
          handleLoading && handleLoading(false)
          handleErrors && handleErrors(err)
        } else {
          AccessToken.getCurrentAccessToken().then((data: any) => {
            const accessToken = data.accessToken.toString();
            handleLoginClick(accessToken)
          });
        }
      },
      (error: any) => {
        const err = error
          ? t(error?.replace(/ /g, '_').toUpperCase(), 'Login cancelled')
          : t('LOGIN_FAIL_WITH_FACEBOOK', 'Login fail with facebook')
        handleLoading && handleLoading(false)
        handleErrors && handleErrors(err)
      },
    );
  };

  const onPressButton = auth
    ? logoutWithFacebook
    : loginWithFacebook;

  return (
    <Container>
      <FacebookButton
        onPress={onPressButton}
      >
        <Icon
          name="facebook"
          size={30}
          color={theme.colors.skyBlue}
          style={style.fbBtn}
        />
        <Text style={style.textBtn}>
          {buttonText}
        </Text>
      </FacebookButton>
    </Container>
  );
}

const style = StyleSheet.create({
  fbBtn: {
    position: 'absolute',
    left: 0,
    marginHorizontal: 10
  },
  textBtn: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 20
  }
})
