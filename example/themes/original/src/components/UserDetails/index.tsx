import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { UDContainer, UDHeader, UDForm, UDInfo, EditBtn } from './styles';

import {
	UserFormDetails as UserFormController,
	useLanguage,
	useSession,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText } from '../shared';

import { UserFormDetailsUI } from '../UserFormDetails';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

const UserDetailsUI = (props: any) => {
	const {
		isEdit,
		formState,
		cleanFormState,
		cartStatus,
		toggleIsEdit,
		validationFields,
		isUserDetailsEdit,
		phoneUpdate,
		togglePhoneUpdate,
		isCheckout
	} = props

	const theme = useTheme();

	const [, t] = useLanguage()
	const [{ user }] = useSession()
	const userData = props.userData || (!formState.result.error && formState.result?.result) || user


	useEffect(() => {
		if (isUserDetailsEdit) {
			!isEdit && toggleIsEdit()
		}
	}, [isUserDetailsEdit])

	const toggleEditState = () => {
		toggleIsEdit()
		cleanFormState({ changes: {} })
	}

	useEffect(() => {
		if (user?.cellphone && !user?.country_phone_code) {
			togglePhoneUpdate(true)
		} else {
			togglePhoneUpdate(false)
		}
	}, [user?.country_phone_code])

	return (
		<>
			{(validationFields.loading || formState.loading) && (
				<Placeholder Animation={Fade}>
					<PlaceholderLine height={20} width={70} />
					<PlaceholderLine height={15} width={60} />
					<PlaceholderLine height={15} width={60} />
					<PlaceholderLine height={15} width={80} style={{ marginBottom: 20 }} />
				</Placeholder>
			)}

			{!(validationFields.loading || formState.loading) && (
				<UDContainer>
					<UDHeader>
						<OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal}>
							{t('CUSTOMER_DETAILS', 'Customer Details')}
						</OText>
						{cartStatus !== 2 && (
							!isEdit ? (
								<EditBtn onPress={() => toggleIsEdit()} activeOpacity={0.7}>
									<OIcon
										src={theme.images.general.pencil}
										width={16}
										height={16}
										color={theme.colors.editColor}
										style={{ marginBottom: 10, marginLeft: 5 }}
									/>
								</EditBtn>
							) : (
								<EditBtn onPress={() => toggleEditState()} activeOpacity={0.7}>
									<OIcon
										src={theme.images.general.close}
										color={theme.colors.cancelColor}
										width={16}
										height={16}
										style={{ marginBottom: 5, marginLeft: 5 }}
									/>
								</EditBtn>
							)
						)}
					</UDHeader>

					{!isEdit ? (
						<UDInfo>
							<OText size={12} lineHeight={18} weight={'400'}>
								{userData?.name} {userData?.middle_name} {userData?.lastname} {userData?.second_lastname}
							</OText>
							<OText size={12} lineHeight={18} weight={'400'}>
								{userData?.email}
							</OText>
							{!!(userData?.cellphone || user?.cellphone) && (
								<>
									<OText size={12} lineHeight={18} weight={'400'}>
										{(userData?.country_phone_code) && `+${(userData?.country_phone_code)} `}{(userData?.cellphone)}
									</OText>
									{!!phoneUpdate && (
										<OText color={theme.colors.error} style={{ textAlign: 'center' }}>{t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}</OText>
									)}
								</>
							)}
						</UDInfo>
					) : (
						<UserFormDetailsUI {...props} phoneUpdate={phoneUpdate} togglePhoneUpdate={togglePhoneUpdate} isCheckout={isCheckout} />
					)}
				</UDContainer>
			)}
		</>
	)
}

export const UserDetails = (props: any) => {
	const userDetailsProps = {
		...props,
		UIComponent: UserDetailsUI
	}

	return <UserFormController {...userDetailsProps} />
}
