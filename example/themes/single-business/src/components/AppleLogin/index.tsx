import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { useLanguage, useSession, useApi } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { Container, AppleButton } from './styles';

export const AppleLogin = (props: any) => {
	const {
		handleErrors,
		handleLoading,
		handleSuccessAppleLogin
	} = props

	const theme = useTheme();

	const [, t] = useLanguage()
	const [ordering] = useApi()
	const [{ auth }] = useSession()

	const buttonText = auth
		? t('CONTINUE_WITH_APPLE', 'Logout with Apple')
		: t('CONTINUE_WITH_FACEBOOK', 'Continue with Apple');

	const logoutWithFacebook = () => {
		LoginManager.logOut();
	};

	const handleLoginClick = async (accessToken: string) => {
		try {
			const response = await ordering.users().authFacebook({ access_token: accessToken })
			if (!response.content.error) {
				if (handleSuccessAppleLogin) {
					handleSuccessAppleLogin(response.content.result)
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
			<AppleButton
				onPress={onPressButton}
			>
				<Icon
					name="apple"
					size={20}
					color={theme.colors.black}
					style={style.fbBtn}
				/>
				<Text style={style.textBtn}>
					{buttonText}
				</Text>
			</AppleButton>
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
