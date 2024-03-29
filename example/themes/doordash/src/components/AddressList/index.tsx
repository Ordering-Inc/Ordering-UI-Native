import React, { useEffect, useState } from 'react'
import { AddressList as AddressListController, useLanguage, useOrder, useSession } from 'ordering-components/native'
import { AddressListContainer, AddressItem } from './styles'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OButton, OText, OAlert, OModal, OIcon } from '../shared'
import { Container } from '../../layouts/Container'
import { AddressFormParams, AddressListParams } from '../../types'
import { NotFoundSource } from '../NotFoundSource'
import NavBar from '../NavBar'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'

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
		afterSignup,
		isFromCheckout
	} = props

	const theme = useTheme();


	const [orderState] = useOrder()
	const [, t] = useLanguage()
	const [{ auth }] = useSession()

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
				return theme.images.general.tag_other
			case 'office':
				return theme.images.general.tag_office
			case 'home':
				return theme.images.general.tag_home
			case 'favorite':
				return theme.images.general.tag_favorite
			default:
				return theme.images.general.tag_other
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

	return (
		<Container>
			{(!addressList.loading || (isFromProductsList || isFromBusinesses || isFromProfile)) && (
				<AddressListContainer>
					{isFromProfile && (
						<OText size={16} lineHeight={21} weight={Platform.OS == 'ios' ? '600' : 'bold'} mBottom={12}>{t('SAVED_PLACES', 'My saved places')}</OText>
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
								rightImg={null}
								btnStyle={{ paddingLeft: 0 }}
								paddingTop={0}
								style={{ marginHorizontal: -40 }}
							/>
						)}
					{addressList.loading && (
						<>
							{[...Array(5)].map((item, i) => (
								<Placeholder key={i} style={{ padding: 20 }} Animation={Fade}>
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
									>
										<OIcon
											src={addressIcon(address?.tag)}
											width={16}
											color={theme.colors.primary}
											style={styles.icon}
										/>
										<OText style={styles.address}>{address.address}</OText>
										<TouchableOpacity style={{ marginEnd: 7 }} onPress={() => !afterSignup ? onNavigationRedirect(
											'AddressForm',
											{
												address: address,
												isEditing: true,
												addressesList: addressList,
												onSaveAddress: handleSaveAddress,
												isSelectedAfterAdd: true,
												isFromProductsList: isFromProductsList,
												hasAddressDefault: !!orderState.options?.address?.location,
												isFromCheckout: isFromCheckout
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
											})}>

											<OIcon
												src={theme.images.general.pencil}
												width={16}
												color={theme.colors.textPrimary}
											/>
										</TouchableOpacity>
										<OAlert
											title={t('DELETE_ADDRESS', 'Delete Address')}
											message={t('QUESTION_DELETE_ADDRESS', 'Are you sure to you wants delete the selected address')}
											onAccept={() => handleDelete(address)}
											disabled={checkAddress(address)}
										>
											<OIcon
												src={theme.images.general.trash}
												width={16}
												color={!checkAddress(address) ? theme.colors.textPrimary : theme.colors.disabled}
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
							) && !isFromProfile && (
									<OText size={24}>
										{t('WHERE_DELIVER_NOW', 'Where do we deliver you?')}
									</OText>
								)}
							<OButton
								text={t('ADD_NEW_ADDRESS', 'Add new Address')}
								imgRightSrc=''
								imgLeftSrc={''}
								bgColor={theme.colors.white}
								style={styles.button}
								textStyle={{ fontSize: 14, fontWeight: Platform.OS == 'ios' ? '600' : 'bold', color: theme.colors.primary }}
								borderColor={theme.colors.primary}
								onClick={() => !afterSignup ? onNavigationRedirect(
									'AddressForm',
									{
										address: null,
										onSaveAddress: handleSaveAddress,
										addressesList: addressList?.addresses,
										nopadding: true,
										isSelectedAfterAdd: true,
										hasAddressDefault: !!orderState.options?.address?.location,
										isFromCheckout: isFromCheckout
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
					{!isFromProfile && addressList?.addresses?.length > 0 && (
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
		marginEnd: 10,
		fontSize: 12,
		lineHeight: 18,
	},
	icon: {
		marginEnd: 24
	},
	buttonIcon: {
		width: 20,
		height: 20,
		resizeMode: 'contain',
		left: 20,
		position: 'absolute',
	},
	button: {
		marginVertical: 30,
		height: 40,
		borderWidth: 1,
		shadowOpacity: 0
	}
})

export const AddressList = (props: AddressListParams) => {
	const addressListProps = {
		...props,
		UIComponent: AddressListUI
	}
	return <AddressListController {...addressListProps} />
}
