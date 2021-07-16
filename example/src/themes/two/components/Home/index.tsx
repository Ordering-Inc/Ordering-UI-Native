import React, { useState } from 'react';
import { useLanguage, useOrder, useSession } from 'ordering-components/native';
import { StyleSheet, View, Dimensions, TextStyle } from 'react-native';
import { colors, images, labels } from '../../theme.json'
import { OButton, OButtonGroup, OIcon, OModal, OText } from '../../../../components/shared';
import { LogoWrapper, Slogan } from './styles';
import { LanguageSelector } from '../LanguageSelector'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { _setStoreData, _removeStoreData } from '../../../../providers/StoreUtil';
import { Container } from '../../../../layouts/Container';
import { LoginForm } from '../LoginForm';
import { SignupForm } from '../SignupForm';

const w = Dimensions.get('window').width

export const Home = (props: any) => {
	const {
		navigation,
		route,
		onNavigationRedirect
	} = props;

	const [, t] = useLanguage();
	const [orderState] = useOrder();
	const [, { login }] = useSession()

	const [isAuth, setAuthState] = useState(false);
	const [activeIndex, setActive] = useState(0);

	const loginProps = {
		navigation,
		useLoginByCellphone: false,
		loginButtonText: t('SIGN_IN', 'Sign in'),
		loginButtonBackground: colors.primary,
		forgotButtonText: t('FORGOT_YOUR_PASSWORD', 'Forgot your password?'),
		onNavigationRedirect: (page: string) => {
			if (!page) return
			navigation.navigate(page);
		},
		notificationState: route?.params?.notification_state
	}

	const signupProps = {
		...props,
		useChekoutFileds: true,
		loginButtonText: t('LOGIN', 'Login'),
		signupButtonText: t('SIGNUP', 'Signup'),
		useSignupByEmail: true,
		notificationState: props.route?.params?.notification_state,
		onNavigationRedirect: (page: string) => {
			if (!page) return
			props.navigation.navigate(page);
		},
		handleSuccessSignup: (user: any) => {
			_removeStoreData('isGuestUser')
			if (user?.id) {
				login({
					user,
					token: user.session.access_token
				})
			}
		}
	}
	// _setStoreData('notification_state', props.route?.params?.notification_state);

	const handleGuessFlow = (page: string, params: any) => {
		onNavigationRedirect(page, params);
		_setStoreData('isGuestUser', true);
	};

	const changAuthToggle = (idx: number) => {
		setActive(idx);
	}

	return (
		<View style={styles.container}>
			<View style={styles.wrapperContent}>
				{/* <View style={styles.languageSelector}>
						<LanguageSelector />
					</View> */}
				<LogoWrapper>
					<OIcon src={images.logos.logotype} style={styles.logo} />
				</LogoWrapper>
				<Slogan>
					<OIcon src={images.general.homeHero} style={styles.slogan} />
				</Slogan>
				<OText style={[{ paddingHorizontal: 40, textAlign: 'center', marginTop: 17 }, labels.title] as TextStyle}>{t('WELCOME_MESSAGE', 'Restaurants and more, delivered to your door')}</OText>
			</View>
			<View style={styles.wrapperBtn}>
				<OButton
					text={t('SIGNUP', 'Sign Up')}
					bgColor={colors.primary}
					borderColor={colors.primary}
					style={styles.buttons}
					imgRightSrc={null}
					textStyle={[{ color: 'white' }, labels.middle] as TextStyle}
					onClick={() => { setActive(1), setAuthState(true) }}
				/>
				<OButton
					text={t('SIGNIN', 'Sign In')}
					bgColor={colors.backgroundGray300}
					borderColor={colors.backgroundGray300}
					style={styles.buttons}
					imgRightSrc={null}
					textStyle={[{ color: colors.textPrimary }, labels.middle] as TextStyle}
					onClick={() => { setActive(0), setAuthState(true) }}
				/>
				<TouchableOpacity
					style={{ ...styles.textLink, marginTop: 15 }}
					onPress={() => orderState?.options?.address?.address
						? handleGuessFlow('BusinessList', { isGuestUser: true })
						: handleGuessFlow('AddressForm', { isGuestUser: true })
					}
				>
					<OText weight='bold' style={labels.middle as TextStyle} color={colors.primary}>
						{t('CONTINUE_AS_GUEST', 'Continue as guest')}
					</OText>
				</TouchableOpacity>
			</View>

			<OModal entireModal customClose transition={'pageSheet'} open={isAuth} onClose={() => setAuthState(false)}>
				<View style={styles.authHeader}>
					<TouchableOpacity onPress={() => setAuthState(false)} style={{}}>
						<OIcon src={images.general.close} width={16} />
					</TouchableOpacity>
					<View style={{ flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
						<OButtonGroup
							activeColor={{ bg: colors.textPrimary, text: colors.white }}
							normalColor={{ bg: colors.backgroundGray300, text: colors.textPrimary }}
							buttonStyle={{ paddingHorizontal: 20 }}
							textStyle={labels.middle as TextStyle}
							items={[t('SIGN_IN', 'Sign in'), t('SIGN_UP', 'Sign up')]}
							onChange={changAuthToggle}
							activeItem={activeIndex}
						/>
					</View>
				</View>
				<Container nopadding style={{ paddingStart: 40, paddingEnd: 40 }}>
					{activeIndex == 0 && <LoginForm {...loginProps} />}
					{activeIndex == 1 && <SignupForm {...signupProps} />}
				</Container>
			</OModal>
		</View>
	);
};

const styles = StyleSheet.create({
	authHeader: {
		flexDirection: 'row',
		height: 57,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
		alignItems: 'center',
		paddingHorizontal: 40
	},
	languageSelector: {
		marginRight: 10
	},
	textLink: {
		flexDirection: 'row',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	logo: {
		height: 70,
		width: w * 0.54,
		marginTop: 10
	},
	slogan: {
		height: w - 80,
		width: w - 80
	},
	buttons: {
		marginVertical: 8.5,
		marginHorizontal: 30,
		height: 40,
		shadowOpacity: 0
	},
	sloganText: {
		textAlign: 'center'
	},
	wrapperContent: {
		marginTop: 20,
	},
	wrapperBtn: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
		marginBottom: 20
	}
});
