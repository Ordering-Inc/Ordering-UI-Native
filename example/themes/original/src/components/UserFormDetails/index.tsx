import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSession, useLanguage, ToastType, useToast, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { useForm, Controller } from 'react-hook-form';
import { SignupForm } from '../SignupForm'

import { UDForm, UDLoader, UDWrapper, WrapperPhone, WrapperBirthdate } from './styles';

import { OText, OButton, OInput, OModal, OIcon } from '../shared';
import { OAlert } from '../../../../../src/components/shared'

import { PhoneInputNumber } from '../PhoneInputNumber';
import { sortInputFields } from '../../utils';
import { ListItem } from '../UserProfile/styles';
import moment from 'moment';
import { DatePickerUI } from '../DatePicker';

const CONDITIONAL_CODES = ['PR']

export const UserFormDetailsUI = (props: any) => {
	const {
		isEdit,
		formState,
		showField,
		requiredFields,
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
		handlePlaceOrderAsGuest,
		isCheckout,
		setIsOpen,
		handleRemoveAccount,
		isProfile,
		isGuest,
		isOrderTypeValidationField,
		checkoutFields,
		isCheckoutPlace,
		setCellphoneStartZero,
		setPhoneState,
		isPhoneVerifyRequired,
		cellphoneOtpSent
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
		}
	});

	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [, { showToast }] = useToast();
	const { handleSubmit, control, errors, setValue } = useForm();

	const [{ user }, { login, logout }] = useSession();
	const [userPhoneNumber, setUserPhoneNumber] = useState<any>(null);
	const [isValid, setIsValid] = useState(false)
	const [isChanged, setIsChanged] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [birthdate, setBirthdate] = useState(user?.birthdate ?? null)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null,
		},
	});
	const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })

	const isAdmin = user?.level === 0
	const showInputPhoneNumber = isOrderTypeValidationField ? checkoutFields?.find(field => field?.validation_field?.code === 'mobile_phone')?.enabled : (validationFields?.fields?.checkout?.cellphone?.enabled ?? false)
	const showInputBirthday = isOrderTypeValidationField ? checkoutFields?.find(field => field?.validation_field?.code === 'birthdate')?.enabled : (validationFields?.fields?.checkout?.birthdate?.enabled ?? false)

	const handleSuccessSignup = (user: any) => {
		login({
			user,
			token: user?.session?.access_token
		})
		handlePlaceOrderAsGuest && handlePlaceOrderAsGuest()
	}

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

	const cellphoneValue = () => {
		let cellphone = user?.guest_id ? user?.guest_cellphone : user?.cellphone
		if (cellphone && CONDITIONAL_CODES.includes(user?.country_code)) {
			if (user?.country_code === 'PR') {
				cellphone = user?.cellphone?.slice(3)
			}
		}
		return cellphone
	}

	const setUserCellPhone = (isEdit = false) => {
		if (userPhoneNumber && !userPhoneNumber.includes('null') && !isEdit) {
			setUserPhoneNumber(userPhoneNumber);
			return;
		}
		const cellphone = user?.guest_id ? user?.guest_cellphone : user?.cellphone

		if (cellphone) {
			let phone = null;
			if (user?.country_phone_code) {
				phone = `+${user?.country_phone_code} ${cellphone}`;
			} else {
				phone = user?.cellphone;
			}
			setUserPhoneNumber(phone);
			setPhoneInputData({
				...phoneInputData,
				phone: {
					country_phone_code: user?.country_phone_code || null,
					cellphone: cellphoneValue()
				},
			});
			return;
		}
		setUserPhoneNumber(cellphone || '');
	};

	const onSubmit = () => {
		let content = ''
		if (requiredFields?.includes?.('birthdate') && !birthdate) {
			content = content + `${t('VALIDATION_ERROR_BIRTHDATE_REQUIRED', 'Birthdate is required')}\n`
		}
		if (phoneInputData.error) {
			content = content + `${phoneInputData.error}\n`
			showToast(ToastType.Error, content);
			return;
		}
		if (Object.keys(formState.changes).length > 0) {
			if (
				formState.changes?.cellphone === null &&
				((validationFields?.fields?.checkout?.cellphone?.enabled &&
					validationFields?.fields?.checkout?.cellphone?.required) ||
					(configs?.verification_phone_required?.value === '1' && !user?.guest_id))
			) {
				content = content + `${t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.',)}\n`
				showToast(ToastType.Error, content);
				return;
			}
			if (content.length > 0) {
				showToast(ToastType.Error, content);
				return
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

	const handleChangePhoneNumber = (number: any, rawNumber : any) => {
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
		setCellphoneStartZero && setCellphoneStartZero(rawNumber?.number && rawNumber?.countryCallingCode ? rawNumber?.number : null)
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

	const _handleChangeDate = (date: any) => {
		setBirthdate(date)
		const _birthdate = moment(date).format('YYYY-MM-DD')
		handleChangeInput({ target: { name: 'birthdate', value: _birthdate } })
		setShowDatePicker(false)
	}

	const onRemoveAccount = () => {
		setConfirm({
			open: true,
			content: [t('QUESTION_REMOVE_ACCOUNT', 'Are you sure that you want to remove your account?')],
			title: t('ACCOUNT_ALERT', 'Account alert'),
			handleOnAccept: async () => {
				setConfirm({ ...confirm, open: false })
				const response = await handleRemoveAccount?.(user?.id)
				if (response === 'OK'){
					logout()
				}
			}
		})
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
			if (isCheckout) {
				setIsOpen && setIsOpen(false)
				cleanFormState && cleanFormState({ changes: {} })
			}
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
		if (!validationFields.loading && birthdate) {
			setValue('birthdate', formState?.result?.result
				? formState?.result?.result?.birthdate
				: formState?.changes?.birthdate ?? (user && user?.birthdate) ?? '')
		}
	}, [validationFields, birthdate])

	useEffect(() => {
		if (!requiredFields || formState?.changes?.length === 0) return
		const _isValid = requiredFields.every((key: any) => formState?.changes[key])
		setIsValid(_isValid)
	}, [formState?.changes, requiredFields])

	useEffect(() => {
		if (!isPhoneVerifyRequired || cellphoneOtpSent || formState?.changes?.length === 0) return
		setPhoneState?.({
      cellphone: formState?.changes?.country_code === "PR" ? formState?.changes?.cellphone.replace('787', '') : formState?.changes?.cellphone,
      country_phone_code: formState?.changes?.country_code === "PR" ? '1787' : formState?.changes?.country_phone_code,
      formatted: `+${formState?.changes?.country_phone_code} ${formState?.changes?.cellphone}`
    })
	}, [formState?.changes, cellphoneOtpSent])

	return (
		<>
			<UDForm>
				{!validationFields?.loading &&
					sortInputFields({ values: isOrderTypeValidationField ? checkoutFields : validationFields?.fields?.checkout })
						.length > 0 && (
						<UDWrapper>
							{sortInputFields({
								values: isOrderTypeValidationField ? checkoutFields : validationFields?.fields?.checkout,
							}).map(
								(item: any) => {
									const field = item?.validation_field || item
									return (
										((isOrderTypeValidationField ? item?.enabled : (showField && showField(field.code))) && ((requiredFields && requiredFields?.includes?.(field.code)) || !requiredFields || !isCheckoutPlace)) && (
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
																	(user && user?.guest_id && field.code === 'email' ? user?.guest_email : user?.[field.code]) ??
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
													defaultValue={user && (field.code === 'email' && user?.guest_id ? user?.guest_email : user?.[field.code])}
												/>
											</React.Fragment>
										))
								},
							)}
							{((!user?.guest_id && showInputBirthday) || (isOrderTypeValidationField || user?.guest_id)) &&
								showInputBirthday &&
								((requiredFields && requiredFields?.includes?.('birthdate')) || !requiredFields || !isCheckoutPlace) &&
								(
									<>
										<WrapperBirthdate>
											<OText size={14} lineHeight={21} color={theme.colors.textNormal} weight={'500'} style={{ textTransform: 'capitalize', alignSelf: 'flex-start' }}>
												{t('BIRTHDATE', 'Birthdate')}
											</OText>
											<TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)}>
												<OText size={14} lineHeight={21} color={theme.colors.textNormal} weight={'500'} style={{ marginTop: 6 }}>
													{birthdate ? moment(birthdate).format('YYYY-MM-DD') : ''}
												</OText>
											</TouchableOpacity>
										</WrapperBirthdate>
										<DatePickerUI open={showDatePicker} birthdate={birthdate} onConfirm={_handleChangeDate} onCancel={() => setShowDatePicker(false)} />
									</>
								)}
							{((!user?.guest_id && !!showInputPhoneNumber) || (isOrderTypeValidationField || user?.guest_id)) &&
								((requiredFields && requiredFields?.includes?.('cellphone')) || !requiredFields || !isCheckoutPlace) &&
								(
									<WrapperPhone>
										<OText size={14} lineHeight={21} weight={'500'} color={theme.colors.textNormal}>{t('PHONE', 'Phone')}</OText>
										<PhoneInputNumber
											data={phoneInputData}
											handleData={handleChangePhoneNumber}
											changeCountry={(val: any) => changeCountry(val)}
											defaultValue={phoneUpdate ? '' : cellphoneValue()}
											defaultCode={user?.country_code ?? user?.country_phone_code ?? null}
											defaultCodeFallback={user?.country_phone_code}
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
												{cellphoneValue()}
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
						</UDWrapper>
					)}
				{isProfile && (
					<ListItem disabled={isAdmin} onPress={() => onRemoveAccount()} activeOpacity={0.7}>
						<OIcon src={theme.images.general.user} width={16} color={theme.colors.textNormal} style={{ marginEnd: 14 }} />
						<OText size={14} lineHeight={24} weight={'400'} style={{ opacity: isAdmin ? 0.5 : 1 }} color={theme.colors.danger5}>{t('REMOVE_ACCOUNT', 'Remove account')}</OText>
					</ListItem>
				)}
				{validationFields?.loading && (
					<UDLoader>
						<OText size={12}>{t('LOADING', 'Loading')}</OText>
					</UDLoader>
				)}
			</UDForm>
			{!hideUpdateButton && !isPhoneVerifyRequired && (
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
								textStyle={{ fontSize: 14 }}
								isDisabled={formState.loading}
								imgRightSrc={null}
								style={{ borderRadius: 7.6, shadowOpacity: 0, width: '100%', borderWidth: 1, marginTop: 20, marginBottom: 20 }}
								onClick={handleSubmit(onSubmit)}
							/>
						)}
				</>
			)}
			{isCheckoutPlace && (
				<OButton
					text={
						formState.loading
							? t('UPDATING', 'Updating...')
							: ((isCheckout && !!user?.guest_id)
								? t('SIGN_UP_AND_PLACE_ORDER', 'Sign up and place order')
								: t('CONTINUE', 'Continue'))
					}
					textStyle={{
						color: !user?.guest_id && (formState.loading || !isValid) ? theme.colors.primary : theme.colors.white,
						fontSize: 14
					}}
					isDisabled={!user?.guest_id && (formState.loading || !isValid)}
					imgRightSrc={null}
					style={{
						borderRadius: 7.6,
						shadowOpacity: 0,
						width: '100%',
						borderWidth: 1,
						marginTop: 20,
						marginBottom: 20,
						backgroundColor: !user?.guest_id && (formState.loading || !isValid) ? theme.colors.lightGray : theme.colors.primary,
						borderColor: !user?.guest_id && (formState.loading || !isValid) ? theme.colors.white : theme.colors.primary,
						opacity: !user?.guest_id && (formState.loading || !isValid) ? 0.3 : 1,
					}}
					onClick={handleSubmit(onSubmit)}
				/>
			)}
			{isCheckout && !!user?.guest_id && !requiredFields && (
				<TouchableOpacity style={{ marginTop: 10 }} onPress={() => handlePlaceOrderAsGuest()}>
					<OText color={theme.colors.primary} style={{ textAlign: 'center' }}>{t('PLACE_ORDER_AS_GUEST', 'Place order as guest')}</OText>
				</TouchableOpacity>
			)}
			<OModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			>
				<ScrollView style={{ paddingHorizontal: 20, width: '100%' }}>
					<SignupForm
						handleSuccessSignup={handleSuccessSignup}
						isGuest
						signupButtonText={t('SIGNUP', 'Signup')}
						useSignupByEmail
						useChekoutFileds
					/>
				</ScrollView>
			</OModal>
			<OAlert
				open={confirm.open}
				title={confirm.title}
				content={confirm.content}
				onAccept={confirm.handleOnAccept}
				onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
				onClose={() => setConfirm({ ...confirm, open: false, title: null })}
			/>
		</>
	);
};

