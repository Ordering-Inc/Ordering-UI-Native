import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import { PhoneInputNumber } from '../PhoneInputNumber';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Recaptcha from 'react-native-recaptcha-that-works'
import ReCaptcha from '@fatnlazycat/react-native-recaptcha-v3'

import {
	LoginForm as LoginFormController,
	useLanguage,
	useConfig,
	useSession,
	ToastType,
	useToast,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { FacebookLogin } from '../FacebookLogin';
import { VerifyPhone } from '../../../../../src/components/VerifyPhone';
import { OModal } from '../../../../../src/components/shared';
import {
	Container,
	ButtonsWrapper,
	LoginWith,
	FormSide,
	FormInput,
	OTabs,
	OTab,
	SocialButtons,
	OrSeparator,
	LineSeparator,
	SkeletonWrapper,
	TabBtn,
	RecaptchaButton
} from './styles';

import NavBar from '../NavBar';

import { OText, OButton, OInput } from '../shared';
import { LoginParams } from '../../types';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { GoogleLogin } from '../GoogleLogin';
import { AppleLogin } from '../AppleLogin';
import { Otp } from './Otp'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Alert from '../../../../../src/providers/AlertProvider'
import { vibrateApp } from '../../utils';

const LoginFormUI = (props: LoginParams) => {
	const {
		loginTab,
		formState,
		navigation,
		useLoginByEmail,
		useLoginByCellphone,
		useLoginOtp,
		loginButtonText,
		forgotButtonText,
		verifyPhoneState,
		checkPhoneCodeState,
		registerButtonText,
		setCheckPhoneCodeState,
		handleButtonLoginClick,
		handleSendVerifyCode,
		handleCheckPhoneCode,
		onNavigationRedirect,
		notificationState,
		handleReCaptcha,
		enableReCaptcha,
		otpType,
		setOtpType,
		generateOtpCode,
		useLoginOtpEmail,
		useLoginOtpCellphone,
		isGuest
	} = props;

	const [, { showToast }] = useToast();
	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [, { login }] = useSession();
	const { control, handleSubmit, errors, reset, register, setValue } = useForm();
	const [passwordSee, setPasswordSee] = useState(false);
	const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isFBLoading, setIsFBLoading] = useState(false);
	const [willVerifyOtpState, setWillVerifyOtpState] = useState(false)
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null,
		},
	});
	const [recaptchaConfig, setRecaptchaConfig] = useState<any>({})
	const [recaptchaVerified, setRecaptchaVerified] = useState(false)
	const [alertState, setAlertState] = useState({ open: false, title: '', content: [] })
	const [tabLayouts, setTabLayouts] = useState<any>({})
	const tabsRef = useRef<any>(null)
	const enabledPoweredByOrdering = configs?.powered_by_ordering_module?.value
	const theme = useTheme();
	const isOtpEmail = loginTab === 'otp' && otpType === 'email'
	const isOtpCellphone = loginTab === 'otp' && otpType === 'cellphone'

	const googleLoginEnabled = configs?.google_login_enabled?.value === '1' || !configs?.google_login_enabled?.enabled
	const facebookLoginEnabled = configs?.facebook_login_enabled?.value === '1' || !configs?.facebook_login_enabled?.enabled
	const appleLoginEnabled = configs?.apple_login_enabled?.value === '1' || !configs?.apple_login_enabled?.enabled

	const loginStyle = StyleSheet.create({
		btnOutline: {
			backgroundColor: '#FFF',
			color: theme.colors.primary,
			borderRadius: 7.6,
		},
		inputStyle: {
			marginBottom: 28,
			borderWidth: 1,
			// borderColor: theme.colors.border,
			borderRadius: 7.6,
		},
		line: {
			height: 1,
			backgroundColor: theme.colors.border,
			flexGrow: 1,
			marginBottom: 7,
		},
		recaptchaIcon: {
			width: 100,
			height: 100,
		},
		borderStyleBase: {
			width: 30,
			height: 45
		},

		borderStyleHighLighted: {
			borderColor: "#03DAC6",
		},

		underlineStyleBase: {
			width: 45,
			height: 60,
			borderWidth: 1,
			fontSize: 16
		},

		underlineStyleHighLighted: {
			borderColor: theme.colors.primary,
			color: theme.colors.primary,
			fontSize: 16
		},
	});

	const emailRef = useRef<any>({});
	const passwordRef = useRef<any>({});
	const recaptchaRef = useRef<any>({});

	const handleChangeTab = (val: string, otpType?: string) => {
		props.handleChangeTab(val);
		setPasswordSee(false);
		handleCategoryScroll(otpType ? `${val}_${otpType}` : val)
	};

	const onSubmit = (values?: any) => {
		Keyboard.dismiss();
		if (loginTab === 'otp') {
			if (phoneInputData.error && (loginTab !== 'otp' || (otpType === 'cellphone' && loginTab === 'otp'))) {
				showToast(ToastType.Error, t('INVALID_PHONE_NUMBER', 'Invalid phone number'));
				vibrateApp()
				return
			}
			if(!values?.cellphone && otpType === 'cellphone'){
				showToast(ToastType.Error, t('PHONE_NUMBER_REQUIRED', 'Phone number is required'));
				return
			}
			if (loginTab === 'otp') {
				generateOtpCode({
					...values,
					...phoneInputData.phone
				})
			}
			setWillVerifyOtpState(true)
		} else {
			if (phoneInputData.error) {
				showToast(ToastType.Error, phoneInputData.error);
				vibrateApp()
				return;
			}
			handleButtonLoginClick({
				...values,
				...phoneInputData.phone,
			});
		}

	};
	const handleVerifyCodeClick = () => {
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
			vibrateApp()
			return;
		}
		if (
			!phoneInputData.error &&
			!phoneInputData.phone.country_phone_code &&
			!phoneInputData.phone.cellphone
		) {
			showToast(
				ToastType.Error,
				t(
					'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
					'The field Mobile phone is required.',
				),
			);
			vibrateApp()
			return;
		}
		handleSendVerifyCode && handleSendVerifyCode(phoneInputData.phone);
		setIsLoadingVerifyModal(true);
	};

	const handleSuccessFacebook = (user: any) => {
		login({
			user,
			token: user.session.access_token,
		});
	};

	const handleChangeInputEmail = (value: string, onChange: any) => {
		onChange(value.toLowerCase().trim().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
	};

	const handleOpenRecaptcha = () => {
		setRecaptchaVerified(false)
		if (!recaptchaConfig?.siteKey) {
			showToast(ToastType.Error, t('NO_RECAPTCHA_SITE_KEY', 'The config doesn\'t have recaptcha site key'));
			vibrateApp()
			return
		}
		if (!recaptchaConfig?.baseUrl) {
			showToast(ToastType.Error, t('NO_RECAPTCHA_BASE_URL', 'The config doesn\'t have recaptcha base url'));
			vibrateApp()
			return
		}

		recaptchaRef.current.open()
	}

	const onRecaptchaVerify = (token: any) => {
		setRecaptchaVerified(true)
		handleReCaptcha({ code: token, version: recaptchaConfig?.version })
	}

	const handleChangeOtpType = (type: string) => {
		handleChangeTab('otp', type)
		setOtpType(type)
	}

	const handleLoginOtp = async (code: string) => {
		if (!code) return
		const logged = await handleButtonLoginClick({ code })
		if (logged){
			setWillVerifyOtpState(false)
		} else {
			setAlertState({
				open: true,
				title: '',
				content: t('OTP_CODE_INCORRECT', 'Otp code incorrect')
			})
		}
	}

	const closeAlert = () => {
		setAlertState({
			open: false,
			title: '',
			content: []
		})
	}

	const handleCategoryScroll = (opc: string) => {
		tabsRef.current.scrollTo({
			x: tabLayouts?.[opc]?.x - 40,
			animated: true
		})
	}

	const handleOnLayout = (event: any, opc: string) => {
		const _tabLayouts = { ...tabLayouts }
		const categoryKey = opc
		_tabLayouts[categoryKey] = event.nativeEvent.layout
		setTabLayouts(_tabLayouts)
	}

	useEffect(() => {
		if (configs && Object.keys(configs).length > 0 && enableReCaptcha) {
			if (configs?.security_recaptcha_type?.value === 'v3' &&
				configs?.security_recaptcha_score_v3?.value > 0 &&
				configs?.security_recaptcha_site_key_v3?.value
			) {
				setRecaptchaConfig({
					version: 'v3',
					siteKey: configs?.security_recaptcha_site_key_v3?.value || null,
					baseUrl: configs?.security_recaptcha_base_url?.value || null
				})
				return
			}
			if (configs?.security_recaptcha_site_key?.value) {
				setRecaptchaConfig({
					version: 'v2',
					siteKey: configs?.security_recaptcha_site_key?.value || null,
					baseUrl: configs?.security_recaptcha_base_url?.value || null
				})
			}
		}
	}, [configs, enableReCaptcha])

	useEffect(() => {
		if (!formState.loading && formState.result?.error) {
			if (formState.result?.result?.[0] === 'ERROR_AUTH_VERIFICATION_CODE') {
				setRecaptchaVerified(false)
				setRecaptchaConfig({
					version: 'v2',
					siteKey: configs?.security_recaptcha_site_key?.value || null,
					baseUrl: configs?.security_recaptcha_base_url?.value || null
				})
				showToast(ToastType.Info, t('TRY_AGAIN', 'Please try again'))
				vibrateApp()
				return
			}
			formState.result?.result &&
				showToast(
					ToastType.Error,
					typeof formState.result?.result === 'string'
						? formState.result?.result
						: formState.result?.result[0],
				);
			formState.result?.result && vibrateApp()
		}
	}, [formState]);

	useEffect(() => {
		if (verifyPhoneState && !verifyPhoneState?.loading) {
			if (verifyPhoneState.result?.error) {
				const message =
					typeof verifyPhoneState?.result?.result === 'string'
						? verifyPhoneState?.result?.result
						: verifyPhoneState?.result?.result[0];
				verifyPhoneState.result?.result && showToast(ToastType.Error, message);
				verifyPhoneState.result?.result && vibrateApp();
				setIsLoadingVerifyModal(false);
				return;
			}

			const okResult = verifyPhoneState.result?.result === 'OK';
			if (okResult) {
				!isModalVisible && setIsModalVisible(true);
				setIsLoadingVerifyModal(false);
			}
		}
	}, [verifyPhoneState]);

	useEffect(() => {
		if (phoneInputData?.phone?.cellphone) setValue('cellphone', phoneInputData?.phone?.cellphone, '')
		else setValue('cellphone', '')
	}, [phoneInputData?.phone?.cellphone])

	useEffect(() => {
		register('cellphone', {
			required: loginTab === 'cellphone'
				? t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required').replace('_attribute_', t('CELLPHONE', 'Cellphone'))
				: null
		})
	}, [register])

	useEffect(() => {
		reset()
	}, [loginTab])

	useEffect(() => {
		if (checkPhoneCodeState?.result?.error) {
			setAlertState({
				open: true,
				content: t(checkPhoneCodeState?.result?.error, checkPhoneCodeState?.result?.error),
				title: ''
			})
		}
	}, [checkPhoneCodeState])

	useEffect(() => {
		if (!!Object.values(errors)?.length) vibrateApp()
	}, [errors])

	return (
		<Container>
			{isGuest ? (
				<OText style={{ textAlign: 'center', marginBottom: 10 }} size={18}>{t('LOGIN', 'Login')}</OText>
			) : (
				<NavBar
					title={t('LOGIN', 'Login')}
					titleAlign={'center'}
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					showCall={false}
					btnStyle={{ paddingLeft: 0 }}
					titleWrapStyle={{ paddingHorizontal: 0 }}
					titleStyle={{ marginRight: 0, marginLeft: 0 }}
				/>
			)}
			<FormSide>
				{(Number(useLoginByEmail) + Number(useLoginByCellphone) + Number(useLoginOtpEmail) + Number(useLoginOtpCellphone) > 1) && (
					<LoginWith>
						<OTabs
							horizontal
							showsHorizontalScrollIndicator={false}
							ref={tabsRef}
						>
							{useLoginByEmail && (
								<TabBtn
									onPress={() => handleChangeTab('email')}
									onLayout={(event: any) => handleOnLayout(event, 'email')}
								>
									<OTab
										style={{
											borderBottomColor:
												loginTab === 'email'
													? theme.colors.textNormal
													: theme.colors.border,
										}}>
										<OText
											size={14}
											color={
												loginTab === 'email'
													? theme.colors.textNormal
													: theme.colors.disabled
											}
											weight={loginTab === 'email' ? 'bold' : 'normal'}>
											{t('LOGIN_BY_EMAIL', 'by Email')}
										</OText>
									</OTab>
								</TabBtn>
							)}
							{useLoginByCellphone && (
								<TabBtn
									onPress={() => handleChangeTab('cellphone')}
									onLayout={(event: any) => handleOnLayout(event, 'cellphone')}
								>
									<OTab
										style={{
											borderBottomColor:
												loginTab === 'cellphone'
													? theme.colors.textNormal
													: theme.colors.border,
										}}>
										<OText
											size={14}
											color={
												loginTab === 'cellphone'
													? theme.colors.textNormal
													: theme.colors.disabled
											}
											weight={loginTab === 'cellphone' ? 'bold' : 'normal'}>
											{t('LOGIN_BY_PHONE', 'by Phone')}
										</OText>
									</OTab>
								</TabBtn>
							)}
							{useLoginOtpEmail && (
								<TabBtn
									onPress={() => handleChangeOtpType('email')}
									onLayout={(event: any) => handleOnLayout(event, 'otp_email')}
								>
									<OTab
										style={{
											borderBottomColor:
												isOtpEmail
													? theme.colors.textNormal
													: theme.colors.border,
										}}>
										<OText
											size={14}
											color={
												isOtpEmail
													? theme.colors.textNormal
													: theme.colors.disabled
											}
											weight={isOtpEmail ? 'bold' : 'normal'}>
											{t('BY_OTP_EMAIL', 'By Otp Email')}
										</OText>
									</OTab>
								</TabBtn>
							)}
							{useLoginOtpCellphone && (
								<TabBtn
									onPress={() => handleChangeOtpType('cellphone')}
									onLayout={(event: any) => handleOnLayout(event, 'otp_cellphone')}
								>
									<OTab
										style={{
											borderBottomColor:
												isOtpCellphone
													? theme.colors.textNormal
													: theme.colors.border,
										}}>
										<OText
											size={14}
											color={
												isOtpCellphone
													? theme.colors.textNormal
													: theme.colors.disabled
											}
											weight={isOtpCellphone ? 'bold' : 'normal'}>
											{t('BY_OTP_PHONE', 'By Otp Phone')}
										</OText>
									</OTab>
								</TabBtn>
							)}
						</OTabs>
					</LoginWith>
				)}

				{(useLoginByCellphone || useLoginByEmail || useLoginOtp) && (
					<FormInput>
						{((useLoginByEmail && loginTab === 'email') || (loginTab === 'otp' && otpType === 'email')) && (
							<>
								{errors?.email && (
									<OText
										size={14}
										color={theme.colors.danger5}
										weight={'normal'}>
										{errors?.email?.message}{errors?.email?.type === 'required' && '*'}
									</OText>
								)}
								<Controller
									control={control}
									render={({ onChange, value }: any) => (
										<OInput
											placeholder={t('EMAIL', 'Email')}
											style={loginStyle.inputStyle}
											icon={theme.images.general.email}
											onChange={(e: any) => {
												handleChangeInputEmail(e, onChange);
											}}
											value={value}
											autoCapitalize="none"
											autoCorrect={false}
											type="email-address"
											autoCompleteType="email"
											returnKeyType="next"
											onSubmitEditing={() => passwordRef.current?.focus()}
											blurOnSubmit={false}
											forwardRef={emailRef}
											borderColor={errors?.email ? theme.colors.danger5 : theme.colors.border}
										/>
									)}
									name="email"
									rules={{
										required: {
											value: true,
											message: t(
												'VALIDATION_ERROR_EMAIL_REQUIRED',
												'The field Email is required',
											).replace('_attribute_', t('EMAIL', 'Email'))
										},
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: t(
												'INVALID_ERROR_EMAIL',
												'Invalid email address',
											).replace('_attribute_', t('EMAIL', 'Email')),
										}
									}}
									defaultValue=""
								/>
							</>

						)}
						{((useLoginByCellphone && loginTab === 'cellphone') || (loginTab === 'otp' && otpType === 'cellphone')) && (
							<View style={{ marginBottom: 28 }}>
								<PhoneInputNumber
									data={phoneInputData}
									handleData={(val: any) => setPhoneInputData(val)}
									textInputProps={{
										returnKeyType: 'next',
										onSubmitEditing: () => passwordRef?.current?.focus?.(),
									}}
									isStartValidation={errors?.cellphone}
								/>
							</View>
						)}
						{errors?.password && (
							<OText
								size={14}
								color={theme.colors.danger5}
								weight={'normal'}>
								{errors?.password?.message}{errors?.password?.type === 'required' && '*'}
							</OText>
						)}
						{loginTab !== 'otp' && (

							<Controller
								control={control}
								render={({ onChange, value }: any) => (
									<OInput
										isSecured={!passwordSee ? true : false}
										placeholder={t('PASSWORD', 'Password')}
										style={{ ...loginStyle.inputStyle, marginBottom: 14 }}
										icon={theme.images.general.lock}
										iconCustomRight={
											!passwordSee ? (
												<MaterialCommunityIcons
													name="eye-outline"
													size={24}
													onPress={() => setPasswordSee(!passwordSee)}
													color={theme.colors.disabled}
												/>
											) : (
												<MaterialCommunityIcons
													name="eye-off-outline"
													size={24}
													onPress={() => setPasswordSee(!passwordSee)}
													color={theme.colors.disabled}
												/>
											)
										}
										value={value}
										forwardRef={passwordRef}
										onChange={(val: any) => onChange(val)}
										returnKeyType="done"
										onSubmitEditing={handleSubmit(onSubmit)}
										blurOnSubmit
										borderColor={errors?.password ? theme.colors.danger5 : theme.colors.border}
									/>
								)}
								name="password"
								rules={{
									required: {
										value: true,
										message: t(
											'VALIDATION_ERROR_PASSWORD_REQUIRED',
											'The field Password is required',
										).replace('_attribute_', t('PASSWORD', 'Password'))
									}
								}}
								defaultValue=""
							/>
						)}
						{onNavigationRedirect && forgotButtonText && loginTab !== 'otp' && (
							<TouchableOpacity onPress={() => onNavigationRedirect('Forgot')}>
								<OText size={14} mBottom={18}>
									{forgotButtonText}
								</OText>
							</TouchableOpacity>
						)}

						{(enableReCaptcha && recaptchaConfig?.version) && (
							<>
								{recaptchaConfig?.version === 'v3' ? (
									<ReCaptcha
										url={recaptchaConfig?.baseUrl}
										siteKey={recaptchaConfig?.siteKey}
										containerStyle={{ height: 40 }}
										onExecute={onRecaptchaVerify}
										reCaptchaType={1}
									/>
								) : (
									<>
										<TouchableOpacity
											onPress={handleOpenRecaptcha}
										>
											<RecaptchaButton>
												{recaptchaVerified ? (
													<MaterialCommunityIcons
														name="checkbox-marked"
														size={26}
														color={theme.colors.primary}
													/>
												) : (
													<MaterialCommunityIcons
														name="checkbox-blank-outline"
														size={26}
														color={theme.colors.mediumGray}
													/>
												)}
												<OText size={14} mLeft={8}>{t('VERIFY_ReCAPTCHA', 'Verify reCAPTCHA')}</OText>
											</RecaptchaButton>
										</TouchableOpacity>
										<Recaptcha
											ref={recaptchaRef}
											siteKey={recaptchaConfig?.siteKey}
											baseUrl={recaptchaConfig?.baseUrl}
											onVerify={onRecaptchaVerify}
											onExpire={() => setRecaptchaVerified(false)}
										/>
									</>)
								}
							</>
						)}
						<OButton
							onClick={handleSubmit(onSubmit)}
							text={loginTab !== 'otp' ? loginButtonText : t('GET_VERIFY_CODE', 'Get verify code')}
							bgColor={theme.colors.primary}
							borderColor={theme.colors.primary}
							textStyle={{ color: 'white' }}
							imgRightSrc={null}
							isLoading={formState.loading}
							style={{ borderRadius: 7.6, marginTop: 10, marginBottom: 25 }}
						/>
						{onNavigationRedirect && registerButtonText && (
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
								<OText size={14}>
									{t('NEW_ON_PLATFORM', 'New on Ordering?')}
								</OText>
								<TouchableOpacity onPress={() => onNavigationRedirect('Signup')}>
									<OText size={14} mLeft={5} color={theme.colors.primary}>
										{t('CREATE_ACCOUNT', 'Create account')}
									</OText>
								</TouchableOpacity>
							</View>
						)}
					</FormInput>
				)}

				{useLoginByCellphone &&
					loginTab === 'cellphone' &&
					configs && Object.keys(configs).length > 0 &&
					(configs?.twilio_service_enabled?.value === 'true' ||
						configs?.twilio_service_enabled?.value === '1') &&
					configs?.twilio_module?.value && (
						<>
							<OrSeparator>
								<LineSeparator />
								<OText size={18} mRight={20} mLeft={20}>
									{t('OR', 'Or')}
								</OText>
								<LineSeparator />
							</OrSeparator>

							<ButtonsWrapper mBottom={20}>
								<OButton
									onClick={handleVerifyCodeClick}
									text={t('GET_VERIFY_CODE', 'Get Verify Code')}
									borderColor={theme.colors.primary}
									style={loginStyle.btnOutline}
									imgRightSrc={null}
									isLoading={isLoadingVerifyModal}
									indicatorColor={theme.colors.primary}
								/>
							</ButtonsWrapper>
						</>
					)}

				{configs && Object.keys(configs).length > 0 ? (
					(((configs?.facebook_login?.value === 'true' || configs?.facebook_login?.value === '1') && configs?.facebook_id?.value && facebookLoginEnabled) ||
						((configs?.google_login_client_id?.value !== '' && configs?.google_login_client_id?.value !== null) && googleLoginEnabled) ||
						((configs?.apple_login_client_id?.value !== '' && configs?.apple_login_client_id?.value !== null) && appleLoginEnabled)) && !isGuest &&
					(
						<>
							<View
								style={{
									flexDirection: 'row',
									width: '100%',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginVertical: 15
								}}>
								<View style={loginStyle.line} />
								<OText
									size={14}
									mBottom={10}
									style={{ paddingHorizontal: 19 }}
									color={theme.colors.disabled}>
									{t('OR', 'or')}
								</OText>
								<View style={loginStyle.line} />
							</View>
							<ButtonsWrapper>
								<SocialButtons>
									{(configs?.facebook_login?.value === 'true' || configs?.facebook_login?.value === '1') &&
										configs?.facebook_id?.value &&
										facebookLoginEnabled && (
											<FacebookLogin
												notificationState={notificationState}
												handleErrors={(err: any) => { showToast(ToastType.Error, err), vibrateApp() }}
												handleLoading={(val: boolean) => setIsFBLoading(val)}
												handleSuccessFacebookLogin={handleSuccessFacebook}
											/>
										)}
									{(configs?.google_login_client_id?.value !== '' && configs?.google_login_client_id?.value !== null) && googleLoginEnabled && (
										<GoogleLogin
											notificationState={notificationState}
											webClientId={configs?.google_login_client_id?.value}
											handleErrors={(err: any) => { showToast(ToastType.Error, err), vibrateApp() }}
											handleLoading={(val: boolean) => setIsFBLoading(val)}
											handleSuccessGoogleLogin={handleSuccessFacebook}
										/>
									)}
									{(configs?.apple_login_client_id?.value !== '' && configs?.google_login_client_id?.value !== null) && appleLoginEnabled && (
										<AppleLogin
											notificationState={notificationState}
											handleErrors={(err: any) => { showToast(ToastType.Error, err), vibrateApp() }}
											handleLoading={(val: boolean) => setIsFBLoading(val)}
											handleSuccessAppleLogin={handleSuccessFacebook}
										/>
									)}
								</SocialButtons>
							</ButtonsWrapper>
						</>
					)
				) : (
					<SkeletonWrapper>
						<Placeholder Animation={Fade}>
							<PlaceholderLine
								height={20}
								style={{ marginBottom: 15, marginTop: 10 }}
							/>
							<PlaceholderLine
								height={50}
								style={{ borderRadius: 25, marginBottom: 25 }}
							/>
						</Placeholder>
					</SkeletonWrapper>
				)}

				{enabledPoweredByOrdering && (
					<OText>
						Powered By Ordering.co
					</OText>
				)}
			</FormSide>
			<OModal
				open={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				entireModal
				title={t('VERIFY_PHONE', 'Verify Phone')}
			>
				<VerifyPhone
					phone={phoneInputData.phone}
					verifyPhoneState={verifyPhoneState}
					checkPhoneCodeState={checkPhoneCodeState}
					handleCheckPhoneCode={handleCheckPhoneCode}
					setCheckPhoneCodeState={setCheckPhoneCodeState}
					handleVerifyCodeClick={handleVerifyCodeClick}
					onClose={() => setIsModalVisible(false)}
				/>
			</OModal>
			<OModal
				open={willVerifyOtpState}
				onClose={() => setWillVerifyOtpState(false)}
				entireModal
				title={t('ENTER_VERIFICATION_CODE', 'Enter verification code')}
			>
				<Otp
					willVerifyOtpState={willVerifyOtpState}
					setWillVerifyOtpState={setWillVerifyOtpState}
					handleLoginOtp={handleLoginOtp}
					onSubmit={onSubmit}
					setAlertState={setAlertState}
				/>
			</OModal>
			<Alert
				open={alertState.open}
				content={alertState.content}
				title={alertState.title || ''}
				onAccept={closeAlert}
				onClose={closeAlert}
			/>
			<Spinner visible={isFBLoading} />
		</Container>
	);
};

export const LoginForm = (props: any) => {
	const loginProps = {
		...props,
		isRecaptchaEnable: true,
		UIComponent: LoginFormUI,
	};
	return <LoginFormController {...loginProps} />;
};
