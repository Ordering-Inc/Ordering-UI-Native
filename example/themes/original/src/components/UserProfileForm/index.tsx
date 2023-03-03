import React, { useEffect, useState } from 'react';
import {
	UserFormDetails as UserProfileController,
	useSession,
	useLanguage,
	ToastType,
	useToast,
	useConfig
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ProfileParams } from '../../types';
import { UserFormDetailsUI } from '../UserFormDetails';

import { OIcon, OIconButton, OModal } from '../shared';
import { CenterView, Container } from './styles';
import NavBar from '../NavBar';
import { VerifyPhone } from '../VerifyPhone'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FastImage from 'react-native-fast-image'

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
		handleButtonUpdateClick,
		handleSendVerifyCode,
		verifyPhoneState,
		setFormState
	} = props;

	const theme = useTheme();

	const styles = StyleSheet.create({
		photo: {
			borderRadius: 7.6,
			shadowColor: theme.colors.black,
			shadowOffset: { width: 0, height: 1 },
			shadowRadius: 2,
			shadowOpacity: 0.2,
			backgroundColor: theme.colors.white,
		},
		navBarStyle: {
			paddingLeft: 40,
			paddingRight: 40,
			paddingTop: 15
		}
	});

	const [{ user }] = useSession();
	const [{ configs }] = useConfig();
	const [, t] = useLanguage();
	const [, { showToast }] = useToast();
	const { handleSubmit, errors, setValue, control } = useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [willVerifyOtpState, setWillVerifyOtpState] = useState(false);
	const [checkPhoneCodeState, setCheckPhoneCodeState] = useState({ loading: false, result: { error: false } })

	const [phoneInputData, setPhoneInputData] = useState({
		error: '',
		phone: {
			country_phone_code: null,
			cellphone: null,
		},
	});
	const [phoneUpdate, setPhoneUpdate] = useState(false);

	const onSubmit = (values: any) => {
		if (phoneInputData.error) {
			showToast(ToastType.Error, phoneInputData.error);
			return;
		}
		if (
			formState.changes.cellphone === '' &&
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
		if (formState.changes.password && formState.changes.password.length < 8) {
			showToast(
				ToastType.Error,
				t(
					'VALIDATION_ERROR_PASSWORD_MIN_STRING',
					'The Password must be at least 8 characters.',
				)
					.replace('_attribute_', t('PASSWORD', 'Password'))
					.replace('_min_', 8),
			);
			return;
		}

		handleButtonUpdateClick(values);
	};

	const handleImagePicker = () => {
		launchImageLibrary(
			{
				mediaType: 'photo',
				maxHeight: 200,
				maxWidth: 200,
				includeBase64: true,
			},
			(response: any) => {
				if (response.didCancel) {
					console.log('User cancelled image picker');
				} else if (response.errorMessage) {
					console.log('ImagePicker Error: ', response.errorMessage);
					showToast(ToastType.Error, response.errorMessage);
				} else {
					if (response?.assets?.length > 0) {
						const image = response?.assets[0]
						const url = `data:${image.type};base64,${image.base64}`
						handleButtonUpdateClick(null, true, url);
					} else {
						showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
					}
				}
			},
		);
	};

	const handleCancelEdit = () => {
		cleanFormState({ changes: {} });
		toggleIsEdit();
		setPhoneInputData({
			error: '',
			phone: {
				country_phone_code: null,
				cellphone: null,
			},
		});
	};

	const handleChangePhoneNumber = (number: any) => {
		setPhoneInputData(number);
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

	const handleVerifyCodeClick = () => {
		if (formState?.changes?.cellphone && formState?.changes?.country_phone_code) {
			const { cellphone, country_phone_code: countryPhoneCode } = formState?.changes

			setPhoneInputData({
				error: '',
				phone: {
					country_phone_code: countryPhoneCode,
					cellphone: cellphone,
				},
			});
			handleSendVerifyCode({
				cellphone: cellphone,
				country_phone_code: countryPhoneCode
			})
		}
	}

	useEffect(() => {
		if (formState.result.result && !formState.loading) {
			if (formState.result?.error) {
				showToast(ToastType.Error, formState.result.result);
			} else {
				showToast(
					ToastType.Success,
					t('UPDATE_SUCCESSFULLY', 'Update successfully'),
				);
			}
		}
	}, [formState.result]);

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
			setPhoneUpdate(true);
		} else {
			setPhoneUpdate(false);
		}
	}, [user?.country_phone_code]);

	useEffect(() => {
		if (willVerifyOtpState) handleVerifyCodeClick()
	}, [willVerifyOtpState])

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
				setWillVerifyOtpState(false)
				return
			}

			const okResult = verifyPhoneState.result?.result === 'OK'
			if (okResult) {
				!isModalVisible && setIsModalVisible(true)
				setWillVerifyOtpState(false)
			}
		}
	}, [verifyPhoneState])

	const handleSendPhoneCode = (values: any) => {
		setWillVerifyOtpState(false)
		setIsModalVisible(false)
		setFormState({
			...formState,
			changes: {
				...formState?.changes,
				verification_code: values?.code
			}
		})
	}

	return (
		<>
			<Container
				pdng={Platform.OS === 'ios' ? '20px' : '10px'}
			>
				<NavBar
					title={t('ACCOUNT', 'Account')}
					titleAlign={'center'}
					onActionLeft={() => navigation.goBack()}
					showCall={false}
					btnStyle={{ paddingLeft: 0 }}
				/>
				<KeyboardAvoidingView
					behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
					enabled={Platform.OS === 'ios' ? true : false}
					style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
				>
					<CenterView>
						<View style={styles.photo}>
							{user?.photo ? (
								<FastImage
									style={{ height: 60, width: 80, borderRadius: 8 }}
									source={{
										uri: user?.photo,
										priority: FastImage.priority.normal,
									}}
									resizeMode={FastImage.resizeMode.cover}
								/>
							) : (
								<Ionicons name='person-outline' size={50} />
							)}
						</View>
						<OIconButton
							icon={theme.images.general.camera}
							borderColor={theme.colors.clear}
							iconStyle={{ width: 20, height: 20 }}
							style={{ maxWidth: 40, position: 'absolute', alignSelf: 'center', backgroundColor: '#000', opacity: 0.5 }}
							onClick={() => handleImagePicker()}
						/>
					</CenterView>
					<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginVertical: 32, zIndex: 10 }} />
					<Spinner visible={formState?.loading || verifyPhoneState?.loading} />
					<UserFormDetailsUI
						{...props}
						isEdit
						setWillVerifyOtpState={setWillVerifyOtpState}
					/>
				</KeyboardAvoidingView>
			</Container>
			<OModal
				open={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				entireModal
			>
				<VerifyPhone
					phone={phoneInputData.phone}
					verifyPhoneState={verifyPhoneState}
					checkPhoneCodeState={checkPhoneCodeState}
					handleCheckPhoneCode={handleSendPhoneCode}
					handleVerifyCodeClick={handleVerifyCodeClick}
					onClose={() => setIsModalVisible(false)}
				/>
			</OModal>
		</>

	);
};

export const UserProfileForm = (props: any) => {
	const profileProps = {
		...props,
		UIComponent: ProfileUI,
	};
	return <UserProfileController {...profileProps} />;
};
