import React, { createRef, useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Keyboard, TextStyle, Linking, TouchableOpacity, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { PhoneInputNumber } from '../PhoneInputNumber'
import { FacebookLogin } from '../FacebookLogin'

import {
	SignupForm as SignUpController,
	useLanguage,
	useConfig,
	useSession,
	ToastType, useToast
} from 'ordering-components/native';

import {
	FormSide,
	FormInput,
	ButtonsSection,
	SocialButtons,
	InputWrapper
} from './styles'

import { LoginWith as SignupWith, OTab, OTabs } from '../LoginForm/styles'

import { _removeStoreData } from '../../providers/StoreUtil';
import NavBar from '../NavBar'
import { VerifyPhone } from '../VerifyPhone';

import { OText, OButton, OInput, OModal, OIcon } from '../shared';
import CheckBox from '@react-native-community/checkbox';
import { SignupParams } from '../../types';
import { useTheme } from 'styled-components/native';
import { sortInputFields } from '../../utils';
import { useWindowDimensions } from 'react-native';

const notValidationFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'address_notes']

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
		hasNav
	} = props

	const theme = useTheme();

	const registerStyles = StyleSheet.create({
		btnOutline: {
			backgroundColor: '#FFF',
			color: theme.colors.primary
		},
		inputStyle: {
			marginBottom: 0,
			borderWidth: 0,
			height: 40,
		},
		inputHead: {
			flexBasis: '32%',
		},
		socialButton: {
			height: 40,
			paddingTop: 0,
			paddingBottom: 0,
			alignItems: 'center',
			justifyContent: 'flex-start',
			flexDirection: 'row',
			marginBottom: 20
		},
		socialText: {
			fontSize: 14,
			lineHeight: 20,
			fontWeight: '600',
			color: theme.colors.white,
			textTransform: 'capitalize',
			textAlign: 'center',
			flexGrow: 1,
		},
		wrappText: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 30
		},
		checkBoxStyle: {
      width: 25,
      height: 25,
    }
	});
	const showInputPhoneNumber = validationFields?.fields?.checkout?.cellphone?.enabled ?? false

	const [, { showToast }] = useToast();
	const [, t] = useLanguage();
	const [, { login }] = useSession();
	const [{ configs }] = useConfig();
	const { control, handleSubmit, errors } = useForm();

	const [passwordSee, setPasswordSee] = useState(false);
	const [formValues, setFormValues] = useState(null)
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
	const [signupTab, setSignupTab] = useState(useSignupByCellphone && !useSignupByEmail ? 'cellphone' : 'email')
	const [isFBLoading, setIsFBLoading] = useState(false)
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null
		}
	});

	const { width } = useWindowDimensions();

	const nameRef = useRef<any>(null)
	const lastnameRef = useRef<any>(null)
	const middleNameRef = useRef<any>(null)
	const secondLastnameRef = useRef<any>(null)
	const emailRef = useRef<any>(null)
	const phoneRef = useRef<any>(null)
	const passwordRef = useRef<any>(null)

	const handleRefs = (ref: any, code: string) => {
		switch (code) {
			case 'name': {
				nameRef.current = ref
				break
			}
			case 'middle_name': {
				middleNameRef.current = ref
			}
			case 'lastname': {
				lastnameRef.current = ref
				break
			}
			case 'second_lastname': {
				secondLastnameRef.current = ref
				break
			}
			case 'email': {
				emailRef.current = ref
				break
			}
		}
	}

	const handleFocusRef = (code: string) => {
		switch (code) {
			case 'name': {
				nameRef?.current?.focus()
				break
			}
			case 'middle_name': {
				middleNameRef?.current?.focus()
				break
			}
			case 'lastname': {
				lastnameRef?.current?.focus()
				break
			}
			case 'second_lastname': {
				secondLastnameRef?.current?.focus()
				break
			}
			case 'email': {
				emailRef?.current?.focus()
				break
			}
		}
	}

	const getNextFieldCode = (index: number) => {
		const fields = sortInputFields({ values: validationFields?.fields?.checkout })?.filter((field: any) => !notValidationFields.includes(field.code) && showField(field.code))
		return fields[index + 1]?.code
	}

	const handleSuccessFacebook = (user: any) => {
		_removeStoreData('isGuestUser')
		login({
			user,
			token: user.session.access_token
		})
	}

	const handleChangeTab = (val: string) => {
		setSignupTab(val);
		setPasswordSee(false);
	}

	const onSubmit = (values: any) => {
		Keyboard.dismiss()
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
			return
		}
		if (
			!phoneInputData.phone.country_phone_code &&
			!phoneInputData.phone.cellphone &&
			validationFields?.fields?.checkout?.cellphone?.enabled &&
			validationFields?.fields?.checkout?.cellphone?.required
		) {
			showToast(ToastType.Error, t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.'))
			return
		}
		if (signupTab === 'email' || !useSignupByCellphone) {
			handleButtonSignupClick && handleButtonSignupClick({
				...values,
				...phoneInputData.phone
			})
			if (!formState.loading && formState.result.result && !formState.result.error) {
				handleSuccessSignup && handleSuccessSignup(formState.result.result)
			}
			return
		}
		setFormValues(values)
		handleVerifyCodeClick(values)
	}

	const handleVerifyCodeClick = (values: any) => {
		const formData = values || formValues
		handleSendVerifyCode && handleSendVerifyCode({
			...formData,
			...phoneInputData.phone
		})
		setIsLoadingVerifyModal(true)
	}

	// get object with rules for hook form inputs
	const getInputRules = (field: any) => {
		const rules: any = {
			required: isRequiredField(field.code)
				? t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `${field.name} is required`)
					.replace('_attribute_', t(field.name, field.code))
				: null
		}
		if (field.code && field.code === 'email') {
			rules.pattern = {
				value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
			}
		}
		return rules
	}

	const handleChangeInputEmail = (value: string, onChange: any) => {
		onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
	}

	const handleOpenTermsUrl = async (url: any) => {
		const supported = await Linking.canOpenURL(url);	
		if (supported) {
			await Linking.openURL(url);
		} else {
			showToast(ToastType.Error, t('VALIDATION_ERROR_ACTIVE_URL', 'The _attribute_ is not a valid URL.').replace('_attribute_', t('URL', 'URL')))
		}
	}

	useEffect(() => {
		if (!formState.loading && formState.result?.error) {
			formState.result?.result && showToast(
				ToastType.Error,
				formState.result?.result[0]
			)
			setIsLoadingVerifyModal(false)
		}
	}, [formState])

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors)
			if (phoneInputData.error) {
				list.push({ message: phoneInputData.error })
			}
			if (
				!phoneInputData.error &&
				!phoneInputData.phone.country_phone_code &&
				!phoneInputData.phone.cellphone &&
				validationFields?.fields?.checkout?.cellphone?.enabled &&
				validationFields?.fields?.checkout?.cellphone?.required
			) {
				list.push({ message: t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.') })
			}
			let stringError = ''
			list.map((item: any, i: number) => {
				stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
			})
			showToast(ToastType.Error, stringError)
			setIsLoadingVerifyModal(false)
		}
	}, [errors])

	useEffect(() => {
		if (verifyPhoneState && !verifyPhoneState?.loading) {
			if (verifyPhoneState.result?.error) {
				const message = typeof verifyPhoneState?.result?.result === 'string'
					? verifyPhoneState?.result?.result
					: verifyPhoneState?.result?.result[0]
				verifyPhoneState.result?.result && showToast(
					ToastType.Error,
					message
				)
				setIsLoadingVerifyModal(false)
				return
			}

			const okResult = verifyPhoneState.result?.result === 'OK'
			if (okResult) {
				!isModalVisible && setIsModalVisible(true)
				setIsLoadingVerifyModal(false)
			}
		}
	}, [verifyPhoneState])

	return (
		<View>
			{hasNav && (
				<NavBar
					title={t('SIGNUP', 'Signup')}
					titleAlign={'center'}
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					rightImg={null}
					btnStyle={{ paddingLeft: 0 }}
				/>
			)}
			<FormSide>
				{
					configs && Object.keys(configs).length > 0 && (
						(configs?.facebook_login?.value === 'true' ||
							configs?.facebook_login?.value === '1') && configs?.facebook_id?.value &&
						(
							<ButtonsSection>
								<SocialButtons>
									<FacebookLogin
										notificationState={notificationState}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessFacebookLogin={handleSuccessFacebook}
										styles={{ ...registerStyles.socialButton, backgroundColor: theme.colors.facebook }}
										textStyles={registerStyles.socialText}
										renderIcon={<OIcon src={theme.images.general.facebook} width={16} />}
										text={t('CONTINUE_WITH_FACEBOOK', 'Continue with Facebook')}
									/>
									{/* <FacebookLogin
										notificationState={notificationState}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessFacebookLogin={handleSuccessFacebook}
										styles={{ ...registerStyles.socialButton, backgroundColor: theme.colors.google }}
										textStyles={registerStyles.socialText}
										renderIcon={<OIcon src={theme.images.general.google} width={16} />}
										text={t('CONTINUE_WITH_GOOGLE', 'Continue with Google')}
									/>
									<FacebookLogin
										notificationState={notificationState}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessFacebookLogin={handleSuccessFacebook}
										styles={{ ...registerStyles.socialButton, backgroundColor: theme.colors.apple }}
										textStyles={registerStyles.socialText}
										renderIcon={<OIcon src={theme.images.general.apple} width={16} />}
										text={t('CONTINUE_WITH_APPLE', 'Continue with Apple')}
									/> */}
								</SocialButtons>
								<OText style={{ ...theme.labels.normal, textAlign: 'center', marginBottom: 8 } as TextStyle} color={theme.colors.textSecondary}>{t('OR_CONTINUE_WITH_EMAIL', 'or continue with email')}</OText>
							</ButtonsSection>
						)
					)
				}
				{useSignupByEmail && useSignupByCellphone &&
					configs && Object.keys(configs).length > 0 &&
					(configs?.twilio_service_enabled?.value === 'true' ||
						configs?.twilio_service_enabled?.value === '1') && (
						<SignupWith style={{ paddingBottom: 25 }}>
							<OTabs>
								{useSignupByEmail && (
									<Pressable onPress={() => handleChangeTab('email')}>
										<OTab>
											<OText size={18} color={signupTab === 'email' ? theme.colors.primary : theme.colors.disabled}>
												{t('SIGNUP_BY_EMAIL', 'Signup by Email')}
											</OText>
										</OTab>
									</Pressable>
								)}
								{useSignupByCellphone && (
									<Pressable onPress={() => handleChangeTab('cellphone')}>
										<OTab>
											<OText size={18} color={signupTab === 'cellphone' ? theme.colors.primary : theme.colors.disabled}>
												{t('SIGNUP_BY_PHONE', 'Signup by Phone')}
											</OText>
										</OTab>
									</Pressable>
								)}
							</OTabs>
						</SignupWith>
					)}
				<View style={{ height: 1, backgroundColor: theme.colors.border, width: width }} />
				<FormInput>
					{!(useChekoutFileds && validationFields?.loading && validationFields?.fields?.checkout) ? (
						<>
							{sortInputFields({ values: validationFields?.fields?.checkout }).map((field: any, i: number) =>
								!notValidationFields.includes(field.code) &&
								(
									showField && showField(field.code) && (
										<View key={field.id}>
											<InputWrapper>
												<OText style={{ ...registerStyles.inputHead, ...theme.labels.middle } as TextStyle}>{t(field.name)}</OText>
												<Controller
													control={control}
													render={({ onChange, value }: any) => (
														<OInput
															placeholder={''}
															style={registerStyles.inputStyle}
															value={value}
															onChange={(val: any) => field.code !== 'email' ? onChange(val) : handleChangeInputEmail(val, onChange)}
															autoCapitalize={field.code === 'email' ? 'none' : 'sentences'}
															autoCorrect={field.code === 'email' && false}
															type={field.code === 'email' ? 'email-address' : 'default'}
															autoCompleteType={field.code === 'email' ? 'email' : 'off'}
															returnKeyType='next'
															blurOnSubmit={false}
															forwardRef={(ref: any) => handleRefs(ref, field.code)}
															onSubmitEditing={() => field.code === 'email' ? phoneRef.current.focus() : handleFocusRef(getNextFieldCode(i))}
															inputStyle={{ color: theme.colors.textPrimary, fontSize: 12 }}
														/>
													)}
													name={field.code}
													rules={getInputRules(field)}
													defaultValue=""
												/>
											</InputWrapper>
											<View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: -40 }} />
										</View>
									)
								))
							}

							{!!showInputPhoneNumber && (
								<>
									<InputWrapper>
										<OText style={{ ...registerStyles.inputHead, ...theme.labels.middle } as TextStyle}>{t('PHONE', 'Phone')}</OText>
										<PhoneInputNumber
											data={phoneInputData}
											handleData={(val: any) => setPhoneInputData(val)}
											forwardRef={phoneRef}
											textInputProps={{
												returnKeyType: 'next',
												onSubmitEditing: () => passwordRef.current.focus(),
												style: { borderWidth: 0, fontSize: 12 }
											}}
											textWrapStyle={{ borderColor: theme.colors.clear, borderWidth: 0, height: 40, paddingStart: 0 }}
										/>
									</InputWrapper>
									<View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: -40 }} />
								</>
							)}

							{signupTab !== 'cellphone' && (
								<>
									<InputWrapper>
										<OText style={{ ...registerStyles.inputHead, ...theme.labels.middle } as TextStyle}>{t('PASSWORD', 'Password')}</OText>
										<Controller
											control={control}
											render={({ onChange, value }: any) => (
												<OInput
													isSecured={!passwordSee ? true : false}
													placeholder={t('PASSWORD_PLACEHOLDER', 'at least 8 characters')}
													style={registerStyles.inputStyle}
													// iconCustomRight={
													// 	!passwordSee ?
													// 		<MaterialCommunityIcons name='eye-outline' size={24} onPress={() => setPasswordSee(!passwordSee)} /> :
													// 		<MaterialCommunityIcons name='eye-off-outline' size={24} onPress={() => setPasswordSee(!passwordSee)} />
													// }
													value={value}
													onChange={(val: any) => onChange(val)}
													returnKeyType='done'
													onSubmitEditing={handleSubmit(onSubmit)}
													blurOnSubmit
													forwardRef={passwordRef}
													inputStyle={{ color: theme.colors.textPrimary, fontSize: 12 }}
												/>
											)}
											name="password"
											rules={{
												required: isRequiredField('password')
													? t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required')
														.replace('_attribute_', t('PASSWORD', 'password'))
													: null,
												minLength: {
													value: 8,
													message: t('VALIDATION_ERROR_PASSWORD_MIN_STRING', 'The Password must be at least 8 characters.')
														.replace('_attribute_', t('PASSWORD', 'Password')).replace('_min_', 8)
												}
											}}
											defaultValue=""
										/>
									</InputWrapper>
									<View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: -40 }} />
								</>
							)}
						</>
					) : (
						<Spinner visible />
					)}

					{configs?.terms_and_conditions?.value === 'true' && (
						<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
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
                    style={Platform.OS === 'ios' && registerStyles.checkBoxStyle}
                  />
								)}
								name='termsAccept'
								rules={{
									required: t('VALIDATION_ERROR_ACCEPTED', 'The _attribute_ must be accepted.').replace('_attribute_', t('TERMS_AND_CONDITIONS', 'Terms & Conditions'))
								}}
								defaultValue={false}
							/>
							<OText style={{ ...theme.labels.middle, paddingHorizontal: 5 }}>{t('TERMS_AND_CONDITIONS_TEXT', 'I’m agree with')}</OText>
							<TouchableOpacity
								onPress={() => handleOpenTermsUrl(configs?.terms_and_conditions_url?.value)}
							>
								<OText style={{ ...theme.labels.middle }} color={theme.colors.primary}>{t('TERMS_AND_CONDITIONS', 'Terms & Conditions')}</OText>
							</TouchableOpacity>
						</View>
					)}

					{signupTab === 'cellphone' && useSignupByEmail && useSignupByCellphone ? (
						<OButton
							onClick={handleSubmit(onSubmit)}
							text={t('GET_VERIFY_CODE', 'Get Verify Code')}
							borderColor={theme.colors.primary}
							imgRightSrc={null}
							textStyle={{ color: 'white', ...theme.labels.middle } as TextStyle}
							isLoading={isLoadingVerifyModal}
							indicatorColor={theme.colors.white}
							style={{ height: 40, marginTop: 50, shadowOpacity: 0, marginBottom: 30 }}
						/>
					) : (
						<OButton
							onClick={handleSubmit(onSubmit)}
							text={signupButtonText}
							bgColor={theme.colors.primary}
							borderColor={theme.colors.primary}
							textStyle={{ color: 'white', ...theme.labels.middle } as TextStyle}
							imgRightSrc={null}
							isDisabled={formState.loading || validationFields.loading}
							style={{ height: 40, marginTop: 50, shadowOpacity: 0, marginBottom: 30 }}
						/>

					)}
				</FormInput>

				{/* {
					onNavigationRedirect && loginButtonText && (
						<View style={registerStyles.wrappText}>
							<OText size={18} style={{ marginRight: 5 }}>
								{t('MOBILE_FRONT_ALREADY_HAVE_AN_ACCOUNT', 'Already have an account?')}
							</OText>
							<Pressable onPress={() => onNavigationRedirect('Login')}>
								<OText size={18} color={theme.colors.primary}>
									{loginButtonText}
								</OText>
							</Pressable>
						</View>
					)
				} */}

			</FormSide >
			<OModal
				open={isModalVisible}
				onClose={() => setIsModalVisible(false)}
			>
				<VerifyPhone
					phone={phoneInputData.phone}
					formValues={formValues}
					verifyPhoneState={verifyPhoneState}
					checkPhoneCodeState={checkPhoneCodeState}
					handleCheckPhoneCode={handleCheckPhoneCode}
					setCheckPhoneCodeState={setCheckPhoneCodeState}
					handleVerifyCodeClick={onSubmit}
				/>
			</OModal>
			<Spinner visible={formState.loading || isFBLoading} />
		</View >
	);
};

export const SignupForm = (props: any) => {
	const signupProps = {
		...props,
		UIComponent: SignupFormUI,
	};
	return <SignUpController {...signupProps} />;
};
