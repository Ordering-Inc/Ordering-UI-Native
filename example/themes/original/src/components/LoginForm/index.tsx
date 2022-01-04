import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import { PhoneInputNumber } from '../PhoneInputNumber';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
import { VerifyPhone } from '../VerifyPhone';

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
} from './styles';

import NavBar from '../NavBar';

import { OText, OButton, OInput, OModal, OIcon } from '../shared';
import { LoginParams } from '../../types';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { GoogleLogin } from '../GoogleLogin';
import { AppleLogin } from '../AppleLogin';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
		notificationState
	} = props;

	const [, { showToast }] = useToast();
	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [, { login }] = useSession();
	const { control, handleSubmit, errors } = useForm();
	const [passwordSee, setPasswordSee] = useState(false);
	const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isFBLoading, setIsFBLoading] = useState(false);
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null,
		},
	});

	const theme = useTheme();

	const loginStyle = StyleSheet.create({
		btnOutline: {
			backgroundColor: '#FFF',
			color: theme.colors.primary,
			borderRadius: 7.6,
		},
		inputStyle: {
			marginBottom: 28,
			borderWidth: 1,
			borderColor: theme.colors.border,
			borderRadius: 7.6,
		},
		line: {
			height: 1,
			backgroundColor: theme.colors.border,
			flexGrow: 1,
			marginBottom: 7,
		},
	});

	const inputRef = useRef<any>({});

	const handleChangeTab = (val: string) => {
		props.handleChangeTab(val);
		setPasswordSee(false);
	};

	const onSubmit = (values: any) => {
		Keyboard.dismiss();
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
			return;
		}
		handleButtonLoginClick({
			...values,
			...phoneInputData.phone,
		});
	};

	const handleVerifyCodeClick = () => {
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
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
		onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
	};

	useEffect(() => {
		if (!formState.loading && formState.result?.error) {
			formState.result?.result &&
				showToast(
					ToastType.Error,
					typeof formState.result?.result === 'string'
						? formState.result?.result
						: formState.result?.result[0],
				);
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
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors);
			let stringError = '';
			if (phoneInputData.error) {
				list.unshift({ message: phoneInputData.error });
			}
			if (
				loginTab === 'cellphone' &&
				!phoneInputData.error &&
				!phoneInputData.phone.country_phone_code &&
				!phoneInputData.phone.cellphone
			) {
				list.unshift({
					message: t(
						'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
						'The field Mobile phone is required.',
					),
				});
			}
			list.map((item: any, i: number) => {
				stringError +=
					i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
			});
			showToast(ToastType.Error, stringError);
		}
	}, [errors]);

	return (
		<Container>
			<NavBar
				title={t('LOGIN', 'Login')}
				titleAlign={'center'}
				onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
				showCall={false}
				btnStyle={{ paddingLeft: 0 }}
				style={{ flexDirection: 'column', alignItems: 'flex-start' }}
				titleWrapStyle={{ paddingHorizontal: 0 }}
				titleStyle={{ marginRight: 0, marginLeft: 0 }}
			/>
			<FormSide>
				{useLoginByEmail && useLoginByCellphone && (
					<LoginWith>
						<OTabs>
							{useLoginByEmail && (
								<TabBtn onPress={() => handleChangeTab('email')}>
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
								<TabBtn onPress={() => handleChangeTab('cellphone')}>
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
						</OTabs>
					</LoginWith>
				)}

				{(useLoginByCellphone || useLoginByEmail) && (
					<FormInput>
						{useLoginByEmail && loginTab === 'email' && (
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
										onSubmitEditing={() => inputRef.current?.focus()}
										blurOnSubmit={false}
									/>
								)}
								name="email"
								rules={{
									required: t(
										'VALIDATION_ERROR_EMAIL_REQUIRED',
										'The field Email is required',
									).replace('_attribute_', t('EMAIL', 'Email')),
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: t(
											'INVALID_ERROR_EMAIL',
											'Invalid email address',
										).replace('_attribute_', t('EMAIL', 'Email')),
									},
								}}
								defaultValue=""
							/>
						)}
						{useLoginByCellphone && loginTab === 'cellphone' && (
							<View style={{ marginBottom: 28 }}>
								<PhoneInputNumber
									data={phoneInputData}
									handleData={(val: any) => setPhoneInputData(val)}
									textInputProps={{
										returnKeyType: 'next',
										onSubmitEditing: () => inputRef?.current?.focus?.(),
									}}
								/>
							</View>
						)}

						<Controller
							control={control}
							render={({ onChange, value }: any) => (
								<OInput
									isSecured={!passwordSee ? true : false}
									placeholder={t('PASSWORD', 'Password')}
									style={{...loginStyle.inputStyle, marginBottom: 14}}
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
									forwardRef={inputRef}
									onChange={(val: any) => onChange(val)}
									returnKeyType="done"
									onSubmitEditing={handleSubmit(onSubmit)}
									blurOnSubmit
								/>
							)}
							name="password"
							rules={{
								required: t(
									'VALIDATION_ERROR_PASSWORD_REQUIRED',
									'The field Password is required',
								).replace('_attribute_', t('PASSWORD', 'Password')),
							}}
							defaultValue=""
						/>
						{onNavigationRedirect && forgotButtonText && (
							<TouchableOpacity onPress={() => onNavigationRedirect('Forgot')}>
								<OText size={14} mBottom={18}>
									{forgotButtonText}
								</OText>
							</TouchableOpacity>
						)}
						<OButton
							onClick={handleSubmit(onSubmit)}
							text={loginButtonText}
							bgColor={theme.colors.primary}
							borderColor={theme.colors.primary}
							textStyle={{ color: 'white' }}
							imgRightSrc={null}
							isLoading={formState.loading}
							style={{ borderRadius: 7.6, marginTop: 10, marginBottom: 25 }}
						/>
						{onNavigationRedirect && registerButtonText && (
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
								<OText size={14}>
									{t('NEW_ON_PLATFORM', 'New on Ordering?')}
								</OText>
							<TouchableOpacity onPress={() => onNavigationRedirect('Signup')}>
									<OText size={14} mLeft={5} color={theme.colors.skyBlue}>
										{t('CREATE_ACCOUNT', 'Create account')}
									</OText>
								</TouchableOpacity>
							</View>
						)}
					</FormInput>
				)}

				{useLoginByCellphone &&
					loginTab === 'cellphone' &&
					configs &&
					Object.keys(configs).length > 0 &&
					(configs?.twilio_service_enabled?.value === 'true' ||
						configs?.twilio_service_enabled?.value === '1') && (
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

				{configs && Object.keys(configs).length > 0 ? (
          (((configs?.facebook_login?.value === 'true' || configs?.facebook_login?.value === '1') && configs?.facebook_id?.value) ||
          (configs?.google_login_client_id?.value !== '' && configs?.google_login_client_id?.value !== null)) &&
          (
						<ButtonsWrapper>
							<SocialButtons>
								{(configs?.facebook_login?.value === 'true' || configs?.facebook_login?.value === '1') &&
                  configs?.facebook_id?.value && (
									<FacebookLogin
										notificationState={notificationState}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessFacebookLogin={handleSuccessFacebook}
									/>
								)}
                {(configs?.google_login_client_id?.value !== '' && configs?.google_login_client_id?.value !== null) && (
									<GoogleLogin
										notificationState={notificationState}
										webClientId={configs?.google_login_client_id?.value}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessGoogleLogin={handleSuccessFacebook}
									/>
								)}
                {(configs?.apple_login_client_id?.value !== '' && configs?.google_login_client_id?.value !== null) && (
									<AppleLogin
										notificationState={notificationState}
										handleErrors={(err: any) => showToast(ToastType.Error, err)}
										handleLoading={(val: boolean) => setIsFBLoading(val)}
										handleSuccessAppleLogin={handleSuccessFacebook}
									/>
								)}
							</SocialButtons>
						</ButtonsWrapper>
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

				{/* {onNavigationRedirect && registerButtonText && (
          <ButtonsWrapper>
            <OButton
              onClick={() => onNavigationRedirect('Signup')}
              text={registerButtonText}
              style={loginStyle.btnOutline}
              borderColor={theme.colors.primary}
              imgRightSrc={null}
            />
          </ButtonsWrapper>
        )} */}
			</FormSide>
			<OModal open={isModalVisible} onClose={() => setIsModalVisible(false)}>
				<VerifyPhone
					phone={phoneInputData.phone}
					verifyPhoneState={verifyPhoneState}
					checkPhoneCodeState={checkPhoneCodeState}
					handleCheckPhoneCode={handleCheckPhoneCode}
					setCheckPhoneCodeState={setCheckPhoneCodeState}
					handleVerifyCodeClick={handleVerifyCodeClick}
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
	};
	return <LoginFormController {...loginProps} />;
};
