import React, { useEffect, useState } from 'react';
import {
	UserFormDetails as UserProfileController,
	useSession,
	useLanguage,
} from 'ordering-components/native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet, View } from 'react-native';
import { colors, images } from '../../theme.json';
import { ToastType, useToast } from '../../../../providers/ToastProvider';
import { ProfileParams } from '../../../../types';
import { AddressList } from '../AddressList'
import { LogoutButton } from '../LogoutButton'
import { LanguageSelector } from '../LanguageSelector'
import { UserFormDetailsUI } from '../UserFormDetails'

import {
	OIcon,
	OIconButton,
	OText,
	OButton,
} from '../../../../components/shared';
import {
	CenterView,
	UserData,
	Names,
	EditButton,
	Actions
} from './styles';

const ProfileUI = (props: ProfileParams) => {
	const {
		navigation,
		isEdit,
		formState,
		validationFields,
		showField,
		isRequiredField,
		toggleIsEdit,
		cleanFormState,
		handleChangeInput,
		handleButtonUpdateClick
	} = props;

	const [{ user }] = useSession();
	const [, t] = useLanguage();
	const { showToast } = useToast();
	const { handleSubmit, errors, setValue, control } = useForm();

	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null
		}
	});
	const [phoneUpdate, setPhoneUpdate] = useState(false)

	const onSubmit = (values: any) => {
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error)
			return
		}
		if (
			formState.changes.cellphone === '' &&
			validationFields?.fields?.checkout?.cellphone?.enabled &&
			validationFields?.fields?.checkout?.cellphone?.required
		) {
			showToast(
				ToastType.Error,
				t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.')
			);
			return
		}
		if (formState.changes.password && formState.changes.password.length < 8) {
			showToast(ToastType.Error, t('VALIDATION_ERROR_PASSWORD_MIN_STRING', 'The Password must be at least 8 characters.').replace('_attribute_', t('PASSWORD', 'Password')).replace('_min_', 8))
			return
		}

		handleButtonUpdateClick(values);
	}

	const handleImagePicker = () => {
		launchImageLibrary({ mediaType: 'photo', maxHeight: 200, maxWidth: 200, includeBase64: true }, (response: any) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.errorMessage) {
				console.log('ImagePicker Error: ', response.errorMessage);
				showToast(ToastType.Error, response.errorMessage);
			} else {
				if (response.uri) {
					const url = `data:${response.type};base64,${response.base64}`
					handleButtonUpdateClick(null, true, url);
				} else {
					showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
				}
			}
		});
	};

	const handleCancelEdit = () => {
		cleanFormState({ changes: {} });
		toggleIsEdit();
		setPhoneInputData({
			error: '',
			phone: {
				country_phone_code: null,
				cellphone: null
			}
		})
	};

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

	useEffect(() => {
		if (formState.result.result && !formState.loading) {
			if (formState.result?.error) {
				showToast(ToastType.Error, formState.result.result);
			} else {
				showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
			}
		}
	}, [formState.result])

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors);
			let stringError = '';
			list.map((item: any, i: number) => {
				stringError +=
					i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
			});
			showToast(ToastType.Error, stringError);
		}
	}, [errors]);

	useEffect(() => {
		if (user?.cellphone && !user?.country_phone_code) {
			setPhoneUpdate(true)
		} else {
			setPhoneUpdate(false)
		}
	}, [user?.country_phone_code])

	return (
		<>
			<Actions>
				{/* <LanguageSelector /> */}
				<LogoutButton />
			</Actions>
			<CenterView>
				<OIcon
					url={user?.photo}
					src={!user?.photo && images.general.user}
					width={94}
					height={94}
					style={{ borderRadius: 7.6, resizeMode: 'cover' }}
				/>
				{isEdit && 
					<OIconButton
						icon={images.general.camera}
						borderColor={colors.clear}
						iconStyle={{ width: 30, height: 30, tintColor: 'white' }}
						style={{ maxWidth: 40, position: 'absolute', bottom: 0 }}
						onClick={() => handleImagePicker()}
					/>
				}
			</CenterView>
			<Spinner visible={formState?.loading} />
			{!isEdit ? (
				<UserData>
					<Names>
						<OText size={14} weight={'600'} lineHeight={21} style={{ flexBasis: '30%' }}>{t('NAME', 'Name')}</OText>
						<OText size={12} lineHeight={18}>{`${user?.name} ${user?.middle_name} ${user?.lastname} ${user?.second_lastname}`}</OText>
					</Names>
					{/* {(!!user?.middle_name || !!user?.second_lastname) && (
						<Names>
							<OText size={14} weight={'600'} lineHeight={21} style={{ flexBasis: '30%' }}>{t('MIDDLE_NAME', 'Middle Name')}</OText>
							<OText size={12} lineHeight={18}>{`${user?.middle_name} ${user?.second_lastname}`}</OText>
						</Names>
					)} */}
					<Names>
						<OText size={14} weight={'600'} lineHeight={21} style={{ flexBasis: '30%' }}>{t('EMAIL', 'Email')}</OText>
						<OText size={12} lineHeight={18}>{`${user?.email}`}</OText>
					</Names>
					{!!user?.cellphone && (
						<Names>
							<OText size={14} weight={'600'} lineHeight={21} style={{ flexBasis: '30%' }}>{t('PHONE', 'Phone')}</OText>
							<OText size={12} lineHeight={18}>{`${user?.cellphone}`}</OText>
						</Names>
					)}
					{!!phoneUpdate && (
						<OText
							color={colors.error}
						>
							{t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}
						</OText>
					)}
				</UserData>
			) : (
				<View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
					<UserFormDetailsUI
						{...props}
						hideUpdateButton
					/>
				</View>
			)}
			{!validationFields.loading && (
				<EditButton>
					{!isEdit ? (
						<OButton
							text={t('EDIT', 'Edit')}
							bgColor={colors.primaryContrast}
							borderColor={colors.primaryContrast}
							isDisabled={formState.loading}
							imgRightSrc={null}
							textStyle={{ fontSize: 14, fontWeight: '600', color: colors.primary }}
							style={{ ...styles.editButton }}
							onClick={toggleIsEdit}
						/>
					) : (
						<>
							<OButton
								text={t('CANCEL', 'Cancel')}
								textStyle={{ color: colors.white, fontSize: 14, fontWeight: '600' }}
								bgColor={colors.primary}
								borderColor={colors.primary}
								isDisabled={formState.loading}
								imgRightSrc={null}
								style={{ ...styles.editButton }}
								onClick={handleCancelEdit}
							/>
							{((formState &&
								Object.keys(formState?.changes).length > 0 && isEdit) || formState?.loading) &&
								(
									<OButton
										text={formState.loading ? t('UPDATING', 'Updating...') : t('UPDATE', 'Update')}
										bgColor={colors.primaryContrast}
										textStyle={{ color: formState.loading ? 'black' : 'white', fontSize: 14, fontWeight: '600' }}
										borderColor={colors.primaryContrast}
										isDisabled={formState.loading}
										imgRightSrc={null}
										style={{ ...styles.editButton }}
										onClick={handleSubmit(onSubmit)}
									/>
								)}
						</>
					)}
				</EditButton>
			)}

			{user?.id && (
				<AddressList
					nopadding
					isFromProfile
					userId={user.id}
					navigation={navigation}
				/>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	dropdown: {
		borderColor: colors.whiteGray,
		height: 50,
		borderRadius: 25,
		marginTop: 16,
	},
	inputbox: {
		marginVertical: 8,
		width: '90%'
	},
	editButton: {
		borderRadius: 25,
		height: 37,
		borderWidth: 0,
		color: colors.primary,
		shadowOpacity: 0,
		marginVertical: 8,
		width: 100,
		paddingLeft: 12,
		paddingRight: 12
	},
});

export const UserProfileForm = (props: any) => {
	const profileProps = {
		...props,
		UIComponent: ProfileUI,
	};
	return <UserProfileController {...profileProps} />;
};
