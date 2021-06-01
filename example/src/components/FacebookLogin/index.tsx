import React from 'react';
import { StyleSheet, Text, Alert } from 'react-native';
// import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { useLanguage, useSession, useApi } from 'ordering-components/native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { Container, FacebookButton } from './styles';
import { colors } from '../../theme.json';

export const FacebookLogin = (props: any) => {
  const {
    handleErrors,
    handleLoading,
    handleSuccessFacebookLogin
  } = props

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
      const response = await ordering.users().authFacebook({ access_token: accessToken })
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
    try {
      const respo = LoginManager.logInWithPermissions
    } catch (error) {
      
    }
    // LoginManager.logInWithPermissions(['public_profile']).then(
    //   (login: any) => {
    //     console.log('login', login);
    //     // if (login.isCancelled) {
    //     //   const err = t('LOGIN_WITH_FACEBOOK_CANCELLED', 'Login cancelled')
    //     //   handleLoading && handleLoading(false)
    //     //   handleErrors && handleErrors(err)
    //     // } else {
    //     //   AccessToken.getCurrentAccessToken().then((data: any) => {
    //     //     const accessToken = data.accessToken.toString();
    //     //     handleLoginClick(accessToken)
    //     //   });
    //     // }
    //   },
    //   (error: any) => {
    //     console.log('error', error);
    //     // const err = error
    //     //   ? t(error?.replace(/ /g, '_').toUpperCase(), 'Login cancelled')
    //     //   : t('LOGIN_FAIL_WITH_FACEBOOK', 'Login fail with facebook')
    //     // handleLoading && handleLoading(false)
    //     // handleErrors && handleErrors(err)
    //   },
    // );
  };

  const onPressButton = auth
    ? logoutWithFacebook
    : loginWithFacebook;

  return (
    <Container>
      {/* <FacebookButton
        onPress={onPressButton}
      >
        <Icon
          name="facebook"
          size={34}
          color={colors.skyBlue}
          style={style.fbBtn}
        />
        <Text style={style.textBtn}>
          {buttonText}
        </Text>
      </FacebookButton> */}
      <LoginButton
        onLoginFinished={(error, data) => {
          Alert.alert(JSON.stringify(error || data, null, 2));
        }}
      />
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
    fontSize: 16,
    color: '#000000'
  }
})
