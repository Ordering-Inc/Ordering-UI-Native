import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Linking, Platform, TouchableOpacity, Vibration } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import { PhoneInputNumber } from '../PhoneInputNumber';
import { FacebookLogin } from '../FacebookLogin';
import Recaptcha from 'react-native-recaptcha-that-works'
import ReCaptcha from '@fatnlazycat/react-native-recaptcha-v3'

import {
	SignupForm as SignUpController,
	useLanguage,
	useConfig,
	useSession,
	ToastType,
	useToast,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { FormSide, FormInput, SocialButtons } from './styles';
import { Otp } from '../LoginForm/Otp'

import {
	ButtonsWrapper,
	LoginWith as SignupWith,
	TabBtn,
	OTab,
	OTabs,
	RecaptchaButton
} from '../LoginForm/styles';

import NavBar from '../NavBar';
import { VerifyPhone } from '../VerifyPhone';

import Alert from '../../../../../src/providers/AlertProvider'
import { OText, OButton, OInput } from '../shared';
import { OModal } from '../../../../../src/components/shared';
import { SignupParams } from '../../types';
import { sortInputFields } from '../../utils';
import { GoogleLogin } from '../GoogleLogin';
import { AppleLogin } from '../AppleLogin';

const notValidationFields = [
	'coupon',
	'driver_tip',
	'mobile_phone',
	'address',
	'address_notes',
];

const SignupFormUI = (props: SignupParams) => {
	const {
		navigation,
		loginButtonText,
		signupButtonText,
		onNavigationRedirect,
		formState,
		validationFields,
		showField,
		isRequiredField,
		useChekoutFileds,
		useSignupByEmail,
		useSignupByCellphone,
		handleSuccessSignup,
		handleButtonSignupClick,
		verifyPhoneState,
		checkPhoneCodeState,
		setCheckPhoneCodeState,
		handleSendVerifyCode,
		handleCheckPhoneCode,
		notificationState,
		handleChangePromotions,
		enableReCaptcha,
		handleReCaptcha,
		generateOtpCode,
		numOtpInputs,
		setWillVerifyOtpState,
		handleChangeInput,
		willVerifyOtpState,
		setOtpState,
		setSignUpTab,
		signUpTab,
		useSignUpFullDetails,
		useSignUpOtpEmail,
		useSignUpOtpCellphone,
		isGuest
	} = props;

	const theme = useTheme();

	const style = StyleSheet.create({
		btnOutline: {
			backgroundColor: '#FFF',
			color: theme.colors.primary,
		},
		inputStyle: {
			marginBottom: 20,
			borderWidth: 1,
			borderRadius: 7.6,
		},
		wrappText: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 30,
		},
		line: {
			height: 1,
			backgroundColor: theme.colors.border,
			flexGrow: 1,
			marginBottom: 7,
		},
		checkBoxStyle: {
			width: 25,
			height: 25,
		}
	});

	const [, { showToast }] = useToast();
	const [, t] = useLanguage();
	const [, { login }] = useSession();
	const [{ configs }] = useConfig();
	const { control, handleSubmit, clearErrors, errors, register, unregister, setValue } = useForm();

	const [passwordSee, setPasswordSee] = useState(false);
	const [formValues, setFormValues] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
	const [isFBLoading, setIsFBLoading] = useState(false);
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null,
			country_code: null
		},
	});
	const [alertState, setAlertState] = useState({ open: false, title: '', content: [] })
	const [recaptchaConfig, setRecaptchaConfig] = useState<any>({})
	const [recaptchaVerified, setRecaptchaVerified] = useState(false)
	const [tabLayouts, setTabLayouts] = useState<any>({})

	const tabsRef = useRef<any>(null)
	const nameRef = useRef<any>(null);
	const lastnameRef = useRef<any>(null);
	const middleNameRef = useRef<any>(null);
	const secondLastnameRef = useRef<any>(null);
	const emailRef = useRef<any>(null);
	const phoneRef = useRef<any>(null);
	const passwordRef = useRef<any>(null);
	const recaptchaRef = useRef<any>({});

	const showInputPhoneNumber = (validationFields?.fields?.checkout?.cellphone?.enabled ?? false) || configs?.verification_phone_required?.value === '1'
	const googleLoginEnabled = configs?.google_login_enabled?.value === '1' || !configs?.google_login_enabled?.enabled
	const facebookLoginEnabled = configs?.facebook_login_enabled?.value === '1' || !configs?.facebook_login_enabled?.enabled
	const appleLoginEnabled = configs?.apple_login_enabled?.value === '1' || !configs?.apple_login_enabled?.enabled

	const closeAlert = () => {
		setAlertState({
			open: false,
			title: '',
			content: []
		})
	}

	const handleRefs = (ref: any, code: string) => {
		switch (code) {
			case 'name': {
				nameRef.current = ref;
				break;
			}
			case 'middle_name': {
				middleNameRef.current = ref;
			}
			case 'lastname': {
				lastnameRef.current = ref;
				break;
			}
			case 'second_lastname': {
				secondLastnameRef.current = ref;
				break;
			}
			case 'email': {
				emailRef.current = ref;
				break;
			}
		}
	};

	const handleOnLayout = (event: any, opc: string) => {
		const _tabLayouts = { ...tabLayouts }
		const categoryKey = opc
		_tabLayouts[categoryKey] = event.nativeEvent.layout
		setTabLayouts(_tabLayouts)
	}

	const handleFocusRef = (code: string) => {
		switch (code) {
			case 'name': {
				nameRef?.current?.focus();
				break;
			}
			case 'middle_name': {
				middleNameRef?.current?.focus();
				break;
			}
			case 'lastname': {
				lastnameRef?.current?.focus();
				break;
			}
			case 'second_lastname': {
				secondLastnameRef?.current?.focus();
				break;
			}
			case 'email': {
				emailRef?.current?.focus();
				break;
			}
		}
	};

	const getNextFieldCode = (index: number) => {
		const fields = sortInputFields({
			values: validationFields?.fields?.checkout,
		})?.filter(
			(field: any) =>
				!notValidationFields.includes(field.code) && showField(field.code),
		);
		return fields[index + 1]?.code;
	};

	const handleSuccessFacebook = (user: any) => {
		login({
			user,
			token: user.session.access_token,
		});
		navigation.navigate('Home');
	};

	const handleSignUpTab = (tab: string) => {
		setSignUpTab && setSignUpTab(tab)
		clearErrors()
	}

	const onSubmit = (values?: any) => {
		if (phoneInputData.error && signUpTab !== 'otpEmail') {
			showToast(ToastType.Error, phoneInputData.error);
			Vibration.vibrate()
			return;
		}
		if (
			!phoneInputData.phone.country_phone_code &&
			!phoneInputData.phone.cellphone &&
			((validationFields?.fields?.checkout?.cellphone?.enabled &&
				validationFields?.fields?.checkout?.cellphone?.required) ||
				configs?.verification_phone_required?.value === '1') &&
			signUpTab !== 'otpEmail'
		) {
			showToast(
				ToastType.Error,
				t(
					'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
					'The field Mobile phone is required.',
				),
			);
			Vibration.vibrate()
			return;
		}
		if (signUpTab === 'otpEmail' || signUpTab === 'otpCellphone') {
			generateOtpCode && generateOtpCode({
				...values,
				...((phoneInputData.phone.cellphone !== null && phoneInputData.phone.country_phone_code !== null) && { ...phoneInputData.phone }),
				country_code: phoneInputData.phone.country_code
			})
			return
		}
		handleButtonSignupClick &&
			handleButtonSignupClick({
				...values,
				...((phoneInputData.phone.cellphone !== null && phoneInputData.phone.country_phone_code !== null) && { ...phoneInputData.phone }),
				country_code: phoneInputData.phone.country_code
			});
		if (!formState.loading && formState.result.result && !formState.result.error) {
			handleSuccessSignup && handleSuccessSignup(formState.result.result);
		}
	};

	const handleSingUpOtp = (value: string) => {
		setOtpState && setOtpState(value)
	}

	const handleVerifyCodeClick = (values: any) => {
		const formData = values || formValues;
		handleSendVerifyCode &&
			handleSendVerifyCode({
				...formData,
				...phoneInputData.phone,
			});
		setIsLoadingVerifyModal(true);
	};

	// get object with rules for hook form inputs
	const getInputRules = (field: any) => {
		const rules: any = {
			required: isRequiredField(field.code)
				? t(
					`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`,
					`${field.name} is required`,
				).replace('_attribute_', t(field.name, field.code))
				: null,
		};
		if (field.code && field.code === 'email') {
			rules.pattern = {
				value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace(
					'_attribute_',
					t('EMAIL', 'Email'),
				),
			};
		}
		return rules;
	};

	const handleChangeInputEmail = (value: string, onChange: any) => {
		onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
	};

	const handleOpenTermsUrl = async (url: any) => {
		const supported = await Linking.canOpenURL(url);

		if (supported) {
			await Linking.openURL(url);
		} else {
			showToast(ToastType.Error, t('VALIDATION_ERROR_ACTIVE_URL', 'The _attribute_ is not a valid URL.').replace('_attribute_', t('URL', 'URL')))
			Vibration.vibrate()
		}
	}

	const handleOpenRecaptcha = () => {
		setRecaptchaVerified(false)
		if (!recaptchaConfig?.siteKey) {
			showToast(ToastType.Error, t('NO_RECAPTCHA_SITE_KEY', 'The config doesn\'t have recaptcha site key'));
			Vibration.vibrate()
			return
		}
		if (!recaptchaConfig?.baseUrl) {
			showToast(ToastType.Error, t('NO_RECAPTCHA_BASE_URL', 'The config doesn\'t have recaptcha base url'));
			Vibration.vibrate()
			return
		}
		recaptchaRef.current.open()
	}

	const onRecaptchaVerify = (token: any) => {
		setRecaptchaVerified(true)
		handleReCaptcha && handleReCaptcha({ code: token, version: recaptchaConfig?.version })
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
				Vibration.vibrate()
				return
			}
			formState.result?.result && showToast(ToastType.Error, formState.result?.result[0]);
			formState.result?.result && Vibration.vibrate()
			setIsLoadingVerifyModal(false);
		}
	}, [formState]);

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			setIsLoadingVerifyModal(false);
			Vibration.vibrate()
		}
	}, [errors])

	useEffect(() => {
		if (signUpTab === 'default' || signUpTab === 'otpCellphone') {
			register('cellphone', {
				required: isRequiredField('cellphone')
					? t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required').replace('_attribute_', t('CELLPHONE', 'Cellphone'))
					: null
			})
		} else {
			unregister('cellphone')
		}
	}, [signUpTab])

	useEffect(() => {
		if (phoneInputData?.phone?.cellphone) setValue('cellphone', phoneInputData?.phone?.cellphone, '')
		else setValue('cellphone', '')
	}, [phoneInputData?.phone?.cellphone])

	useEffect(() => {
		if (verifyPhoneState && !verifyPhoneState?.loading) {
			if (verifyPhoneState.result?.error) {
				const message =
					typeof verifyPhoneState?.result?.result === 'string'
						? verifyPhoneState?.result?.result
						: verifyPhoneState?.result?.result[0];
				verifyPhoneState.result?.result && showToast(ToastType.Error, message);
				verifyPhoneState.result?.result && Vibration.vibrate()
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
		setPhoneInputData({
			...phoneInputData,
			phone: {
				...phoneInputData.phone,
				country_code: configs?.default_country_code?.value
			}
		})
	}, [configs])

	useEffect(() => {
		if (checkPhoneCodeState?.result?.error) {
			setAlertState({
				open: true,
				title: (typeof checkPhoneCodeState?.result?.result === 'string' ? checkPhoneCodeState?.result?.result : checkPhoneCodeState?.result?.result[0].toString()) || t('ERROR', 'Error'),
				content: []
			})
		}
	}, [checkPhoneCodeState])

	return (
		<View>
			{isGuest ? (
				<OText style={{ textAlign: 'center', marginBottom: 10 }} size={18}>{t('SIGNUP', 'Signup')}</OText>
			) : (
				<NavBar
					title={t('SIGNUP', 'Signup')}
					titleAlign={'center'}
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					showCall={false}
					btnStyle={{ paddingLeft: 0 }}
					titleWrapStyle={{ paddingHorizontal: 0 }}
					titleStyle={{ marginLeft: 0, marginRight: 0 }}
				/>
			)}
			<FormSide>
				{((Number(useSignUpFullDetails) + Number(useSignUpOtpEmail) + Number(useSignUpOtpCellphone)) > 1) && (
					<SignupWith>
						<OTabs
							horizontal
							showsHorizontalScrollIndicator={false}
							ref={tabsRef}
						>
							{useSignUpFullDetails && (
								<TabBtn
									onPress={() => handleSignUpTab('default')}
									onLayout={(event: any) => handleOnLayout(event, 'default')}
								>
									<OTab
										style={{
											borderBottomColor:
												signUpTab === 'default'
													? theme.colors.textNormal
													: theme.colors.border,
										}}>
										<OText
											size={14}
											color={
												signUpTab === 'default'
													? theme.colors.textNormal
													: theme.colors.disabled
											}
											weight={signUpTab === 'default' ? 'bold' : 'normal'}>
											{t('DEFAULT', 'Default')}
										</OText>
									</OTab>
								</TabBtn>
							)}
							{useSignUpOtpEmail && (
								<TabBtn
									onPress={() => handleSignUpTab('otpEmail')}
									onLayout={(event: any) => handleOnLayout(event, 'otpEmail')}
								>
									<OTab
										style={{
											borderBottomColor:
												signUpTab === 'otpEmail'
													? theme.colors.textNormal
													: theme.colors.border,
										}}>
										<OText
											size={14}
											color={
												signUpTab === 'otpEmail'
													? theme.colors.textNormal
													: theme.colors.disabled
											}
											weight={signUpTab === 'otpEmail' ? 'bold' : 'normal'}>
											{t('BY_OTP_EMAIL', 'by Otp Email')}
										</OText>
									</OTab>
								</TabBtn>

							)}
							{useSignUpOtpCellphone && (
								<TabBtn
									onPress={() => handleSignUpTab('otpCellphone')}
									onLayout={(event: any) => handleOnLayout(event, 'otpCellphone')}
								>
									<OTab
										style={{
											borderBottomColor:
												signUpTab === 'otpCellphone'
													? theme.colors.textNormal
													: theme.colors.border,
										}}>
										<OText
											size={14}
											color={
												signUpTab === 'otpCellphone'
													? theme.colors.textNormal
													: theme.colors.disabled
											}
											weight={signUpTab === 'otpCellphone' ? 'bold' : 'normal'}>
											{t('BY_OTP_CELLPHONE', 'by Otp Cellphone')}
										</OText>
									</OTab>
								</TabBtn>
							)}
						</OTabs>
					</SignupWith>
				)}
				<FormInput>
					{!(useChekoutFileds && validationFields?.loading) ? (
						<>
							{sortInputFields({
								values: validationFields?.fields?.checkout,
							}).map(
								(field: any, i: number) =>
									!notValidationFields.includes(field.code) &&
									showField &&
									showField(field.code) &&
									(signUpTab === 'default' ||
										(signUpTab === 'otpEmail' && field.code === 'email')) && (
										<React.Fragment key={field.id}>
											{errors?.[`${field.code}`] && (
												<OText
													size={14}
													color={theme.colors.danger5}
													weight={'normal'}>
													{errors?.[`${field.code}`]?.message} {errors?.[`${field.code}`]?.type === 'required' && '*'}
												</OText>
											)}
											<Controller
												control={control}
												render={({ onChange, value }: any) => (
													<OInput
														placeholder={t(field.name?.replace(/\s/g, '_')?.toUpperCase(), field.name)}
														style={style.inputStyle}
														icon={
															field.code === 'email'
																? theme.images.general.email
																: theme.images.general.user
														}
														value={value}
														onChange={(val: any) =>
															field.code !== 'email'
																? (onChange(val))
																: handleChangeInputEmail(val, onChange)
														}
														autoCapitalize={
															field.code === 'email' ? 'none' : 'sentences'
														}
														autoCorrect={field.code === 'email' && false}
														type={
															field.code === 'email' ? 'email-address' : 'default'
														}
														autoCompleteType={
															field.code === 'email' ? 'email' : 'off'
														}
														returnKeyType="next"
														blurOnSubmit={false}
														forwardRef={(ref: any) => handleRefs(ref, field.code)}
														onSubmitEditing={() =>
															field.code === 'email'
																? phoneRef?.current?.focus?.()
																: handleFocusRef(getNextFieldCode(i))
														}
														borderColor={errors?.[`${field.code}`] ? theme.colors.danger5 : theme.colors.border}
													/>
												)}
												name={field.code}
												rules={getInputRules(field)}
												defaultValue=""
											/>
										</React.Fragment>
									),
							)}

							{(!!showInputPhoneNumber && (signUpTab === 'default' || signUpTab === 'otpCellphone')) && (
								<View style={{ marginBottom: 25 }}>
									<PhoneInputNumber
										data={phoneInputData}
										handleData={(val: any) => setPhoneInputData({
											...phoneInputData,
											...val,
											phone: {
												...phoneInputData.phone,
												...val.phone,
												country_code: phoneInputData.phone.country_code
											}
										})}
										forwardRef={phoneRef}
										changeCountry={(val: any) => setPhoneInputData({
											...phoneInputData,
											phone: {
												...phoneInputData.phone,
												country_code: val.cca2
											}
										})}
										textInputProps={{
											returnKeyType: 'next',
											onSubmitEditing: () => passwordRef?.current?.focus?.(),
										}}
										isStartValidation={errors?.cellphone}
									/>
								</View>
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
												style={{ marginHorizontal: 4, marginBottom: 10 }}
											>
												<RecaptchaButton>
													{recaptchaVerified ? (
														<MaterialCommunityIcons
															name="checkbox-marked"
															size={23}
															color={theme.colors.primary}
														/>
													) : (
														<MaterialCommunityIcons
															name="checkbox-blank-outline"
															size={23}
															color={theme.colors.disabled}
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
										</>
									)}

								</>
							)}
							{(signUpTab === 'default') && (
								<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
									<Controller
										control={control}
										render={({ onChange, value }: any) => (
											<CheckBox
												value={value}
												onValueChange={newValue => {
													onChange(newValue)
													handleChangePromotions()
												}}
												boxType={'square'}
												tintColors={{
													true: theme.colors.primary,
													false: theme.colors.disabled
												}}
												tintColor={theme.colors.disabled}
												onCheckColor={theme.colors.primary}
												onTintColor={theme.colors.primary}
												style={Platform.OS === 'ios' && style.checkBoxStyle}
											/>
										)}
										name='promotions'
										defaultValue={false}
									/>
									<OText style={{ fontSize: 14, paddingHorizontal: 5 }}>{t('RECEIVE_NEWS_EXCLUSIVE_PROMOTIONS', 'Receive newsletters and exclusive promotions')}</OText>
								</View>
							)}
							{configs?.terms_and_conditions?.value === 'true' && (
								<>
									{errors?.termsAccept && (
										<OText
											size={14}
											color={theme.colors.danger5}
											weight={'normal'}>
											{errors?.termsAccept?.message}*
										</OText>
									)}
									<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
										<Controller
											control={control}
											render={({ onChange, value }: any) => (
												<CheckBox
													value={value}
													onValueChange={newValue => {
														onChange(newValue)
													}}
													boxType={'square'}
													tintColors={{
														true: theme.colors.primary,
														false: theme.colors.disabled
													}}
													tintColor={theme.colors.disabled}
													onCheckColor={theme.colors.primary}
													onTintColor={theme.colors.primary}
													style={Platform.OS === 'ios' && style.checkBoxStyle}
												/>
											)}
											name='termsAccept'
											rules={{
												required: t('VALIDATION_ERROR_ACCEPTED', 'The _attribute_ must be accepted.').replace('_attribute_', t('TERMS_AND_CONDITIONS', 'Terms & Conditions'))
											}}
											defaultValue={false}
										/>
										<OText style={{ fontSize: 14, paddingHorizontal: 5 }}>{t('TERMS_AND_CONDITIONS_TEXT', 'I agree with')}</OText>
										<OButton
											imgRightSrc={null}
											text={t('TERMS_AND_CONDITIONS', 'Terms & Conditions')}
											bgColor='#FFF'
											borderColor='#FFF'
											style={{ paddingLeft: 0, paddingRight: 0, height: 30, shadowColor: '#FFF' }}
											textStyle={{ color: theme.colors.primary, marginLeft: 0, marginRight: 0 }}
											onClick={() => handleOpenTermsUrl(configs?.terms_and_conditions_url?.value)}
										/>
									</View>
								</>

							)}

							{signUpTab === 'default' && (
								<>
									{errors?.password && (
										<OText
											size={14}
											color={theme.colors.danger5}
											weight={'normal'}>
											{errors?.password?.message} {errors?.password?.type === 'required' && '*'}
										</OText>
									)}
									<Controller
										control={control}
										render={({ onChange, value }: any) => (
											<OInput
												isSecured={!passwordSee ? true : false}
												placeholder={t('PASSWORD', 'Password')}
												style={style.inputStyle}
												icon={theme.images.general.lock}
												iconCustomRight={
													!passwordSee ? (
														<MaterialCommunityIcons
															name="eye-outline"
															color={theme.colors.disabled}
															size={24}
															onPress={() => setPasswordSee(!passwordSee)}
														/>
													) : (
														<MaterialCommunityIcons
															name="eye-off-outline"
															color={theme.colors.disabled}
															size={24}
															onPress={() => setPasswordSee(!passwordSee)}
														/>
													)
												}
												value={value}
												onChange={(val: any) => onChange(val)}
												returnKeyType="done"
												onSubmitEditing={handleSubmit(onSubmit)}
												blurOnSubmit
												forwardRef={passwordRef}
												borderColor={errors?.password ? theme.colors.danger5 : theme.colors.border}
											/>
										)}
										name="password"
										rules={{
											required: isRequiredField('password')
												? t(
													'VALIDATION_ERROR_PASSWORD_REQUIRED',
													'The field Password is required',
												).replace('_attribute_', t('PASSWORD', 'password'))
												: null,
											minLength: {
												value: 8,
												message: t(
													'VALIDATION_ERROR_PASSWORD_MIN_STRING',
													'The Password must be at least 8 characters.',
												)
													.replace('_attribute_', t('PASSWORD', 'Password'))
													.replace('_min_', 8),
											},
										}}
										defaultValue=""
									/>
								</>

							)}
						</>
					) : (
						<Spinner visible />
					)}

					{(signUpTab === 'otpEmail' || signUpTab === 'otpCellphone') ? (
						<OButton
							onClick={handleSubmit(onSubmit)}
							text={t('GET_VERIFY_CODE', 'Get Verify Code')}
							borderColor={theme.colors.primary}
							imgRightSrc={null}
							textStyle={{ color: 'white' }}
							isLoading={isLoadingVerifyModal}
							indicatorColor={theme.colors.white}
							style={{ borderRadius: 7.6, marginTop: 6 }}
						/>
					) : (
						<OButton
							onClick={handleSubmit(onSubmit)}
							text={signupButtonText}
							bgColor={theme.colors.primary}
							borderColor={theme.colors.primary}
							textStyle={{ color: 'white' }}
							imgRightSrc={null}
							isDisabled={formState.loading || validationFields.loading}
							style={{ borderRadius: 7.6, marginTop: 6, shadowOpacity: 0 }}
						/>
					)}
				</FormInput>

				{
					onNavigationRedirect && loginButtonText && (
						<View style={style.wrappText}>
							<OText size={14} style={{ marginRight: 5 }}>
								{t('MOBILE_FRONT_ALREADY_HAVE_AN_ACCOUNT', 'Already have an account?')}
							</OText>
							<Pressable onPress={() => onNavigationRedirect('Login')}>
								<OText size={14} color={theme.colors.primary}>
									{loginButtonText}
								</OText>
							</Pressable>
						</View>
					)
				}
				{configs && Object.keys(configs).length > 0 && !isGuest && (
					(((configs?.facebook_login?.value === 'true' || configs?.facebook_login?.value === '1') && configs?.facebook_id?.value && facebookLoginEnabled) ||
						((configs?.google_login_client_id?.value !== '' && configs?.google_login_client_id?.value !== null) && googleLoginEnabled) ||
						((configs?.apple_login_client_id?.value !== '' && configs?.apple_login_client_id?.value !== null) && appleLoginEnabled)) &&
					(
						<>
							<View
								style={{
									flexDirection: 'row',
									width: '100%',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginVertical: 30,
								}}>
								<View style={style.line} />
								<OText
									size={14}
									mBottom={10}
									style={{ paddingHorizontal: 19 }}
									color={theme.colors.disabled}>
									{t('OR', 'or')}
								</OText>
								<View style={style.line} />
							</View>
							<ButtonsWrapper>
								<SocialButtons>
									{(configs?.facebook_login?.value === 'true' || configs?.facebook_login?.value === '1') &&
										configs?.facebook_id?.value &&
										facebookLoginEnabled &&
										(
											<FacebookLogin
												notificationState={notificationState}
												handleErrors={(err: any) => { showToast(ToastType.Error, err), Vibration.vibrate() }}
												handleLoading={(val: boolean) => setIsFBLoading(val)}
												handleSuccessFacebookLogin={handleSuccessFacebook}
											/>
										)}
									{(configs?.google_login_client_id?.value !== '' && configs?.google_login_client_id?.value !== null) && googleLoginEnabled && (
										<GoogleLogin
											notificationState={notificationState}
											webClientId={configs?.google_login_client_id?.value}
											handleErrors={(err: any) => { showToast(ToastType.Error, err), Vibration.vibrate() }}
											handleLoading={(val: boolean) => setIsFBLoading(val)}
											handleSuccessGoogleLogin={handleSuccessFacebook}
										/>
									)}
									{(configs?.apple_login_client_id?.value !== '' && configs?.apple_login_client_id?.value !== null) && appleLoginEnabled && (
										<AppleLogin
											notificationState={notificationState}
											handleErrors={(err: any) => { showToast(ToastType.Error, err), Vibration.vibrate() }}
											handleLoading={(val: boolean) => setIsFBLoading(val)}
											handleSuccessAppleLogin={handleSuccessFacebook}
										/>
									)}
								</SocialButtons>
							</ButtonsWrapper>
						</>
					)
				)}
			</FormSide>
			<OModal
				open={willVerifyOtpState}
				onClose={() => setWillVerifyOtpState && setWillVerifyOtpState(false)}
				entireModal
				title={t('ENTER_VERIFICATION_CODE', 'Enter verification code')}
			>
				<Otp
					pinCount={numOtpInputs || 6}
					willVerifyOtpState={willVerifyOtpState || false}
					setWillVerifyOtpState={() => setWillVerifyOtpState && setWillVerifyOtpState(false)}
					handleLoginOtp={handleSingUpOtp}
					onSubmit={onSubmit}
					setAlertState={setAlertState}
				/>
			</OModal>
			<Spinner
				visible={formState.loading || validationFields.loading || isFBLoading}
			/>
			<Alert
				open={alertState.open}
				content={alertState.content}
				title={alertState.title || ''}
				onAccept={closeAlert}
				onClose={closeAlert}
			/>
		</View>
	);
};

export const SignupForm = (props: any) => {
	const _numOtpInputs = 6
	const signupProps = {
		...props,
		numOtpInputs: _numOtpInputs,
		isRecaptchaEnable: true,
		UIComponent: SignupFormUI,
	};
	return <SignUpController {...signupProps} />;
};
