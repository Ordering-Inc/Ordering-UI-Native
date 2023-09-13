import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Recaptcha from 'react-native-recaptcha-that-works'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
	ForgotPasswordForm as ForgotPasswordController,
	useLanguage,
	useToast,
	ToastType,
	useConfig
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import NavBar from '../NavBar';
import { FormInput, FormSide, RecaptchaButton } from '../LoginForm/styles'
import { Container } from './styles'

import { OButton, OInput, OText } from '../shared';

const ForgotPasswordUI = (props: any) => {
	const {
		navigation,
		formState,
		handleButtonForgotPasswordClick,
		handleReCaptcha,
		enableReCaptcha,
		reCaptchaValue
	} = props;
	const [, t] = useLanguage();
	const [, { showToast }] = useToast();
	const [{ configs }] = useConfig();
	const { control, handleSubmit, errors } = useForm();
	const [recaptchaConfig, setRecaptchaConfig] = useState<any>({})
	const [recaptchaVerified, setRecaptchaVerified] = useState(false)

	const theme = useTheme();

	const styles = StyleSheet.create({
		inputStyle: {
			marginBottom: 25,
			borderWidth: 1,
			borderColor: theme.colors.border,
			minHeight: 40,
			borderRadius: 7.6,
		}
	});

	const [emailSent, setEmailSent] = useState(null);
	const recaptchaRef = useRef<any>({});

	const onSubmit = (values: any) => {
		setEmailSent(values.email)
		handleButtonForgotPasswordClick && handleButtonForgotPasswordClick(values)
	}

	const handleChangeInputEmail = (value: string, onChange: any) => {
		onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
	}

	const handleOpenRecaptcha = () => {
		setRecaptchaVerified(false)
		handleReCaptcha(null)
		if (reCaptchaValue) return

		if (!recaptchaConfig?.siteKey) {
			showToast(ToastType.Error, t('NO_RECAPTCHA_SITE_KEY', 'The config doesn\'t have recaptcha site key'));
			return
		}
		if (!recaptchaConfig?.baseUrl) {
			showToast(ToastType.Error, t('NO_RECAPTCHA_BASE_URL', 'The config doesn\'t have recaptcha base url'));
			return
		}
		recaptchaRef.current.open()
	}

	const onRecaptchaVerify = (token: any) => {
		setRecaptchaVerified(true)
		handleReCaptcha(token)
	}

	const handleRecaptchaExpire = () => {
		setRecaptchaVerified(false)
		handleReCaptcha(null)
	}

	useEffect(() => {
		if (!formState.loading && emailSent) {
			if (formState.result?.error) {
				setEmailSent(null)
				formState.result?.result && showToast(
					ToastType.Error,
					typeof formState.result?.result === 'string'
						? formState.result?.result
						: formState.result?.result[0]
				)
				return
			}
			showToast(
				ToastType.Success,
				t('IF_ACCOUNT_EXIST_EMAIL_SEND_PASSWORD', 'If an account exists with this email a password will be sent')
			)
		}
	}, [formState])

	useEffect(() => {
		if (configs && Object.keys(configs).length > 0 && enableReCaptcha) {
			setRecaptchaConfig({
				siteKey: configs?.security_recaptcha_site_key?.value || null,
				baseUrl: configs?.security_recaptcha_base_url?.value || null
			})
		}
	}, [configs, enableReCaptcha])

	return (
		<Container>
			<NavBar
				title={t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
				titleAlign={'auto'}
				btnStyle={{ paddingLeft: 0 }}
				onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
				showCall={false}
				paddingTop={0}
				style={{ flexDirection: 'column', alignItems: 'flex-start' }}
				titleStyle={{ width: '100%', marginLeft: 0, paddingLeft: 0 }}
				titleWrapStyle={{ paddingHorizontal: 0, paddingStart: 0, flex: 1 }}
			/>
			<FormSide>
				<OText
					color={'gray'}
					size={16}
					weight={'300'}
					style={{ marginBottom: 30 }}
				>
					{t('FORGOT_PASSWORD_TEXT_MESSAGE', "Enter your email address and we'll sent a link to reset your password.")}
				</OText>
				<FormInput>
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
								style={styles.inputStyle}
								icon={theme.images.general.email}
								onChange={(e: any) => {
									handleChangeInputEmail(e, onChange)
								}}
								value={value}
								autoCapitalize='none'
								autoCorrect={false}
								type='email-address'
								autoCompleteType='email'
								returnKeyType='done'
								blurOnSubmit
								onSubmitEditing={handleSubmit(onSubmit)}
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
					{enableReCaptcha && (
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
								onExpire={handleRecaptchaExpire}
							/>
						</>
					)}

					<OButton
						text={emailSent && !formState.result?.error ? t('LINK_SEND_FORGOT_PASSWORD', 'Link Sent') : t('FRONT_RECOVER_PASSWORD', 'Recover Password')}
						bgColor={emailSent && !formState.result?.error ? theme.colors.disabled : theme.colors.primary}
						borderColor={emailSent && !formState.result?.error ? theme.colors.disabled : theme.colors.primary}
						isLoading={formState.loading}
						imgRightSrc={null}
						onClick={emailSent && !formState.result?.error ? () => { } : handleSubmit(onSubmit)}
						style={{ borderRadius: 7.6, shadowOpacity: 0 }}
					/>
				</FormInput>
			</FormSide>
		</Container>
	);
};

export const ForgotPasswordForm = (props: any) => {
	const ForgotPasswordProps = {
		...props,
		isRecaptchaEnable: true,
		UIComponent: ForgotPasswordUI
	}
	return <ForgotPasswordController {...ForgotPasswordProps} />
}
