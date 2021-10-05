import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage, useApi, useSession } from 'ordering-components/native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Container, GoogleButton } from './styles';
import { useTheme } from 'styled-components/native';
import { OIcon } from '../shared';

export const GoogleLogin = (props: any) => {
  const {
    handleErrors,
    handleLoading,
    handleSuccessGoogleLogin,
    notificationState,
  } = props

  const [, t] = useLanguage()
  const [ordering] = useApi()
  const theme = useTheme()
	const [{ auth }] = useSession();

	const buttonText = auth
		? t('LOGOUT_WITH_FACEBOOK', 'Logout with Google')
		: t('CONTINUE_WITH_GOOGLE', 'Continue with Google');

  const performGoogleLogin = async (accessToken: string) => {
    try {
      const body: any = {
        access_token: accessToken
      }
      if (notificationState?.notification_token) {
        body.notification_token = notificationState.notification_token
        body.notification_app = notificationState.notification_app
      }
      const response: any = await fetch(`${ordering.root}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!response.content.error) {
        if (handleSuccessGoogleLogin) {
          handleSuccessGoogleLogin(response.content.result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleLoading && handleLoading(false)
        onSignoutFromGoogle()
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const onLoginWithGoogle = async () => {
    try {
			
			await GoogleSignin.configure({
				iosClientId: '733099999972-s1s5amppj9qlfi5t16oemqbfvetap2t5.apps.googleusercontent.com',
				offlineAccess: false
			})

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        performGoogleLogin(userInfo.idToken);
      }
      // this.setState({ userInfo });
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const onSignoutFromGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  }

  return (
		<Container>
			<GoogleButton
				onPress={onLoginWithGoogle}
			>
				<View style={style.fbBtn}>
					<OIcon
						src={theme.images.general.google}
						width={16}
					/>
				</View>
				<Text style={style.textBtn}>
					{buttonText}
				</Text>
			</GoogleButton>
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
    color: '#000000',
    marginLeft: 20
  }
})
