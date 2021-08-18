import React, { useEffect, useRef, useState } from 'react';
import { useLanguage, useOrder, useApi, useSession, useUtils } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { StyleSheet, View, Dimensions, TextStyle, Animated, PanResponder } from 'react-native';
import { OBottomPopup, OButton, OIcon, OText } from '../shared';
import { LogoWrapper, Slogan } from './styles';
import { LanguageSelector } from '../LanguageSelector'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { _setStoreData, _removeStoreData } from '../../providers/StoreUtil';
import { ScrollView } from 'react-native-gesture-handler';
import { LoginForm } from '../LoginForm';
import { SignupForm } from '../SignupForm';

const windowHeight = Dimensions.get('window').height

export const Home = (props: any) => {
	const { navigation, route, onNavigationRedirect } = props;

	const theme = useTheme();
	const [, t] = useLanguage();
	const [orderState] = useOrder();
	const [ordering] = useApi()
	const [, { login }] = useSession()
	const [{ optimizeImage }] = useUtils()

	const [allBusinesses, setAllBusinesses] = useState([]);
	const [openLogin, setOpenLogin] = useState(route?.params?.showAuth || false);
	const [openSignUp, setOpenSignUp] = useState(false);

	const handleGuessFlow = (page: string, params: any) => {
		onNavigationRedirect(page, params);
		_setStoreData('isGuestUser', true);
	};

	const getBusinesses = async () => {
		let parameters = {
			location: `40.7744146,-73.9678064`,
			type: 1
		}
		const toFetch = ['id', 'logo', 'header', 'name'];
		const response = await ordering.businesses().select(toFetch).parameters(parameters).get();
		if (response.content.result) {
			setAllBusinesses(response.content.result);
		}
	}

	const handleLoginPage = () => {
		setOpenLogin(false);
	}

	const handleSignUpPage = () => {
		setOpenSignUp(false);
	}

	const loginProps = {
		navigation,
		useLoginByCellphone: true,
		loginButtonText: t('LOGIN', 'Login'),
		loginButtonBackground: theme.colors.primary,
		forgotButtonText: t('FORGOT_YOUR_PASSWORD', 'Forgot your password?'),
		registerButtonText: t('SIGNUP', 'Signup'),
		onNavigationRedirect: (page: string) => {
			if (!page) return
			handleLoginPage();
			navigation.navigate(page);
		},
		notificationState: route?.params?.notification_state,
		onHandleOpenSignup: () => { handleLoginPage(), setOpenSignUp(true) }
	}

	const signupProps = {
		...props,
		useChekoutFileds: true,
		loginButtonText: t('LOGIN', 'Login'),
		signupButtonText: t('SIGNUP', 'Signup'),
		useSignupByEmail: true,
		notificationState: route?.params?.notification_state,
		onNavigationRedirect: (page: string) => {
			if (!page) return
			handleSignUpPage();
			navigation.navigate(page);
		},
		handleSuccessSignup: (user: any) => {
			_removeStoreData('isGuestUser')
			if (user?.id) {
				login({
					user,
					token: user.session.access_token
				})
			}
		},
		onHandleOpenLogin: () => { handleSignUpPage(), setOpenLogin(true) }
	}

	useEffect(() => {
		getBusinesses();
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setOpenLogin(route?.params?.showAuth || false);
		}, 500)
	}, [route?.params?.showAuth])

	const panY = useRef(new Animated.Value(windowHeight)).current;
	let resetPositionAnim = Animated.timing(panY, {
		toValue: 0,
		duration: 300,
		useNativeDriver: false
	});
	let closeAnim = Animated.timing(panY, {
		toValue: 100,
		duration: 500,
		useNativeDriver: false
	});

	const panResponders = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => false,
			onPanResponderMove: Animated.event(
				[
					null,
					{ dy: panY }
				],
				{
					useNativeDriver: false
				}
			),
			onPanResponderRelease: (e, gs) => {
				console.log(gs);
				if (gs.dy > 0 && gs.vy > 2) {
					return closeAnim.start(() => handleDismiss())
				}
				return resetPositionAnim.start();
			},
		})
	).current;

	const top = panY.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [0, 0, 1],
	});

	const handleDismiss = () => {
		closeAnim.start(() => console.log('Closing'));
	}

	useEffect(() => {
		resetPositionAnim.start();
	}, [])

	return (
		<>
			<View style={styles.container}>
				<View style={styles.wrapperContent}>
					<View style={styles.languageSelector}>
						<LanguageSelector />
					</View>
					<LogoWrapper>
						<OIcon
							src={theme.images.logos.logotype}
							style={styles.logo}
						/>
					</LogoWrapper>
					<Slogan>
						<OText lineHeight={30} size={20} weight={'600'} color={theme.colors.textSecondary}>{t('WELCOME', 'Welcome!')}</OText>
						<OText lineHeight={24} size={16} weight={'400'} color={theme.colors.textSecondary}>{t('LETS_START_TO_ORDER_NOW', 'Let\'s start to order now')}</OText>
					</Slogan>
				</View>
				<View style={styles.wrapperBtn}>
					<View style={{ marginBottom: 80 }}>
						<OText lineHeight={24} size={16} color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>{t('SHOP_THESE_GREAT_STORES_IN_USA', 'Shop these great stores in USA')}</OText>
						<ScrollView horizontal style={{ minHeight: 86 }} contentContainerStyle={{ paddingHorizontal: 40 }} showsHorizontalScrollIndicator={false}>
							{allBusinesses.map(({ logo, id }): any =>
								<View key={`busies_id_${id}`} style={{ ...styles.logoWrap, borderColor: theme.colors.border }}>
									<OIcon url={optimizeImage(logo, 'h_100,c_limit')} width={80} height={80} style={{ borderRadius: 40 }} />
								</View>
							)}
						</ScrollView>
					</View>

					<OButton
						text={t('LOGIN_NOW', 'Login now')}
						bgColor={theme.colors.white}
						borderColor={theme.colors.primary}
						style={styles.buttons}
						textStyle={{ color: theme.colors.primary, ...theme.labels.button } as TextStyle}
						onClick={() => setOpenLogin(true)}
					/>
					<OButton
						text={t('GET_STARTED', 'Get started')}
						bgColor={theme.colors.primary}
						borderColor={theme.colors.primary}
						style={styles.buttons}
						textStyle={{ color: theme.colors.white, ...theme.labels.button } as TextStyle}
						onClick={() => setOpenSignUp(true)}
						imgRightSrc={null}
					/>
					<TouchableOpacity
						style={{ ...styles.textLink, marginTop: 15 }}
						onPress={() => orderState?.options?.address?.address
							? handleGuessFlow('BusinessList', { isGuestUser: true })
							: handleGuessFlow('AddressForm', { isGuestUser: true })
						}
					>
						<OText style={theme.labels.button as TextStyle} color={theme.colors.primary}>
							{t('CONTINUE_AS_GUEST', 'Continue as guest')}
						</OText>
					</TouchableOpacity>
				</View>
			</View>


			<OBottomPopup
				title={t('LOG_IN', 'Log in')}
				open={openLogin}
				onClose={() => handleLoginPage()}
			>
				<LoginForm {...loginProps} />
			</OBottomPopup>
			<OBottomPopup
				title={t('SIGN_UP', 'Sign up')}
				open={openSignUp}
				onClose={() => handleSignUpPage()}
			>
				<SignupForm {...signupProps} />
			</OBottomPopup>
		</>
	);
};

const styles = StyleSheet.create({
	languageSelector: {
		marginRight: 0
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
		height: 80,
		width: 250,
		marginTop: 10
	},
	slogan: {
		height: windowHeight / 2,
		width: 400
	},
	buttons: {
		marginVertical: 9,
		marginHorizontal: 40,
		borderRadius: 3,
		borderWidth: 1,
		shadowOpacity: 0,
		height: 42
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
	},
	logoWrap: { height: 86, width: 86, marginEnd: 10, marginTop: 34, borderRadius: 50, borderWidth: 1 },
	box: {
		height: 150,
		width: 150,
		backgroundColor: "blue",
		borderRadius: 5
	},
	containerM: {
		backgroundColor: 'red',
		paddingTop: 12,
		borderTopRightRadius: 12,
		borderTopLeftRadius: 12,
		paddingHorizontal: 40
	},
});
