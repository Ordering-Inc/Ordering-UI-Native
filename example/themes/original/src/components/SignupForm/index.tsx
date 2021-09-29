import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Linking } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PhoneInputNumber } from '../PhoneInputNumber';
import { FacebookLogin } from '../FacebookLogin';

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

import {
	ButtonsWrapper,
	LoginWith as SignupWith,
	OTab,
	OTabs,
} from '../LoginForm/styles';

import NavBar from '../NavBar';
import { VerifyPhone } from '../VerifyPhone';

import { OText, OButton, OInput, OModal } from '../shared';
import CheckBox from '@react-native-community/checkbox';
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
			borderColor: theme.colors.border,
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
	});

	const showInputPhoneNumber =
		validationFields?.fields?.checkout?.cellphone?.enabled ?? false;

	const [, { showToast }] = useToast();
	const [, t] = useLanguage();
	const [, { login }] = useSession();
	const [{ configs }] = useConfig();
	const { control, handleSubmit, errors } = useForm();

	const [passwordSee, setPasswordSee] = useState(false);
	const [formValues, setFormValues] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
	const [signupTab, setSignupTab] = useState(
		useSignupByCellphone && !useSignupByEmail ? 'cellphone' : 'email',
	);
	const [isFBLoading, setIsFBLoading] = useState(false);
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null,
		},
	});

	const nameRef = useRef<any>(null);
	const lastnameRef = useRef<any>(null);
	const middleNameRef = useRef<any>(null);
	const secondLastnameRef = useRef<any>(null);
	const emailRef = useRef<any>(null);
	const phoneRef = useRef<any>(null);
	const passwordRef = useRef<any>(null);

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

	const handleChangeTab = (val: string) => {
		setSignupTab(val);
		setPasswordSee(false);
	};

	const onSubmit = (values: any) => {
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
			return;
		}
		if (
			!phoneInputData.phone.country_phone_code &&
			!phoneInputData.phone.cellphone &&
			validationFields?.fields?.checkout?.cellphone?.enabled &&
			validationFields?.fields?.checkout?.cellphone?.required
		) {
			showToast(
				ToastType.Error,
				t(
					'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
					'The field Mobile phone is required.',
				),
			);
			return;
		}
		if (signupTab === 'email' || !useSignupByCellphone) {
			handleButtonSignupClick &&
				handleButtonSignupClick({
					...values,
					...phoneInputData.phone,
				});
			if (
				!formState.loading &&
				formState.result.result &&
				!formState.result.error
			) {
				handleSuccessSignup && handleSuccessSignup(formState.result.result);
			}
			return;
		}
		setFormValues(values);
		handleVerifyCodeClick(values);
	};

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
		}
	}

	useEffect(() => {
		if (!formState.loading && formState.result?.error) {
			formState.result?.result &&
				showToast(ToastType.Error, formState.result?.result[0]);
			setIsLoadingVerifyModal(false);
		}
	}, [formState]);

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors);
			if (phoneInputData.error) {
				list.push({ message: phoneInputData.error });
			}
			if (
				!phoneInputData.error &&
				!phoneInputData.phone.country_phone_code &&
				!phoneInputData.phone.cellphone &&
				validationFields?.fields?.checkout?.cellphone?.enabled &&
				validationFields?.fields?.checkout?.cellphone?.required
			) {
				list.push({
					message: t(
						'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
						'The field Mobile phone is required.',
					),
				});
			}
			let stringError = '';
			list.map((item: any, i: number) => {
				stringError +=
					i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
			});
			showToast(ToastType.Error, stringError);
			setIsLoadingVerifyModal(false);
		}
	}, [errors]);

	useEffect(() => {
		if (verifyPhoneState && !verifyPhoneState?.loading) {
			if (verifyPhoneState.result?.error) {
				const message =
					typeof verifyPhoneState?.result?.result === 'string'
						? verifyPhoneState?.result?.result
						: verifyPhoneState?.result?.result[0];
				verifyPhoneState.result?.result && showToast(ToastType.Error, message);
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

	return (
		<View>
			<NavBar
				title={t('SIGNUP', 'Signup')}
				titleAlign={'center'}
				onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
				showCall={false}
				btnStyle={{ paddingLeft: 0 }}
				style={{ flexDirection: 'column', alignItems: 'flex-start' }}
				titleWrapStyle={{ paddingHorizontal: 0 }}
			/>
			<FormSide>
				{useSignupByEmail &&
					useSignupByCellphone &&
					configs &&
					Object.keys(configs).length > 0 &&
					(configs?.twilio_service_enabled?.value === 'true' ||
						configs?.twilio_service_enabled?.value === '1') && (
						<SignupWith style={{ paddingBottom: 25 }}>
							<OTabs>
								{useSignupByEmail && (
									<Pressable onPress={() => handleChangeTab('email')}>
										<OTab>
											<OText
												size={18}
												color={
													signupTab === 'email'
														? theme.colors.primary
														: theme.colors.disabled
												}>
												{t('SIGNUP_BY_EMAIL', 'Signup by Email')}
											</OText>
										</OTab>
									</Pressable>
								)}
								{useSignupByCellphone && (
									<Pressable onPress={() => handleChangeTab('cellphone')}>
										<OTab>
											<OText
												size={18}
												color={
													signupTab === 'cellphone'
														? theme.colors.primary
														: theme.colors.disabled
												}>
												{t('SIGNUP_BY_PHONE', 'Signup by Phone')}
											</OText>
										</OTab>
									</Pressable>
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
									showField(field.code) && (
										<Controller
											key={field.id}
											control={control}
											render={({ onChange, value }: any) => (
												<OInput
													placeholder={t(field.name)}
													style={style.inputStyle}
													icon={
														field.code === 'email'
															? theme.images.general.email
															: theme.images.general.user
													}
													value={value}
													onChange={(val: any) =>
														field.code !== 'email'
															? onChange(val)
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
															? phoneRef.current.focus()
															: handleFocusRef(getNextFieldCode(i))
													}
												/>
											)}
											name={field.code}
											rules={getInputRules(field)}
											defaultValue=""
										/>
									),
							)}

							{!!showInputPhoneNumber && (
								<View style={{ marginBottom: 25 }}>
									<PhoneInputNumber
										data={phoneInputData}
										handleData={(val: any) => setPhoneInputData(val)}
										forwardRef={phoneRef}
										textInputProps={{
											returnKeyType: 'next',
											onSubmitEditing: () => passwordRef.current.focus(),
										}}
									/>
								</View>
							)}

							{signupTab !== 'cellphone' && (
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
							)}
						</>
					) : (
						<Spinner visible />
					)}

					{configs?.terms_and_conditions?.value === 'true' && (
						<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
							<Controller
								control={control}
								render={({ onChange, value }: any) => (
								<CheckBox
									value={value}
									onValueChange={newValue => {
										onChange(newValue)
									}}
									tintColors={{
										true: theme.colors.primary,
										false: theme.colors.disabled
									}}
									tintColor={theme.colors.disabled}
									onCheckColor={theme.colors.primary}
								/>
								)}
								name='termsAccept'
								rules={{
									required: t('VALIDATION_ERROR_ACCEPTED', 'The _attribute_ must be accepted.').replace('_attribute_', t('TERMS_AND_CONDITIONS', 'Terms & Conditions'))
								}}
								defaultValue={false}
							/>
							<OText color={theme.colors.disabled} size={14}>{t('TERMS_AND_CONDITIONS_TEXT', 'I’m agree with')}</OText>
							<OButton
								imgRightSrc={null}
								text={t('TERMS_AND_CONDITIONS', 'Terms & Conditions')}
								bgColor='#FFF'
								borderColor='#FFF'
								style={{ paddingLeft: 0, paddingRight: 0, height: 30 }}
								textStyle={{ color: theme.colors.primary, marginLeft: 5, marginRight: 5, fontSize: 14 }}
								onClick={() => handleOpenTermsUrl(configs?.terms_and_conditions_url?.value)}
							/>
						</View>
					)}

					{signupTab === 'cellphone' &&
						useSignupByEmail &&
						useSignupByCellphone ? (
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
							style={{ borderRadius: 7.6, marginTop: 6 }}
						/>
					)}
				</FormInput>

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
						<FacebookLogin
							handleErrors={(err: any) => showToast(ToastType.Error, err)}
							handleLoading={(val: boolean) => setIsFBLoading(val)}
							handleSuccessFacebookLogin={handleSuccessFacebook}
						/>
						<GoogleLogin
							handleErrors={(err: any) => showToast(ToastType.Error, err)}
							handleLoading={(val: boolean) => setIsFBLoading(val)}
							handleSuccessFacebookLogin={handleSuccessFacebook}
						/>
						<AppleLogin
							handleErrors={(err: any) => showToast(ToastType.Error, err)}
							handleLoading={(val: boolean) => setIsFBLoading(val)}
							handleSuccessFacebookLogin={handleSuccessFacebook}
						/>
					</SocialButtons>
				</ButtonsWrapper>

				{/* {
          onNavigationRedirect && loginButtonText && (
            <View style={style.wrappText}>
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

				{/* {
          configs && Object.keys(configs).length > 0 && (
            (configs?.facebook_login?.value === 'true' ||
              configs?.facebook_login?.value === '1') &&
            configs?.facebook_id?.value &&
            (
              <ButtonsSection>
                <OText size={18} color={theme.colors.disabled}>
                  {t('SELECT_AN_OPTION_TO_LOGIN', 'Select an option to login')}
                </OText>

                <SocialButtons>
                  <FacebookLogin
                    handleErrors={(err: any) => showToast(ToastType.Error, err)}
                    handleLoading={(val: boolean) => setIsFBLoading(val)}
                    handleSuccessFacebookLogin={handleSuccessFacebook}
                  />
                </SocialButtons>
              </ButtonsSection>
            )
          )
        } */}
			</FormSide>
			<OModal open={isModalVisible} onClose={() => setIsModalVisible(false)}>
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
			<Spinner
				visible={formState.loading || validationFields.loading || isFBLoading}
			/>
		</View>
	);
};

export const SignupForm = (props: any) => {
	const signupProps = {
		...props,
		UIComponent: SignupFormUI,
	};
	return <SignUpController {...signupProps} />;
};
