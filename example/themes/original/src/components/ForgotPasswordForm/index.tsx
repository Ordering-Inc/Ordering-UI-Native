import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import {
	ForgotPasswordForm as ForgotPasswordController,
	useLanguage,
	useToast,
	ToastType,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import NavBar from '../NavBar';
import { FormInput, FormSide } from '../LoginForm/styles'
import { Container } from './styles'

import { OButton, OInput, OText } from '../shared';

const ForgotPasswordUI = (props: any) => {
	const {
		navigation,
		formState,
		handleButtonForgotPasswordClick,
	} = props;
	const [, t] = useLanguage();
	const [, { showToast }] = useToast();
	const { control, handleSubmit, errors } = useForm();

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

	const onSubmit = (values: any) => {
		setEmailSent(values.email)
		handleButtonForgotPasswordClick && handleButtonForgotPasswordClick(values)
	}

	const handleChangeInputEmail = (value: string, onChange: any) => {
		onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
	}

	useEffect(() => {
		if (!formState.loading && emailSent) {
			if (formState.result?.error) {
				setEmailSent(null)
				formState.result?.result && showToast(
					ToastType.Error,
					formState.result?.result[0]
				)
				return
			}
			showToast(
				ToastType.Success,
				`${t('SUCCESS_SEND_FORGOT_PASSWORD', 'Your link has been sent to the email')}: ${emailSent}`
			)
		}
	}, [formState])

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors)
			let stringError = ''
			list.map((item: any, i: number) => {
				stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
			})
			showToast(ToastType.Error, stringError)
		}
	}, [errors])

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

					<OButton
						text={emailSent && !formState.result?.error ? t('LINK_SEND_FORGOT_PASSWORD', 'Link Sent') : t('FRONT_RECOVER_PASSWORD', 'Recover Password')}
						textStyle={{ color: 'white' }}
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
		UIComponent: ForgotPasswordUI
	}
	return <ForgotPasswordController {...ForgotPasswordProps} />
}
