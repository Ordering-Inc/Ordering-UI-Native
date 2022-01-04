import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { useLanguage, useSession, useApi } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import { Container, GoogleButton } from './styles';
import { OIcon } from '../shared';
import { View } from 'react-native';

export const GoogleLogin = (props: any) => {
	const {
		handleErrors,
		handleLoading,
		handleSuccessGoogleLogin
	} = props

	const [, t] = useLanguage()
	const [ordering] = useApi()
	const [{ auth }] = useSession()

	const theme = useTheme();

	const buttonText = auth
		? t('LOGOUT_WITH_FACEBOOK', 'Logout with Google')
		: t('CONTINUE_WITH_GOOGLE', 'Continue with Google');

	const logoutWithFacebook = () => {
		LoginManager && LoginManager.logOut();
	};

	const handleLoginClick = async (accessToken: string) => {
		try {
			const response = await ordering.users().authFacebook({ access_token: accessToken })
			if (!response.content.error) {
				if (handleSuccessGoogleLogin) {
					handleSuccessGoogleLogin(response.content.result)
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
		LoginManager && LoginManager.logInWithPermissions(['public_profile']).then(
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
			<GoogleButton
				onPress={onPressButton}
			>
				<View style={style.fbBtn}>
					<OIcon
						src={theme.images.general.google}
						width={16}
					/>
				</View>
				{/* <Icon
          name="google"
          size={16}
          color={colors.skyBlue}
          style={style.fbBtn}
        /> */}
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
		marginHorizontal: 16,
	},
	textBtn: {
		fontSize: 14,
		color: '#000000'
	}
})
