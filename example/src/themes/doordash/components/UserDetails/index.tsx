import React, { useEffect, useState } from 'react';
import { TextStyle, TouchableOpacity, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { UDContainer, UDHeader, UDForm, UDInfo } from './styles';

import {
	UserFormDetails as UserFormController,
	useLanguage,
	useSession
} from 'ordering-components/native';

import { OIcon, OText } from '../../../../components/shared';
import { colors, images, labels } from '../../theme.json';

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
		togglePhoneUpdate
	} = props

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
						<OText style={labels.middle as TextStyle}>
							{t('CUSTOMER_DETAILS', 'Customer Details').toUpperCase()}
						</OText>
						{cartStatus !== 2 && (
							!isEdit ? (
								<TouchableOpacity onPress={() => toggleIsEdit()}>
									<OIcon src={images.general.pencil} width={16} color={colors.textSecondary} />
								</TouchableOpacity>
							) : (
								<TouchableOpacity onPress={() => toggleEditState()}>
									<OIcon src={images.general.close} width={16} color={colors.red} />
								</TouchableOpacity>
							)
						)}
					</UDHeader>

					{!isEdit ? (
						<UDInfo>
							<OText style={labels.normal as TextStyle}>
								{userData?.name} {userData?.middle_name} {userData?.lastname} {userData?.second_lastname}
							</OText>
							<OText style={labels.normal as TextStyle}>
								{userData?.address}
							</OText>
							<OText style={labels.normal as TextStyle}>
								{userData?.email}
							</OText>
							{!!(userData?.cellphone || user?.cellphone) && (
								<>
									<OText style={labels.normal as TextStyle}>
										{(userData?.country_phone_code) && `+${(userData?.country_phone_code)} `}{(userData?.cellphone)}
									</OText>
									{!!phoneUpdate && (
										<OText color={colors.error} style={{ textAlign: 'center' }}>{t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}</OText>
									)}
								</>
							)}
						</UDInfo>
					) : (
						<UserFormDetailsUI {...props} phoneUpdate={phoneUpdate} togglePhoneUpdate={togglePhoneUpdate} />
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
