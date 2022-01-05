import React, { useEffect } from 'react'
import { AddressList as AddressListController, useLanguage, useOrder, useSession } from 'ordering-components/native'
import { AddressListContainer, AddressItem } from './styles'
import { StyleSheet, View } from 'react-native'
import { OButton, OText, OAlert, OModal, OIcon } from '../shared'
import { Container } from '../../layouts/Container'
import { AddressListParams } from '../../types'
import { NotFoundSource } from '../NotFoundSource'
import NavBar from '../NavBar'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { TouchableRipple } from 'react-native-paper'
import { useState } from 'react'
import { useTheme } from 'styled-components/native';

const AddressListUI = (props: AddressListParams) => {

	const {
		navigation,
		route,
		addressList,
		isFromProfile,
		nopadding,
		handleSetDefault,
		handleDelete,
		setAddressList,
		isGoBack,
		actionStatus,
		isFromBusinesses,
		isFromProductsList,
		afterSignup
	} = props

	const theme = useTheme();

	const [orderState] = useOrder()
	const [, t] = useLanguage()
	const [{ auth }] = useSession()

	const [isProfile, setIsProfile] = useState(isFromProfile || route?.params?.isFromProfile);

	const onNavigatorRedirect = () => {
		if (route && (isFromBusinesses || isGoBack)) {
			isGoBack ? goToBack() : onNavigationRedirect('BottomTab')
			return
		}
		if (route && route?.params?.isFromCheckout) {
			onNavigationRedirect('CheckoutPage')
			return
		}
		if (route && !route?.params?.isFromCheckout) {
			onNavigationRedirect('BottomTab')
		}

	}

	const uniqueAddressesList = (addressList.addresses && addressList.addresses.filter(
		(address: any, i: number, self: any) =>
			i === self.findIndex((obj: any) => (
				address.address === obj.address &&
				address.address_notes === obj.address_notes &&
				address.zipcode === obj.zipcode &&
				address.internal_number === obj.internal_number
			)))) || []

	const checkAddress = (address: any) => {
		if (!orderState?.options?.address) return true
		const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number']
		const values: any = []
		props.forEach(prop => {
			if (address[prop]) {
				if (prop === 'location') {
					values.push(address[prop].lat === orderState?.options?.address[prop]?.lat &&
						address[prop].lng === orderState?.options?.address[prop]?.lng)
				} else {
					values.push(address[prop] === orderState?.options?.address[prop])
				}
			} else {
				values.push(orderState?.options?.address[prop] === null || orderState?.options?.address[prop] === '')
			}
		})
		return values.every((value: any) => value)
	}

	const addressIcon = (tag: string) => {
		switch (tag) {
			case 'other':
				return theme.images.general.tag_plus
			case 'office':
				return theme.images.general.tag_building
			case 'home':
				return theme.images.general.tag_home
			case 'favorite':
				return theme.images.general.tag_heart
			default:
				return theme.images.general.tag_plus
		}
	}

	const handleSetAddress = (address: any) => {
		if (address.id === orderState?.options?.address_id) return
		handleSetDefault(address)
	}

	const handleSaveAddress = (address: any) => {
		let found = false
		const addresses = addressList.addresses.map((_address: any) => {
			if (_address?.id === address?.id) {
				Object.assign(_address, address)
				found = true
			} else if (address.default) {
				_address.default = false
			}
			return _address
		})
		if (!found) {
			addresses.push(address)
		}
		setAddressList({
			...addressList,
			addresses
		})
	}

	const goToBack = () => navigation?.canGoBack() && navigation.goBack()
	const onNavigationRedirect = (route: string, params?: any) => navigation.navigate(route, params)

	useEffect(() => {
		if (orderState.loading && auth && orderState.options.address?.location) {
			onNavigatorRedirect()
		}
	}, [orderState.options.address])

	useEffect(() => {
		console.log('From profile : ' + isProfile)
	}, [])

	return (
		<Container noPadding>
			{(!addressList.loading || (isFromProductsList || isFromBusinesses || isFromProfile || isProfile)) && (
				<AddressListContainer>
					{isProfile && (
						<NavBar
							title={t('MY_SAVED_PLACES', 'My saved places')}
							titleAlign={'center'}
							onActionLeft={() => goToBack()}
							showCall={false}
							btnStyle={{ paddingLeft: 0 }}
							paddingTop={0}
							isVertical
							titleWrapStyle={{ paddingHorizontal: 0 }}
						/>
					)}
					{
						route &&
						(
							route?.params?.isFromBusinesses ||
							route?.params?.isFromCheckout ||
							route?.params?.isFromProductsList
						) &&
						!isFromProfile &&
						(
							<NavBar
								title={t('ADDRESS_LIST', 'Address List')}
								titleAlign={'center'}
								onActionLeft={() => goToBack()}
								showCall={false}
								btnStyle={{ paddingLeft: 0 }}
								paddingTop={0}
								style={{ flexDirection: 'column', alignItems: 'flex-start' }}
								titleWrapStyle={{ paddingHorizontal: 0 }}
							/>
						)}
					{addressList.loading && (
						<>
							{[...Array(5)].map((item, i) => (
								<Placeholder key={i} style={{ paddingVertical: 20 }} Animation={Fade}>
									<View style={{ flexDirection: 'row' }}>
										<PlaceholderLine width={20} height={60} style={{ marginBottom: 0, marginRight: 15 }} />
										<Placeholder>
											<PlaceholderLine width={70} />
											<PlaceholderLine width={40} />
											<PlaceholderLine width={70} />
										</Placeholder>
									</View>
								</Placeholder>
							))}
						</>
					)}
					{
						!addressList.error &&
						addressList?.addresses?.length > 0 && (
							<>
								{uniqueAddressesList.map((address: any) => (
									<AddressItem
										key={address.id}
										isSelected={checkAddress(address)}
										onPress={() => handleSetAddress(address)}
										style={{ borderColor: checkAddress(address) ? theme.colors.primary : theme.colors.border }}
									>
										<OIcon src={addressIcon(address?.tag)} width={24} color={checkAddress(address) ? theme.colors.primary : theme.colors.disabled} style={{ marginEnd: 16 }} />
										<OText style={styles.address} size={12}>{address.address}</OText>
										<TouchableRipple
											onPress={() => !afterSignup ? onNavigationRedirect(
												'AddressForm',
												{
													address: address,
													isEditing: true,
													addressesList: addressList,
													onSaveAddress: handleSaveAddress,
													isSelectedAfterAdd: true,
													isFromProductsList: isFromProductsList,
													hasAddressDefault: !!orderState.options?.address?.location
												}
											) : onNavigationRedirect(
												'AddressFormInitial',
												{
													address: address,
													isEditing: true,
													addressesList: addressList,
													onSaveAddress: handleSaveAddress,
													isSelectedAfterAdd: true,
													isFromProductsList: isFromProductsList,
													hasAddressDefault: !!orderState.options?.address?.location
												})}
										>
											<OIcon src={theme.images.general.pencil} width={16} style={{ marginHorizontal: 4 }} />
										</TouchableRipple>
										<OAlert
											title={t('DELETE_ADDRESS', 'Delete Address')}
											message={t('QUESTION_DELETE_ADDRESS', 'Are you sure to you wants delete the selected address')}
											onAccept={() => handleDelete(address)}
											disabled={checkAddress(address)}
										>
											<OIcon
												src={theme.images.general.trash}
												width={16}
												color={theme.colors.disabled}
											/>
										</OAlert>
									</AddressItem>
								))}
							</>
						)}
					{!addressList.loading && addressList.error && (
						addressList.error.length > 0 && (
							<NotFoundSource
								content={
									addressList.error[0]?.message ||
									addressList.error[0] ||
									t('NETWORK_ERROR', 'Network Error, please reload the app')
								}
							/>
						)
					)}
					{!addressList.loading && !addressList.error && (
						<>
							{!(
								route && (route?.params?.isFromBusinesses || route?.params?.isFromCheckout)
							) && !isProfile && (
									<OText size={24}>
										{t('WHERE_DELIVER_NOW', 'Where do we deliver you?')}
									</OText>
								)}
							<OButton
								text={t('ADD_NEW_ADDRESS', 'Add new Address')}
								imgRightSrc=''
								bgColor={theme.colors.white}
								textStyle={{ color: theme.colors.primary }}
								style={styles.button}
								borderColor={theme.colors.primary}
								onClick={() => !afterSignup ? onNavigationRedirect(
									'AddressForm',
									{
										address: null,
										onSaveAddress: handleSaveAddress,
										addressesList: addressList?.addresses,
										nopadding: true,
										isSelectedAfterAdd: true,
										hasAddressDefault: !!orderState.options?.address?.location
									}) : onNavigationRedirect(
										'AddressFormInitial',
										{
											address: null,
											onSaveAddress: handleSaveAddress,
											addressesList: addressList?.addresses,
											nopadding: true,
											isSelectedAfterAdd: true,
											hasAddressDefault: !!orderState.options?.address?.location
										})}
							/>
						</>
					)}
					{!isProfile && addressList?.addresses?.length > 0 && (
						<OButton
							text={t('CONTINUE', 'Continue')}
							style={styles.button}
							onClick={() => onNavigatorRedirect()}
							textStyle={{ color: theme.colors.white }}
						/>
					)}
				</AddressListContainer>
			)}
		</Container>
	)
}

const styles = StyleSheet.create({
	address: {
		flex: 1,
		marginHorizontal: 5
	},
	icon: {
		flex: 0.2
	},
	buttonIcon: {
		width: 20,
		height: 20,
		resizeMode: 'contain',
		left: 20,
		position: 'absolute',
	},
	button: {
		marginTop: 30,
		marginBottom: 0,
		borderRadius: 7.6,
		borderWidth: 1,
		shadowOpacity: 0,
		height: 44,
	}
})

export const AddressList = (props: AddressListParams) => {
	const addressListProps = {
		...props,
		UIComponent: AddressListUI
	}
	return <AddressListController {...addressListProps} />
}
