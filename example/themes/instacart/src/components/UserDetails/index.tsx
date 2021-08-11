import React, { useEffect, useState } from 'react';

import { UDContainer, UDHeader, UDInfo } from './styles';

import {
	UserFormDetails as UserFormController,
	useLanguage,
	useSession
} from 'ordering-components/native';

import { OIcon, OModal, OText } from '../shared';

import { UserFormDetailsUI } from '../UserFormDetails';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity, View } from 'react-native';

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
	const [isOpenChange, setOpenChange] = useState(false);

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
						<OText style={{ ...theme.labels.middle, fontWeight: '600', marginBottom: 2 }}>
							{userData?.name} {userData?.middle_name} {userData?.lastname} {userData?.second_lastname}
						</OText>
						{/* {cartStatus !== 2 && (
					!isEdit ? (
						<MaterialIcon
							name='pencil-outline'
							size={28}
							color={theme.colors.editColor}
							style={{ marginBottom: 10, marginLeft: 5 }}
							onPress={() => toggleIsEdit()}
						/>
					) : (
						<MaterialIcon
							name='cancel'
							color={theme.colors.cancelColor}
							size={24}
							style={{ marginBottom: 5, marginLeft: 5 }}
							onPress={() => toggleEditState()}
						/>
					)
					)} */}
					</UDHeader>

					{!isEdit ? (
						<UDInfo>
							<OText style={{ ...theme.labels.normal, marginBottom: 6 }} color={theme.colors.textSecondary}>
								{userData?.address}
							</OText>
							{!!(userData?.cellphone || user?.cellphone) && (
								<>
									<OText style={{ ...theme.labels.normal, marginBottom: 6 }} color={theme.colors.textSecondary}>
										{(userData?.country_phone_code) && `+${(userData?.country_phone_code)} `}{(userData?.cellphone)}
									</OText>
									{!!phoneUpdate && (
										<OText color={theme.colors.error} style={{ textAlign: 'center' }}>{t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}</OText>
									)}
								</>
							)}
							<TouchableOpacity onPress={() => setOpenChange(true)}>
								<OText style={theme.labels.small} color={theme.colors.primary}>{t('CHANGE', 'Change')}</OText>
							</TouchableOpacity>
						</UDInfo>
					) : (
						<UserFormDetailsUI {...props} phoneUpdate={phoneUpdate} togglePhoneUpdate={togglePhoneUpdate} isCheckout={isCheckout} />
					)}
				</UDContainer>
			)}

			<OModal entireModal open={isOpenChange} onClose={() => setOpenChange(false)}>
				<UserFormDetailsUI {...props} phoneUpdate={phoneUpdate} togglePhoneUpdate={togglePhoneUpdate} isCheckout={isCheckout} />
			</OModal>
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
