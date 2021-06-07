import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useLanguage, useSession, useApi } from 'ordering-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Container, GoogleButton } from './styles';
import { colors } from '../../theme.json';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const GoogleLogin = (props: any) => {
  const {
    handleErrors,
    handleLoading,
    handleSuccessFacebookLogin
  } = props;

  const [, t] = useLanguage();
  const [ordering] = useApi();
  const [{ auth }] = useSession();

  const logoutWithGoogle = () => {
    // LoginManager.logOut();
    signOut();
  };

  const loginWithGoogle = () => {
    handleLoading && handleLoading(true);
    GoogleSignin.configure();
    signIn();
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // this.setState({ userInfo });
    } catch (error) {
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

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const buttonText = auth
    ? t('LOGOUT_WITH_GOOGLE', 'Logout with Google')
    : t('LOGIN_WITH_GOOGLE', 'Login with Google');

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
          color={colors.cancelColor}
          style={style.fbBtn}
        />
        <Text style={style.textBtn}>
          {buttonText}
        </Text>
      </GoogleButton>
    </Container>
  )
};

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
});
