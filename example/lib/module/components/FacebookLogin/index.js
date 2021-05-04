import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { useLanguage, useSession, useApi } from 'ordering-components/native'; // import { clearAllData } from '../../providers/StoreUtil'

import Icon from 'react-native-vector-icons/FontAwesome5';
import { Container, FacebookButton } from './styles';
import { colors } from '../../theme';
export const FacebookLogin = props => {
  const {
    handleErrors,
    handleLoading,
    handleSuccessFacebookLogin
  } = props;
  const [, t] = useLanguage();
  const [ordering] = useApi();
  const [{
    auth
  }] = useSession();
  const buttonText = auth ? t('LOGOUT_WITH_FACEBOOK', 'Logout with Facebook') : t('LOGIN_WITH_FACEBOOK', 'Login with Facebook');

  const logoutWithFacebook = () => {
    LoginManager.logOut();
  };

  const handleLoginClick = async accessToken => {
    try {
      const response = await ordering.users().authFacebook({
        access_token: accessToken
      });

      if (!response.content.error) {
        if (handleSuccessFacebookLogin) {
          handleSuccessFacebookLogin(response.content.result);
          handleLoading && handleLoading(false);
        }
      } else {
        handleLoading && handleLoading(false);
        logoutWithFacebook();
      }
    } catch (err) {
      handleLoading && handleLoading(false);
      handleErrors && handleErrors(err.message);
    }
  };

  const loginWithFacebook = () => {
    handleLoading && handleLoading(true);
    LoginManager.logInWithPermissions(['public_profile']).then(login => {
      if (login.isCancelled) {
        const err = t('LOGIN_WITH_FACEBOOK_CANCELLED', 'Login cancelled');
        handleLoading && handleLoading(false);
        handleErrors && handleErrors(err);
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          const accessToken = data.accessToken.toString();
          handleLoginClick(accessToken);
        });
      }
    }, error => {
      const err = error ? t(error === null || error === void 0 ? void 0 : error.replace(/ /g, '_').toUpperCase(), 'Login cancelled') : t('LOGIN_FAIL_WITH_FACEBOOK', 'Login fail with facebook');
      handleLoading && handleLoading(true);
      handleErrors && handleErrors(err);
    });
  };

  const onPressButton = auth ? logoutWithFacebook : loginWithFacebook;
  useEffect(() => {// clearAllData()
  }, []);
  return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(FacebookButton, {
    onPress: onPressButton
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "facebook",
    size: 34,
    color: colors.skyBlue,
    style: style.fbBtn
  }), /*#__PURE__*/React.createElement(Text, {
    style: style.textBtn
  }, buttonText)));
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
//# sourceMappingURL=index.js.map