import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession, useLanguage, ToastType, useToast, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { useForm, Controller } from 'react-hook-form';

import { UDForm, UDLoader, UDWrapper, WrapperPhone } from './styles';

import { OText, OButton, OInput } from '../shared';

import { PhoneInputNumber } from '../PhoneInputNumber';
import { sortInputFields } from '../../utils';
import CheckBox from '@react-native-community/checkbox';

export const UserFormDetailsUI = (props: any) => {
	const {
		isEdit,
		formState,
		showField,
		requiredFields,
		onClose,
		setIsSubmit,
		cleanFormState,
		onCloseProfile,
		isRequiredField,
		validationFields,
		handleChangeInput,
		handleButtonUpdateClick,
		phoneUpdate,
		hideUpdateButton,
		setWillVerifyOtpState,
		handleChangePromotions,
	} = props;

	const theme = useTheme();


	const styles = StyleSheet.create({
		btnOutline: {
			backgroundColor: '#FFF',
			color: theme.colors.primary,
		},
		inputStyle: {
			borderRadius: 0,
			marginBottom: 25,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.border,
			color: theme.colors.textNormal,
			fontSize: 12,
			padding: 0,
		},
		phoneSelect: {
			borderWidth: 0,
			marginStart: -5,
			marginEnd: 0,
			marginTop: -3,
			height: 32,
			width: 44
		},
		phoneInputStyle: {
			height: 30,
			borderWidth: 0,
			fontSize: 12,
			paddingStart: 0,
			paddingBottom: 0,
			marginBottom: -0,
		},
		checkBoxStyle: {
			width: 25,
			height: 25,
		}
	});

	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [, { showToast }] = useToast();
	const { handleSubmit, control, errors, setValue } = useForm();

	const [{ user }] = useSession();
	const [userPhoneNumber, setUserPhoneNumber] = useState<any>(null);
	const [isValid, setIsValid] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null,
		},
	});

	const showInputPhoneNumber = (validationFields?.fields?.checkout?.cellphone?.enabled ?? false) || configs?.verification_phone_required?.value === '1'

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

	const setUserCellPhone = (isEdit = false) => {
		if (userPhoneNumber && !userPhoneNumber.includes('null') && !isEdit) {
			setUserPhoneNumber(userPhoneNumber);
			return;
		}
		if (user?.cellphone) {
			let phone = null;
			if (user?.country_phone_code) {
				phone = `+${user?.country_phone_code} ${user?.cellphone}`;
			} else {
				phone = user?.cellphone;
			}
			setUserPhoneNumber(phone);
			setPhoneInputData({
				...phoneInputData,
				phone: {
					country_phone_code: user?.country_phone_code || null,
					cellphone: user?.cellphone || null,
				},
			});
			return;
		}
		setUserPhoneNumber(user?.cellphone || '');
	};

	const onSubmit = () => {
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
			return;
		}
		if (Object.keys(formState.changes).length > 0) {
			if (
				formState.changes?.cellphone === null &&
				((validationFields?.fields?.checkout?.cellphone?.enabled &&
					validationFields?.fields?.checkout?.cellphone?.required) ||
					configs?.verification_phone_required?.value === '1')
			) {
				showToast(
					ToastType.Error,
					t(
						'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
						'The field Phone Number is required.',
					),
				);
				return;
			}
			let changes = null;
			if (user?.cellphone && !userPhoneNumber) {
				changes = {
					country_phone_code: '',
					cellphone: '',
				};
			}
			setIsSubmit && setIsSubmit(true)
			handleButtonUpdateClick(changes);
		}
	};

	const handleChangePhoneNumber = (number: any) => {
		setPhoneInputData(number);
		setIsChanged(true)
		let phoneNumber = {
			country_phone_code: {
				name: 'country_phone_code',
				value: number.phone.country_phone_code,
			},
			cellphone: {
				name: 'cellphone',
				value: number.phone.cellphone,
			},
		};
		handleChangeInput(phoneNumber, true);
	};

	const changeCountry = (country: any) => {
		let countryCode = {
			country_code: {
				name: 'country_code',
				value: country.cca2
			}
		}
		handleChangeInput(countryCode, true);
	}

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			const list = Object.values(errors);
			if (phoneInputData.error) {
				list.push({ message: phoneInputData.error });
			}
			let stringError = '';
			list.map((item: any, i: number) => {
				stringError +=
					i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
			});
			showToast(ToastType.Error, stringError);
		}
	}, [errors]);

	useEffect(() => {
		if (!formState?.loading && formState?.result?.error) {
			formState.result?.result &&
				showToast(ToastType.Error, formState.result?.result[0]);
		}
	}, [formState?.loading]);

	useEffect(() => {
		if (!isEdit && onCloseProfile) {
			onCloseProfile();
		}
		if ((user || !isEdit) && !formState?.loading) {
			setUserCellPhone();
			if (!isEdit && !formState?.loading) {
				cleanFormState && cleanFormState({ changes: {} });
				setUserCellPhone(true);
			}
		}
	}, [user, isEdit]);

	useEffect(() => {
		if (!phoneInputData.error &&
			phoneInputData?.phone?.country_phone_code &&
			phoneInputData?.phone?.cellphone &&
			configs?.verification_phone_required?.value === '1' &&
			formState?.changes?.cellphone &&
			isChanged) {
			setWillVerifyOtpState?.(true)
		}
	}, [phoneInputData, configs?.verification_phone_required?.value, isChanged])

	useEffect(() => {
		if (!requiredFields || formState?.changes?.length === 0) return
			const _isValid = requiredFields.every((key: any) => formState?.changes[key])
			setIsValid(_isValid)
		}, [formState?.changes, requiredFields])
	
	return (
		<>
			<UDForm>
				{!validationFields?.loading &&
					sortInputFields({ values: validationFields?.fields?.checkout })
						.length > 0 && (
						<UDWrapper>
							{sortInputFields({
								values: validationFields.fields?.checkout,
							}).map(
								(field: any) =>
									showField &&
									showField(field.code) && ((requiredFields && requiredFields.includes(field.code)) || !requiredFields) && (
										<React.Fragment key={field.id}>
											<Controller
												key={field.id}
												control={control}
												render={() => (
													<>
														<OText size={14} lineHeight={21} color={theme.colors.textNormal} weight={'500'} style={{ textTransform: 'capitalize', alignSelf: 'flex-start' }}>
															{t(field?.code?.toUpperCase(), field?.name)}
														</OText>
														<OInput
															name={field.code}
															placeholder={t(
																field.code.toUpperCase(),
																field?.name,
															)}
															inputStyle={styles.inputStyle}
															style={{ paddingLeft: 0, paddingRight: 0, marginTop: 6, height: 44, minHeight: 44 }}
															autoCapitalize={
																field.code === 'email' ? 'none' : 'sentences'
															}
															isDisabled={false}
															value={
																formState?.changes[field.code] ??
																(user && user[field.code]) ??
																''
															}
															onChange={(val: any) => {
																field.code !== 'email'
																	? setValue(field.code, val.target.value)
																	: setValue(
																		field.code,
																		val.target.value
																			.toLowerCase()
																			.replace(
																				/[&,()%";:ç?<>{}\\[\]\s]/g,
																				'',
																			),
																	);
																field.code !== 'email'
																	? handleChangeInput(val)
																	: handleChangeInput({
																		target: {
																			name: 'email',
																			value: val.target.value
																				.toLowerCase()
																				.replace(
																					/[&,()%";:ç?<>{}\\[\]\s]/g,
																					'',
																				),
																		},
																	});
															}}
															autoCorrect={field.code === 'email' && false}
															type={
																field.code === 'email'
																	? 'email-address'
																	: 'default'
															}
															returnKeyType="done"
															autoCompleteType={
																field.code === 'email' ? 'email' : 'off'
															}
														/>
													</>
												)}
												name={field.code}
												rules={getInputRules(field)}
												defaultValue={user && user[field.code]}
											/>
										</React.Fragment>
									),
							)}

							{!!showInputPhoneNumber &&((requiredFields && requiredFields.includes('cellphone')) || !requiredFields) && (
								<WrapperPhone>
									<OText size={14} lineHeight={21} weight={'500'} color={theme.colors.textNormal}>{t('PHONE', 'Phone')}</OText>
									<PhoneInputNumber
										data={phoneInputData}
										handleData={(val: any) => handleChangePhoneNumber(val)}
										changeCountry={(val: any) => changeCountry(val)}
										defaultValue={phoneUpdate ? '' : user?.cellphone}
										defaultCode={user?.country_code ?? user?.country_phone_code ?? null}
										boxStyle={styles.phoneSelect}
										inputStyle={styles.phoneInputStyle}
										textStyle={{ color: theme.colors.textNormal, fontSize: 12, padding: 0 }}
										noDropIcon
									/>
									{phoneUpdate && (
										<OText
											size={10}
											color={theme.colors.error}
											style={{ marginHorizontal: 10, textAlign: 'center' }}>
											{t('YOUR_PREVIOUS_CELLPHONE', 'Your previous cellphone')}:{' '}
											{user?.cellphone}
										</OText>
									)}
								</WrapperPhone>
							)}
							{!requiredFields && (
								<Controller
									control={control}
									render={() => (
										<>
											<OText size={14} lineHeight={21} color={theme.colors.textNormal} weight={'500'} style={{ textTransform: 'capitalize', alignSelf: 'flex-start' }}>
												{t('PASSWORD', 'Password')}
											</OText>
											<OInput
												name='password'
												placeholder={t('FRONT_VISUALS_PASSWORD', 'Password')}
												inputStyle={styles.inputStyle}
												style={{ paddingLeft: 0, paddingRight: 0, marginTop: 6, height: 44, minHeight: 44 }}
												autoCapitalize='none'
												isDisabled={false}
												value={
													formState?.changes['password'] ??
													(user && user['password']) ??
													''
												}
												onChange={(val: any) => {
													setValue('password', val.target.value)
													handleChangeInput(val)
												}}
												autoCorrect
												type='default'
												returnKeyType="done"
												autoCompleteType='off'
												isSecured
											/>
										</>
									)}
									name='password'
									rules={getInputRules({ name: 'password', code: 'password' })}
									defaultValue=''
								/>
							)}
							{!requiredFields && (
								<Controller
									control={control}
									render={({ onChange, value }: any) => (
										<TouchableOpacity
											style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, width: '100%' }}
											onPress={() => {
												onChange(!value)
												handleChangePromotions(!value)
											}}
										>
											<CheckBox
												value={value}
												boxType={'square'}
												tintColors={{
													true: theme.colors.primary,
													false: theme.colors.disabled
												}}
												tintColor={theme.colors.disabled}
												onCheckColor={theme.colors.primary}
												onTintColor={theme.colors.primary}
												style={Platform.OS === 'ios' && styles.checkBoxStyle}
											/>
											<OText style={{ fontSize: 14, paddingHorizontal: 5, paddingLeft: 10 }}>{t('RECEIVE_NEWS_EXCLUSIVE_PROMOTIONS', 'Receive newsletters and exclusive promotions')}</OText>
										</TouchableOpacity>
									)}
									name='promotions'
									defaultValue={formState?.result?.result
										? !!formState?.result?.result?.settings?.notification?.newsletter
										: !!(formState?.changes?.settings?.notification?.newsletter ?? (user && user?.settings?.notification?.newsletter))}
								/>
							)}

						</UDWrapper>
					)}
				{validationFields?.loading && (
					<UDLoader>
						<OText size={12}>{t('LOADING', 'Loading')}</OText>
					</UDLoader>
				)}
			</UDForm>
			{!hideUpdateButton && (
				<>
					{((formState &&
						Object.keys(formState?.changes).length > 0 &&
						isEdit) ||
						formState?.loading) && (
							<OButton
								text={
									formState.loading
										? t('UPDATING', 'Updating...')
										: t('UPDATE', 'Update')
								}
								bgColor={theme.colors.white}
								textStyle={{ color: theme.colors.primary, fontSize: 14 }}
								borderColor={theme.colors.primary}
								isDisabled={formState.loading}
								imgRightSrc={null}
								style={{ borderRadius: 7.6, shadowOpacity: 0, width: '100%', borderWidth: 1, marginTop: 20, marginBottom: 20 }}
								onClick={handleSubmit(onSubmit)}
							/>
						)}
				</>
			)}
			{requiredFields && (
				<OButton
					text={
						formState.loading
							? t('UPDATING', 'Updating...')
							: t('CONTINUE', 'Continue')
					}
					bgColor={theme.colors.white}
					textStyle={{ color: theme.colors.primary, fontSize: 14 }}
					borderColor={theme.colors.primary}
					isDisabled={formState.loading || !isValid}
					imgRightSrc={null}
					style={{ borderRadius: 7.6, shadowOpacity: 0, width: '100%', borderWidth: 1, marginTop: 20, marginBottom: 20 }}
					onClick={handleSubmit(onSubmit)}
				/>
			)}
		</>
	);
};

