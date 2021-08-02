import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSession, useLanguage } from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';

import { InputWrap, UDForm, UDLoader, UDWrapper, WrapperPhone } from './styles';

import { ToastType, useToast } from '../../../../providers/ToastProvider';
import { OText, OButton, OInput } from '../../../../components/shared';
import { colors, images } from '../../theme.json';

import { PhoneInputNumber } from '../PhoneInputNumber'
import { sortInputFields } from '../../../../utils';

export const UserFormDetailsUI = (props: any) => {
	const {
		isEdit,
		formState,
		showField,
		cleanFormState,
		onCloseProfile,
		isRequiredField,
		validationFields,
		handleChangeInput,
		handleButtonUpdateClick,
		phoneUpdate,
		hideUpdateButton
	} = props

	const [, t] = useLanguage();
	const { showToast } = useToast();
	const { handleSubmit, control, errors, setValue } = useForm();

	const [{ user }] = useSession()
	const [userPhoneNumber, setUserPhoneNumber] = useState<any>(null)
	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null
		}
	});

	const showInputPhoneNumber = validationFields?.fields?.checkout?.cellphone?.enabled ?? false

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

	const setUserCellPhone = (isEdit = false) => {
		if (userPhoneNumber && !userPhoneNumber.includes('null') && !isEdit) {
			setUserPhoneNumber(userPhoneNumber)
			return
		}
		if (user?.cellphone) {
			let phone = null
			if (user?.country_phone_code) {
				phone = `+${user?.country_phone_code} ${user?.cellphone}`
			} else {
				phone = user?.cellphone
			}
			setUserPhoneNumber(phone)
			setPhoneInputData({
				...phoneInputData,
				phone: {
					country_phone_code: user?.country_phone_code || null,
					cellphone: user?.cellphone || null
				}
			})
			return
		}
		setUserPhoneNumber(user?.cellphone || '')
	}

	const onSubmit = () => {
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error)
			return
		}
		if (Object.keys(formState.changes).length > 0) {
			if (
				formState.changes?.cellphone === null &&
				validationFields?.fields?.checkout?.cellphone?.enabled &&
				validationFields?.fields?.checkout?.cellphone?.required
			) {
				showToast(
					ToastType.Error,
					t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.')
				);
				return
			}
			let changes = null
			if (user?.cellphone && !userPhoneNumber) {
				changes = {
					country_phone_code: '',
					cellphone: ''
				}
			}
			handleButtonUpdateClick(changes)
		}
	}

	const handleChangePhoneNumber = (number: any) => {
		setPhoneInputData(number)
		let phoneNumber = {
			country_phone_code: {
				name: 'country_phone_code',
				value: number.phone.country_phone_code
			},
			cellphone: {
				name: 'cellphone',
				value: number.phone.cellphone
			}
		}
		handleChangeInput(phoneNumber, true)
	}

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			const list = Object.values(errors)
			if (phoneInputData.error) {
				list.push({ message: phoneInputData.error })
			}
			let stringError = ''
			list.map((item: any, i: number) => {
				stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
			})
			showToast(ToastType.Error, stringError)
		}
	}, [errors])

	useEffect(() => {
		if ((!formState?.loading && formState?.result?.error)) {
			formState.result?.result && showToast(
				ToastType.Error,
				formState.result?.result[0]
			)
		}
	}, [formState?.loading])

	useEffect(() => {
		if (!isEdit && onCloseProfile) {
			onCloseProfile()
		}
		if ((user || !isEdit) && !formState?.loading) {
			setUserCellPhone()
			if (!isEdit && !formState?.loading) {
				cleanFormState && cleanFormState({ changes: {} })
				setUserCellPhone(true)
			}
		}
	}, [user, isEdit])
	return (
		<>
			<UDForm>
				{!validationFields?.loading &&
					sortInputFields({ values: validationFields?.fields?.checkout }).length > 0 &&
					(
						<UDWrapper>
							{sortInputFields({ values: validationFields.fields?.checkout }).map((field: any) =>
							(
								showField && showField(field.code) && (
									<InputWrap>
										<OText style={{flexBasis: '30%', fontSize: 14, fontWeight: '600'}}>{field?.name}</OText>
										<React.Fragment key={field.id}>
											<Controller
												key={field.id}
												control={control}
												render={() => (
													<OInput
														name={field.code}
														placeholder={t(field.code.toUpperCase(), field?.name)}
														style={styles.inputStyle}
														inputStyle={{fontSize: 12, lineHeight: 18}}
														//   icon={field.code === 'email' ? images.general.email : images.general.user}
														autoCapitalize={field.code === 'email' ? 'none' : 'sentences'}
														isDisabled={!isEdit}
														value={formState?.changes[field.code] ?? (user && user[field.code]) ?? ''}
														onChange={(val: any) => {
															field.code !== 'email' ? setValue(field.code, val.target.value) : setValue(field.code, val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
															field.code !== 'email' ? handleChangeInput(val) : handleChangeInput({ target: { name: 'email', value: val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, '') } })
														}}
														autoCorrect={field.code === 'email' && false}
														type={field.code === 'email' ? 'email-address' : 'default'}
														returnKeyType='done'
														autoCompleteType={field.code === 'email' ? 'email' : 'off'}
													/>
												)}
												name={field.code}
												rules={getInputRules(field)}
												defaultValue={user && user[field.code]}
											/>
										</React.Fragment>
									</InputWrap>
								)
							))}

							{!!showInputPhoneNumber && (
								<WrapperPhone>
									<PhoneInputNumber
										data={phoneInputData}
										handleData={(val: any) => handleChangePhoneNumber(val)}
										defaultValue={phoneUpdate ? '' : user?.cellphone}
										defaultCode={user?.country_phone_code || null}
										textInputProps={{
											style: {borderWidth: 0, fontSize: 12}
										}}
										textWrapStyle={{borderColor: colors.clear, borderWidth: 0, height: 40, paddingStart: 0}}
									/>
									{phoneUpdate && (
										<OText color={colors.error} style={{ marginHorizontal: 10, textAlign: 'center' }}>{t('YOUR_PREVIOUS_CELLPHONE', 'Your previous cellphone')}: {user?.cellphone}</OText>
									)}
								</WrapperPhone>
							)}

						</UDWrapper>
					)}
				{validationFields?.loading && (
					<UDLoader>
						<OText size={20}>
							{t('LOADING', 'Loading')}
						</OText>
					</UDLoader>
				)}
			</UDForm>
			{!hideUpdateButton && (
				<>
					{((formState && Object.keys(formState?.changes).length > 0 && isEdit) || formState?.loading) && (
						<OButton
							text={formState.loading ? t('UPDATING', 'Updating...') : t('UPDATE', 'Update')}
							bgColor={colors.primary}
							textStyle={{ color: 'white' }}
							borderColor={colors.primary}
							isDisabled={formState.loading}
							imgRightSrc={null}
							onClick={handleSubmit(onSubmit)}
						/>
					)}
				</>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	btnOutline: {
		backgroundColor: '#FFF',
		color: colors.primary
	},
	inputStyle: {
		borderRadius: 0,
		fontSize: 12,
		height: 40
	}
});
