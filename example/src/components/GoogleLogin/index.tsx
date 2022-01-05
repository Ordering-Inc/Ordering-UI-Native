import React, { useEffect } from 'react'
import { useApi, useSession, useLanguage } from 'ordering-components/native'
import { Text, StyleSheet } from 'react-native'
import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useTheme } from 'styled-components'
import { Container, GoogleButton } from './styles'

export const GoogleLogin = (props: any) => {
  const {
    webClientId,
    handleErrors,
    handleLoading,
    handleSuccessGoogleLogin,
    notificationState
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [ordering] = useApi()

  const buttonText = auth
    ? t('LOGOUT_WITH_GOOGLE', 'Logout with Google')
    : t('CONTINUE_WITH_GOOGLE', 'Continue with Google');

  const configureGoogleSign = () => {
    GoogleSignin.configure({
      webClientId: webClientId,
      offlineAccess: false
    })
  }

  const performGoogleLogin = async (accessToken: string) => {
    try {
      const body: any = {
        access_token: accessToken
      }
      if (notificationState?.notification_token) {
        body.notification_token = notificationState.notification_token
        body.notification_app = notificationState.notification_app
      }
      const response = await ordering.users().authGoogle(body)
      if (!response.content.error) {
        if (handleSuccessGoogleLogin) {
          handleSuccessGoogleLogin(response.content.result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleLoading && handleLoading(false)
        handleErrors && handleErrors(response.content.result)
        logoutWithGoogle()
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        performGoogleLogin(userInfo.idToken)
      }
    } catch (error: any) {
      let err
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        err = t('CANCELLED', 'Cancelled')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        err = t('IN_PROGRESS', 'In Progress')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        err = t('NOT_AVAILABLE', 'Not available')
      } else {
        err = error.message
      }
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err)
    }
  }

  const logoutWithGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error: any) {
      handleErrors && handleErrors(error.message)
    }
  }

  useEffect(() => {
    configureGoogleSign()
  }, [])

  const onPressButton = auth
    ? logoutWithGoogle
    : loginWithGoogle;
  
  return (
    <Container>
      <GoogleButton
        onPress={onPressButton}
      >
        <Icon
          name="google"
          size={34}
          color={theme.colors.skyBlue}
          style={styles.googleBtn}
        />
        <Text style={styles.textBtn}>
          {buttonText}
        </Text>
      </GoogleButton>
    </Container>
  )
}

const styles = StyleSheet.create({
  googleBtn: {
    position: 'absolute',
    left: 0,
    marginHorizontal: 10
  },
  textBtn: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 20
  }
});
