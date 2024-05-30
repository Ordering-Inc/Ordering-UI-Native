import React from 'react';
import { useLanguage, useOrder, useConfig, useSession, useApi, ToastType, useToast } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { StyleSheet, View } from 'react-native';
import { OButton, OIcon, OText } from '../shared';
import { LanguageSelector } from '../LanguageSelector';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useWindowDimensions, Platform } from 'react-native';
import uuid from 'react-native-uuid';

export const Home = (props: any) => {
	const { onNavigationRedirect, businessSlug } = props;
	const { width, height } = useWindowDimensions();
	const [, t] = useLanguage();
	const [orderState, { handleOrderStateLoading, setStateInitialValues }] = useOrder();
	const [{ configs }] = useConfig()
	const [, { login }] = useSession()
	const [ordering] = useApi()
	const [, { showToast }] = useToast()

	const theme = useTheme();

	const handleCreateGuestUser = async (values: any) => {
		try {
			await handleOrderStateLoading(true)
			const { content: { error, result } } = await ordering.users().save(values)
			if (!error) {
				await login({
					user: result,
					token: result.session?.access_token
				})
			} else {
				showToast(ToastType.Error, t('ERROR_CREATING_GUEST_USER', 'Error creating guest users'))
			}
			await handleOrderStateLoading(false)
		} catch (err) {
			await handleOrderStateLoading(false)
			showToast(ToastType.Error, t('ERROR_CREATING_GUEST_USER', 'Error creating guest users'))
		}
	}

	const handleUpdateGuest = async () => {
		const guestToken = uuid.v4()
		if (guestToken) await handleCreateGuestUser({ guest_token: guestToken })
	}

	return (
		<View style={styles.container}>
			<View>
				<View style={{ paddingTop: (height <= 756 && Platform.OS !== 'ios') ? (height * 0.05) : 0 }}>
					<LanguageSelector />
				</View>
				<OIcon
					src={theme.images.logos.logotypeInvert}
					style={{
						...styles.logo,
						resizeMode: 'contain',
						width: width - 80,
						height: (width - 80) * 0.25,
					}}
				/>
			</View>
			<View style={styles.wrapperBtn}>
				<OText color={theme.colors.white} size={40}>
					{t('WELCOME', 'Welcome!')}
				</OText>
				<OText color={theme.colors.white} size={14} style={{ marginBottom: 46 }}>
					{t('SUBTITLE_HOME', "Let's start to order now")}
				</OText>
				<OButton
					text={t('LOGIN_NOW', 'Login now')}
					style={styles.buttons}
					isCircle={false}
					onClick={() => onNavigationRedirect('Login')}
					imgRightSrc={null}
					isDisabled={orderState?.loading}
				/>
				<OButton
					text={t('SIGNUP', 'Signup')}
					bgColor={theme.colors.primaryContrast}
					borderColor={theme.colors.primaryContrast}
					style={styles.buttons}
					textStyle={{ color: 'black' }}
					onClick={() => onNavigationRedirect('Signup')}
					imgRightSrc={null}
					isDisabled={orderState?.loading}
				/>
				<TouchableOpacity
					disabled={orderState?.loading}
					style={{ ...styles.textLink, marginTop: 12 }}
					onPress={() => handleUpdateGuest()}>
					<OText weight="normal" size={18} color={orderState?.loading ? '#ccc' : theme.colors.white}>
						{t('CONTINUE_AS_GUEST', 'Continue as guest')}
					</OText>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	textLink: {
		flexDirection: 'row',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
	},
	logo: {
		marginTop: 64,
	},
	buttons: {
		marginVertical: 6,
		borderRadius: 7.6,
	},
	sloganText: {
		textAlign: 'center',
	},
	wrapperBtn: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
		marginBottom: 20,
	},
});
