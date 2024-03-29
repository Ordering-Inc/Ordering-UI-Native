import React, { useEffect, useState, useRef } from 'react';
import { Pressable, StyleSheet, View, Keyboard, TextStyle, TouchableOpacity, Platform } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import { PhoneInputNumber } from '../PhoneInputNumber'

import {
	LoginForm as LoginFormController,
	useLanguage,
	useConfig,
	useSession,
	ToastType,
	useToast
} from 'ordering-components/native';

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
	InputWrapper
} from './styles';

import { _removeStoreData } from '../../providers/StoreUtil';
import NavBar from '../NavBar'

import { OText, OButton, OInput, OIcon } from '../shared';
import { LoginParams } from '../../types';
import { useTheme } from 'styled-components/native';
import { useWindowDimensions } from 'react-native';
import { AppleLogin } from '../AppleLogin';
import { GoogleLogin } from '../GoogleLogin';

const LoginFormUI = (props: LoginParams) => {
	const {
		loginTab,
		formState,
		navigation,
		useLoginByEmail,
		useLoginByCellphone,
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
		hasNav
	} = props

	const theme = useTheme();

	const loginStyle = StyleSheet.create({
		btnOutline: {
			backgroundColor: 'red',
			color: theme.colors.primary,
      // backgroundColor: '#EFEFEF',
      borderColor: '#EFEFEF',
      borderRadius: 30,
      fontSize: 16,
      paddingVertical: 15,
      paddingHorizontal: 30,
      fontWeight: '400',
      textAlign: 'center',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      height: 52,
		},
		inputStyle: {
			marginBottom: 25,
			borderWidth: 0,
			height: 40,
		},
		inputHead: {
			flexBasis: '25%',
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
			fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
			color: theme.colors.white,
			textTransform: 'capitalize',
			textAlign: 'center',
			flexGrow: 1,
		}
	});
	const [, { showToast }] = useToast();
	const [, t] = useLanguage()
	const [{ configs }] = useConfig()
	const [, { login }] = useSession()
	const { control, handleSubmit, errors } = useForm();
	const [passwordSee, setPasswordSee] = useState(false);
	const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isFBLoading, setIsFBLoading] = useState(false);
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null
		}
	});

	const { width } = useWindowDimensions();

	const inputRef = useRef<any>({})
	const emailRef = useRef<any>({})

	const handleChangeTab = (val: string) => {
		props.handleChangeTab(val);
		setPasswordSee(false);
	}

	const onSubmit = (values: any) => {
		Keyboard.dismiss()
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
			return
		}
		handleButtonLoginClick({
			...values,
			...phoneInputData.phone
		});
	}

	const handleVerifyCodeClick = () => {
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
			return
		}
		if (
			!phoneInputData.error &&
			!phoneInputData.phone.country_phone_code &&
			!phoneInputData.phone.cellphone
		) {
			showToast(ToastType.Error, t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.'))
			return
		}
		handleSendVerifyCode && handleSendVerifyCode(phoneInputData.phone)
		setIsLoadingVerifyModal(true)
	}

	const handleSuccessFacebook = (user: any) => {
		_removeStoreData('isGuestUser')
		login({
			user,
			token: user.session.access_token
		})
	}
	
	const handleSuccessApple = (user: any) => {
		_removeStoreData('isGuestUser')
		login({
			user,
			token: user.session.access_token
		})
	}

	const handleChangeInputEmail = (value: string, onChange: any) => {
		onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
	}

	useEffect(() => {
		if (!formState.loading && formState.result?.error) {
			formState.result?.result && showToast(
				ToastType.Error,
				typeof formState.result?.result === 'string'
					? formState.result?.result
					: formState.result?.result[0]
			)
		}
	}, [formState])

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

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors)
			let stringError = ''
			if (phoneInputData.error) {
				list.unshift({ message: phoneInputData.error })
			}
			if (
				loginTab === 'cellphone' &&
				!phoneInputData.error &&
				!phoneInputData.phone.country_phone_code &&
				!phoneInputData.phone.cellphone
			) {
				list.unshift({ message: t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required.') })
			}
			list.map((item: any, i: number) => {
				stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
			})
			showToast(ToastType.Error, stringError)
		}
	}, [errors])

	return (
		<Container>
			{hasNav && (
				<NavBar
					title={t('LOGIN', 'Login')}
					titleAlign={'center'}
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					rightImg={null}
					btnStyle={{ paddingLeft: 0 }}
					paddingTop={0}
				/>
			)}
			<FormSide>
				{useLoginByEmail && useLoginByCellphone && (
					<LoginWith>
						<OTabs>
							{useLoginByEmail && (
								<Pressable onPress={() => handleChangeTab('email')}>
									<OTab>
										<OText size={16} color={loginTab === 'email' ? theme.colors.primary : theme.colors.disabled}>
											{t('LOGIN_BY_EMAIL', 'Login by Email')}
										</OText>
									</OTab>
								</Pressable>
							)}
							{useLoginByCellphone && (
								<Pressable onPress={() => handleChangeTab('cellphone')}>
									<OTab>
										<OText size={16} color={loginTab === 'cellphone' ? theme.colors.primary : theme.colors.disabled}>
											{t('LOGIN_BY_PHONE', 'Login by Phone')}
										</OText>
									</OTab>
								</Pressable>
							)}
						</OTabs>
					</LoginWith>
				)}
				{configs && Object.keys(configs).length > 0 &&
					(
						<>
							<ButtonsWrapper>
								<SocialButtons>
									<FacebookLogin
										notificationState={notificationState}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessFacebookLogin={handleSuccessFacebook}
										styles={[loginStyle.socialButton, { backgroundColor: theme.colors.facebook }]}
										textStyles={loginStyle.socialText}
										renderIcon={<OIcon src={theme.images.general.facebook} width={16} />}
										text={t('CONTINUE_WITH_FACEBOOK', 'Continue with Facebook')}
									/>
									<GoogleLogin
										notificationState={notificationState}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessGoogleLogin={handleSuccessFacebook}
										styles={[loginStyle.socialButton, { backgroundColor: theme.colors.google }]}
										textStyles={loginStyle.socialText}
										renderIcon={<OIcon src={theme.images.general.google} width={16} />}
										text={t('CONTINUE_WITH_GOOGLE', 'Continue with Google')}
									/>
									<AppleLogin
										notificationState={notificationState}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessAppleLogin={handleSuccessApple}
									/>
								</SocialButtons>
                {loginTab !== 'cellphone' && (
                  <OText
                    style={{ ...theme.labels.normal, textAlign: 'center', marginBottom: 8 } as TextStyle}
                    color={theme.colors.textSecondary}
                  >
                    {t('OR_CONTINUE_WITH_EMAIL', 'or continue with email')}
                  </OText>
                )}
							</ButtonsWrapper>

              {useLoginByCellphone &&
                loginTab === 'cellphone' &&
                configs && Object.keys(configs).length > 0 &&
                (configs?.twilio_service_enabled?.value === 'true' ||
                  configs?.twilio_service_enabled?.value === '1') &&
                configs?.twilio_module?.value &&
                (
                  <>
                    <OrSeparator>
                      <LineSeparator />
                      <OText size={16} mRight={20} mLeft={20}>
                        {t('OR', 'Or')}
                      </OText>
                      <LineSeparator />
                    </OrSeparator>

                    <ButtonsWrapper mBottom={20}>
                      <OButton
                        onClick={handleVerifyCodeClick}
                        text={t('GET_VERIFY_CODE', 'Get Verify Code')}
                        bgColor={theme.colors.primary}
                        borderColor={theme.colors.primary}
                        textStyle={{ color: 'white', ...theme.labels.middle } as TextStyle}
                        imgRightSrc={null}
                        isLoading={isLoadingVerifyModal}
                        indicatorColor={theme.colors.white}
                        style={{ marginTop: 0, height: 40, shadowOpacity: 0 }}
                      />
                    </ButtonsWrapper>
                  </>
                )
              }
							<View style={{ height: 1, backgroundColor: theme.colors.border, width: width }} />
						</>
					)
				}

				{(useLoginByCellphone || useLoginByEmail) && (
					<FormInput>
						{useLoginByEmail && loginTab === 'email' && (
							<InputWrapper>
								<Pressable onPress={() => emailRef.current?.focus()} style={{...loginStyle.inputHead, justifyContent: 'center', minHeight: 40}}> 
									<OText style={{ ...theme.labels.middle } as TextStyle}>{t('EMAIL', 'Email')}</OText> 
								</Pressable>
								<Controller
									control={control}
									render={({ onChange, value }: any) => (
										<OInput
											placeholder={t('EMAIL_PLACEHOLDER', 'example@me.com')}
											style={loginStyle.inputStyle}
											onChange={(e: any) => {
												handleChangeInputEmail(e, onChange)
											}}
											forwardRef={emailRef}
											value={value}
											autoCapitalize='none'
											autoCorrect={false}
											type='email-address'
											autoCompleteType='email'
											returnKeyType='next'
											onSubmitEditing={() => inputRef.current?.focus()}
											blurOnSubmit={false}
											inputStyle={{ color: theme.colors.textPrimary, fontSize: 12 }}
										/>
									)}
									name="email"
									rules={{
										required: t('VALIDATION_ERROR_EMAIL_REQUIRED', 'The field Email is required').replace('_attribute_', t('EMAIL', 'Email')),
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
										}
									}}
									defaultValue=""
								/>
							</InputWrapper>
						)}
						{useLoginByCellphone && loginTab === 'cellphone' && (
              <>
                <InputWrapper style={{ marginVertical: 20 }}>
                  <OText style={{ ...loginStyle.inputHead, ...theme.labels.middle, alignSelf: 'center' } as TextStyle}>{t('PHONE', 'Phone')}</OText>
                  <PhoneInputNumber
                    wrapStyle={{ marginTop: 0 }}
                    data={phoneInputData}
                    handleData={(val: any) => setPhoneInputData(val)}
                    textInputProps={{
                      returnKeyType: 'next',
                      onSubmitEditing: () => inputRef?.current?.focus?.(),
                      style: { borderWidth: 0, fontSize: 12 },
					  maxLength: 10
                    }}
                    textWrapStyle={{ borderColor: theme.colors.clear, borderWidth: 0, height: 40, paddingStart: 0 }}
                  />
                </InputWrapper>
                <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: -40 }} />
              </>
						)}
						<View style={{ height: 1, backgroundColor: theme.colors.border, width: width, marginStart: -40 }} />
						<InputWrapper style={loginTab === 'cellphone' && { marginVertical: 20 }}>
							<Pressable onPress={() => inputRef.current?.focus()} style={{...loginStyle.inputHead, justifyContent: 'center', minHeight: 40}}> 
								<OText style={{ ...theme.labels.middle } as TextStyle}>{t('PASSWORD', 'Password')}</OText>
							</Pressable>
							<Controller
								control={control}
								render={({ onChange, value }: any) => (
									<OInput
										isSecured={!passwordSee ? true : false}
										placeholder={t('PASSWORD_PLACEHOLDER', 'at least 8 characters')}
										style={loginStyle.inputStyle}
										// iconCustomRight={
										// 	!passwordSee ?
										// 		<MaterialCommunityIcons name='eye-outline' size={24} onPress={() => setPasswordSee(!passwordSee)} /> :
										// 		<MaterialCommunityIcons name='eye-off-outline' size={24} onPress={() => setPasswordSee(!passwordSee)} />
										// }
										value={value}
										forwardRef={inputRef}
										onChange={(val: any) => onChange(val)}
										returnKeyType='done'
										onSubmitEditing={handleSubmit(onSubmit)}
										blurOnSubmit
										inputStyle={{ color: theme.colors.textPrimary, fontSize: 12 }}
									/>
								)}
								name="password"
								rules={{ required: t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required').replace('_attribute_', t('PASSWORD', 'Password')) }}
								defaultValue=""
							/>
						</InputWrapper>
						<View style={{ height: 1, backgroundColor: theme.colors.border, width: width, marginStart: -40 }} />
						<OButton
							onClick={handleSubmit(onSubmit)}
							text={loginButtonText}
							bgColor={theme.colors.primary}
							borderColor={theme.colors.primary}
							textStyle={{ color: 'white', ...theme.labels.middle } as TextStyle}
							imgRightSrc={null}
							isLoading={formState.loading}
							style={{ marginTop: 28, height: 40, shadowOpacity: 0 }}
						/>
					</FormInput>
				)}

				{onNavigationRedirect && forgotButtonText && (
					<Pressable onPress={() => onNavigationRedirect('Forgot')} style={{ width: '100%' }}>
						<OText color={theme.colors.textThird} style={{ ...theme.labels.normal, alignSelf: 'flex-start' } as TextStyle} mBottom={18}>
							{forgotButtonText}
						</OText>
					</Pressable>
				)}

				{onNavigationRedirect && registerButtonText && (
					<ButtonsWrapper>
						<OButton
							onClick={() => onNavigationRedirect('Signup')}
							text={registerButtonText}
							style={loginStyle.btnOutline}
							borderColor={theme.colors.primary}
							imgRightSrc={null}
						/>
					</ButtonsWrapper>
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
			<Spinner visible={isFBLoading} />
		</Container>
	);
};

export const LoginForm = (props: any) => {
	const loginProps = {
		...props,
		UIComponent: LoginFormUI,
		handleSuccessLogin: () => _removeStoreData('isGuestUser')
	};
	return <LoginFormController {...loginProps} />;
};
