import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, TouchableOpacity, Keyboard, TouchableWithoutFeedback, TextStyle, Platform } from 'react-native'
import { AddressForm as AddressFormController, useLanguage, useConfig, useSession, useOrder, ToastType, useToast } from 'ordering-components/native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import Geocoder from 'react-native-geocoding';

import { _retrieveStoreData } from '../../providers/StoreUtil';
import { OInput, OButton, OText, OIcon } from '../shared'
import { AddressFormParams } from '../../types'
import { getTraduction } from '../../utils'
import { useTheme } from 'styled-components/native';
import { GoogleMap } from '../GoogleMap'
import NavBar from '../NavBar'

import {
	AddressFormContainer,
	AutocompleteInput,
	IconsContainer,
	GoogleMapContainer,
	FormInput,
	InputWrapper
} from './styles'

const inputNames = [
	{ name: 'address', code: 'Address' },
	{ name: 'internal_number', code: 'Internal number' },
	{ name: 'zipcode', code: 'Zipcode' },
	{ name: 'address_notes', code: 'Address notes' }
]

const AddressFormUI = (props: AddressFormParams) => {
	const {
		navigation,
		updateChanges,
		address,
		formState,
		isEditing,
		handleChangeInput,
		addressState,
		addressesList,
		saveAddress,
		isRequiredField,
		isFromProductsList,
		hasAddressDefault,
		afterSignup,
		isFromCheckout
	} = props

	const theme = useTheme();

	const styles = StyleSheet.create({
		iconContainer: {
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			paddingHorizontal: 18,
			paddingVertical: 5,
		},
		icons: {
			borderRadius: 20,
			color: theme.colors.white
		},
		inputsStyle: {
			borderWidth: 0,
			borderRadius: 7.6,
			height: 40,
			minHeight: 40,
		},
		textAreaStyles: {
			borderColor: theme.colors.clear,
			backgroundColor: theme.colors.backgroundGray,
			borderRadius: 7.6,
			marginBottom: 20,
			borderWidth: 0,
			height: 92,
			maxHeight: 92,
			minHeight: 92,
			textAlignVertical: 'top',
			alignItems: 'flex-start'
		},
		searchIcon: {
			position: 'absolute',
			top: 13,
			zIndex: 1000
		}
	})

	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const [, { showToast }] = useToast()
	const [configState] = useConfig()
	const [orderState] = useOrder()
	const { handleSubmit, errors, control, setValue } = useForm()

	const [toggleMap, setToggleMap] = useState(false)
	const [alertState, setAlertState] = useState<{ open: boolean, content: Array<string>, key?: string | null }>({ open: false, content: [], key: null })
	const [addressTag, setAddressTag] = useState(addressState?.address?.tag)
	const [firstLocationNoEdit, setFirstLocationNoEdit] = useState({ value: { lat: null, lng: null }, address: null })
	const [isFirstTime, setIsFirstTime] = useState(true)
	const [locationChange, setLocationChange] = useState(
		isEditing
			? addressState?.address?.location
			: formState.changes?.location ?? null
	)
	const [saveMapLocation, setSaveMapLocation] = useState(false)
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const [isSignUpEffect, setIsSignUpEffect] = useState(false)

	const googleInput: any = useRef(null)
	const internalNumberRef: any = useRef(null)
	const zipCodeRef: any = useRef(null)
	const addressNotesRef: any = useRef(null)

	const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value
	const isLocationRequired = configState.configs?.google_autocomplete_selection_required?.value === '1' ||
		configState.configs?.google_autocomplete_selection_required?.value === 'true'
	const maxLimitLocation = configState?.configs?.meters_to_change_address?.value

	const isGuestUser = props.isGuestUser || props.isGuestFromStore;

	const continueAsGuest = () => navigation.navigate('BusinessList')
	const goToBack = () => navigation?.canGoBack() && navigation.goBack()

	const tagsName = [
		{ icon: theme.images.general.tag_home, value: 'home' },
		{ icon: theme.images.general.tag_office, value: 'office' },
		{ icon: theme.images.general.tag_favorite, value: 'favorite' },
		{ icon: theme.images.general.tag_other, value: 'other' }
	]

	const getAddressFormatted = (address: any) => {
		const data: any = { address: null, error: null }
		Geocoder.init(googleMapsApiKey);
		Geocoder.from(address)
			.then(json => {
				if (json.results && json.results?.length > 0) {
					let postalCode = null
					for (const component of json.results?.[0].address_components) {
						const addressType = component.types?.[0]
						if (addressType === 'postal_code') {
							postalCode = component.short_name
							break
						}
					}
					data.address = {
						address,
						location: json.results[0].geometry.location,
						map_data: {
							library: 'google',
							place_id: json.results?.[0].place_id
						}
					}
					if (postalCode) {
						data.address.zipcode = postalCode
					}

					const arrayList = isEditing
						? addressesList?.addresses?.filter((address: any) => address.id !== addressState?.address?.id) || []
						: addressesList || []
					const addressToCompare = isEditing
						? { ...addressState.address, ...data.address, ...formState.changes }
						: { ...data.address, ...formState?.changes }

					const isAddressAlreadyExist = arrayList
						.map((address: any) => checkAddress(address, addressToCompare))
						.some((value: any) => value) ?? false

					if (!isAddressAlreadyExist) {
						saveAddress(data.address)
						if (isGuestUser) {
							continueAsGuest()
						}
						if (!isGuestUser && !auth) {
							!isFromProductsList
								? navigation.navigate('Business')
								: navigation?.canGoBack() && navigation.goBack()
						}
						return
					}

					setAlertState({
						open: true,
						content: [t('ADDRESS_ALREADY_EXIST', 'The address already exists')]
					})
				} else {
					setAlertState({
						open: true,
						content: [t('ERROR_NOT_FOUND_ADDRESS', 'Error, address not found')]
					})
				}
			})
			.catch(error => {
				setAlertState({
					open: true,
					content: [error?.message || error?.toString()]
				})
			});
	}

	const onSubmit = () => {
		if (!auth && formState?.changes?.address === '' && addressState?.address?.address) {
			setAlertState({
				open: true,
				content: [t('VALIDATION_ERROR_ADDRESS_REQUIRED', 'The field Address is required')]
			})
			return
		}
		if (formState?.changes?.address && !formState?.changes?.location) {
			if (isLocationRequired) {
				setAlertState({
					open: true,
					content: [t('ADDRESS_REQUIRE_LOCATION', 'The address needs a location, please select one of the suggested')]
				})
				return
			}
			getAddressFormatted(formState?.changes?.address)
			return
		}

		const arrayList = isEditing
			? addressesList?.addresses?.filter((address: any) => address.id !== addressState?.address?.id) || []
			: addressesList || []
		const addressToCompare = isEditing
			? { ...addressState.address, ...formState.changes }
			: formState?.changes

		const isAddressAlreadyExist = arrayList.map((address: any) => checkAddress(address, addressToCompare)).some((value: any) => value) ?? false

		if (!isAddressAlreadyExist) {
			saveAddress()
			if (isGuestUser) {
				continueAsGuest()
			}
			if (!isGuestUser && !auth && !afterSignup) {
				!isFromProductsList
					? navigation.navigate('Business')
					: navigation?.canGoBack() && navigation.goBack()
			}
			return
		}

		setAlertState({
			open: true,
			content: [t('ADDRESS_ALREADY_EXIST', 'The address already exists')]
		})
	}

	/**
	 * Returns true when the user made no changes
	 * @param {object} address
	 */
	const checkAddress = (address: any, addressToCompare: any) => {
		const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number']
		const values: any = []
		props.forEach(prop => {
			if (addressToCompare[prop]) {
				if (prop === 'location') {
					values.push(address[prop]?.lat === addressToCompare[prop]?.lat &&
						address[prop]?.lng === addressToCompare[prop]?.lng)
				} else {
					values.push(address[prop] === addressToCompare[prop])
				}
			} else {
				values.push(!address[prop])
			}
		})
		return values.every((value: any) => value)
	}

	const handleChangeAddress = (data: any, details: any) => {
		if (!data) {
			updateChanges({ location: details?.geometry?.location })
			return
		}
		const addressSelected = {
			address: data?.description || data?.address,
			location: details?.geometry?.location,
			utc_offset: details?.utc_offset || null,
			map_data: { library: 'google', place_id: data?.place_id },
			zip_code: data?.zip_code || null
		}
		updateChanges(addressSelected)
	}

	const handleAddressTag = (tag: string) => {
		setAddressTag(tag)
		handleChangeInput({
			target: {
				name: 'tag',
				value: tag
			}
		})
	}

	const handleToggleMap = () => {
		setToggleMap(!toggleMap)
	}

	useEffect(() => {
		if (orderState.loading && !addressesList && orderState.options.address && auth && !afterSignup && !isFromCheckout) {
			!isFromProductsList ? navigation.navigate('BottomTab') : navigation.navigate('Business')
		}
	}, [orderState.options.address])

	useEffect(() => {
		if (alertState.open && alertState?.key !== 'ERROR_MAX_LIMIT_LOCATION') {
			alertState.content && showToast(
				ToastType.Error,
				alertState.content
			)
		}
	}, [alertState.content])

	useEffect(() => {
		if (!auth) {
			inputNames.forEach(field =>
				setValue(
					field.name,
					formState?.changes[field.name] ||
					(orderState?.options?.address && orderState?.options?.address[field.name]) ||
					''
				)
			)
			return
		}

		if (!formState.loading && formState.result?.error) {
			setAlertState({
				open: true,
				content: formState.result?.result || [t('ERROR', 'Error')]
			})
		}

		setValue('address', formState?.changes?.address ?? addressState.address?.address ?? '')
		if (!isEditing) {
			formState?.changes?.address && setLocationChange(formState?.changes?.location)
			if (
				formState?.changes?.address &&
				formState?.changes?.address !== firstLocationNoEdit?.address &&
				formState?.changes?.location &&
				formState?.changes?.location?.lat !== firstLocationNoEdit.value?.lat &&
				formState?.changes?.location?.lng !== firstLocationNoEdit.value?.lng
			) {
				setFirstLocationNoEdit({
					value: formState?.changes?.location,
					address: formState?.changes?.address
				})
			}
		}

		if (isEditing) {
			if (formState?.changes?.location) {
				const prevLocation = { lat: Math.trunc(locationChange.lat), lng: Math.trunc(locationChange.lng) }
				const newLocation = { lat: Math.trunc(formState?.changes?.location?.lat), lng: Math.trunc(formState?.changes?.location?.lng) }
				if (prevLocation.lat !== newLocation.lat && prevLocation.lng !== newLocation.lng) {
					setLocationChange(formState?.changes?.location)
				}
			}
		}
	}, [formState])

	useEffect(() => {
		if (formState?.result?.result && !formState?.loading) {
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
		if (googleInput?.current) {
			googleInput?.current?.setAddressText(address?.address || formState.changes?.address || addressState.address.address || '')
		}
	}, [])

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setIsKeyboardShow(true)
		})
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setIsKeyboardShow(false)
		})
		return () => {
			keyboardDidShowListener.remove()
			keyboardDidHideListener.remove()
		}
	}, [])

	return (
		<>
			<NavBar
				title={t('ADD_ADDRESS', 'Add address')}
				titleAlign={'center'}
				onActionLeft={goToBack}
			/>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<>
					<AddressFormContainer style={{ height: 550, overflow: 'scroll' }}>
						<FormInput>
							<AutocompleteInput>
								<Controller
									control={control}
									name='address'
									defaultValue={address?.address || formState.changes?.address || addressState.address.address || ''}
									rules={{ required: isRequiredField && isRequiredField('address') ? t(`VALIDATION_ERROR_ADDRESS_REQUIRED`, `The field Address is required`) : null }}
									render={() => (
										<GooglePlacesAutocomplete
											placeholder={t('ADD_ADDRESS', 'Add a address')}
											onPress={(data, details: any) => {
												handleChangeAddress(data, details)
											}}
											query={{ key: googleMapsApiKey }}
											fetchDetails
											ref={googleInput}
											textInputProps={{
												onChangeText: (text) => {
													if (!isFirstTime) {
														handleChangeInput({ target: { name: 'address', value: text } })
														setValue('address', text)
													}
													setIsFirstTime(false)
												},
												onSubmitEditing: () => internalNumberRef?.current?.focus?.(),
												autoCorrect: false,
												blurOnSubmit: false,
												returnKeyType: 'next'
											}}
											onFail={(error) => setAlertState({ open: true, content: getTraduction(error) })}
											styles={{
												listView: {
													position: 'relative',
													elevation: 2,
													marginBottom: 10
												},
												container: {
													zIndex: 100
												},
												textInput: {
													borderWidth: 0,
													flexGrow: 1,
													fontSize: 14,
													lineHeight: 21,
													fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
													paddingStart: 30,
													paddingEnd: 20,
													minHeight: 50,
													fontFamily: 'Poppins-Regular',
													marginBottom: !isKeyboardShow && (addressState?.address?.location || formState?.changes?.location) ? 10 : 20
												}
											}}
										/>
									)}
								/>
								<View style={styles.searchIcon}>
									<OIcon src={theme.images.general.search} width={16} />
								</View>
							</AutocompleteInput>

							{(addressState?.address?.location || formState?.changes?.location) && (
								<GoogleMapContainer>
									<GoogleMap
										location={!auth
											? (addressState?.address?.location || formState.changes?.location)
											: (formState.changes?.location || locationChange)
										}
										handleChangeAddressMap={handleChangeAddress}
										maxLimitLocation={maxLimitLocation}
										saveLocation={saveMapLocation}
										setSaveLocation={setSaveMapLocation}
										handleToggleMap={handleToggleMap}
									/>
								</GoogleMapContainer>
							)}

							{!isKeyboardShow && (addressState?.address?.location || formState?.changes?.location) && (
								<OText>{address?.address || formState.changes?.address || addressState.address.address || ''}</OText>
							)}

							<InputWrapper style={{ marginTop: 0 }}>
								<OText style={{ ...theme.labels.middle, flexBasis: '35%' }}>{t('APT_SUITE', 'Apt./Suite')}</OText>
								<Controller
									control={control}
									name='internal_number'
									rules={{ required: isRequiredField && isRequiredField('internal_number') ? t(`VALIDATION_ERROR_INTERNAL_NUMBER_REQUIRED`, `The field internal number is required`) : null }}
									defaultValue={address?.internal_number || formState.changes?.internal_number || addressState?.address?.internal_number || ''}
									render={() => (
										<OInput
											name='internal_number'
											placeholder={t('INTERNAL_NUMBER', 'Internal number')}
											onChange={(text: string) => {
												handleChangeInput(text)
												setValue('internal_number', text)
											}}
											value={address?.internal_number || formState.changes?.internal_number || addressState?.address?.internal_number || ''}
											style={styles.inputsStyle}
											forwardRef={internalNumberRef}
											returnKeyType='next'
											onSubmitEditing={() => zipCodeRef?.current?.focus?.()}
											blurOnSubmit={false}
											inputStyle={{ fontSize: 12 }}
										/>
									)}
								/>
							</InputWrapper>
							<InputWrapper>
								<OText style={{ ...theme.labels.middle, flexBasis: '35%' }}>{t('ZIPCODE', 'Zipcode')}</OText>
								<Controller
									control={control}
									name='zipcode'
									rules={{ required: isRequiredField && isRequiredField('zipcode') ? t(`VALIDATION_ERROR_ZIP_CODE_REQUIRED`, `The field Zip Code is required`) : null }}
									defaultValue={address?.zipcode || formState.changes?.zipcode || addressState.address.zipcode || ''}
									render={() => (
										<OInput
											name='zipcode'
											placeholder={t('ZIP_CODE', 'Zip code')}
											onChange={(text: string) => {
												handleChangeInput(text)
												setValue('zipcode', text)
											}}
											value={address?.zipcode || formState.changes?.zipcode || addressState.address.zipcode || ''}
											style={styles.inputsStyle}
											forwardRef={zipCodeRef}
											returnKeyType='next'
											onSubmitEditing={() => addressNotesRef?.current?.focus?.()}
											blurOnSubmit={false}
											inputStyle={{ fontSize: 12 }}
										/>
									)}
								/>
							</InputWrapper>
							<View style={{ marginTop: 17, marginBottom: 20 }}>
								<OText style={{ ...theme.labels.middle, marginBottom: 8 } as TextStyle}>{t('ADDRESS_NOTES', 'Address notes')}</OText>
								<Controller
									control={control}
									name='address_notes'
									rules={{ required: isRequiredField && isRequiredField('address_notes') ? t(`VALIDATION_ERROR_ADDRESS_NOTES_REQUIRED`, `The field address notes is required`) : null }}
									defaultValue={address?.address_notes || formState.changes?.address_notes || addressState.address.address_notes || ''}
									render={() => (
										<OInput
											name='address_notes'
											placeholder={t('ADDRESS_NOTES', 'Address notes')}
											onChange={(text: any) => {
												handleChangeInput(text)
												setValue('address_notes', text)
											}}
											value={address?.address_notes || formState.changes?.address_notes || addressState.address.address_notes || ''}
											multiline
											style={styles.textAreaStyles}
											returnKeyType='done'
											forwardRef={addressNotesRef}
											blurOnSubmit
											inputStyle={{ fontSize: 12 }}
										/>
									)}
								/>
							</View>

						</FormInput>
						<View>
							{!isKeyboardShow && (
								<IconsContainer>
									{tagsName.map(tag => (
										<TouchableOpacity
											key={tag.value}
											onPress={() => handleAddressTag(tag.value)}
										>
											<View
												style={{
													paddingHorizontal: 7,
													paddingVertical: 4,
													alignItems: 'center'
												}}
											>
												<OIcon src={tag.icon} width={24} color={addressTag === tag.value ? theme.colors.primary : theme.colors.textSecondary} />
												<OText color={addressTag === tag.value ? theme.colors.primary : theme.colors.textSecondary} style={{ ...theme.labels.small, textTransform: 'capitalize', marginTop: 3 }}>{tag.value}</OText>
											</View>
										</TouchableOpacity>
									))}
								</IconsContainer>
							)}
						</View>

						{/* <OModal open={toggleMap} onClose={() => handleToggleMap()} entireModal customClose >
						{(!auth
							? (addressState?.address?.location || formState.changes?.location)
							: (formState.changes?.location || locationChange)
						) && (
								<GoogleMapContainer>
									<GoogleMap
										location={!auth
											? (addressState?.address?.location || formState.changes?.location)
											: (formState.changes?.location || locationChange)
										}
										handleChangeAddressMap={handleChangeAddress}
										maxLimitLocation={maxLimitLocation}
										saveLocation={saveMapLocation}
										setSaveLocation={setSaveMapLocation}
										handleToggleMap={handleToggleMap}
									/>
								</GoogleMapContainer>
							)}
						<OButton
							text={t('SAVE', 'Save')}
							textStyle={{ color: theme.colors.white }}
							imgRightSrc={null}
							style={{ marginHorizontal: 30, marginBottom: 10 }}
							onClick={() => setSaveMapLocation(true)}
						/>
					</OModal> */}
						<Spinner visible={saveMapLocation} />
					</AddressFormContainer>
					<View style={{ paddingHorizontal: 40, marginBottom: 14 }}>
						{Object.keys(formState?.changes).length > 0 ? (
							<OButton
								text={
									!formState.loading ? (
										isEditing || (!auth && orderState.options?.address?.address)
											? t('UPDATE', 'Update')
											: t('CONTINUE', 'Continue')
									) : t('LOADING', 'Loading')
								}
								imgRightSrc=''
								onClick={handleSubmit(onSubmit)}
								textStyle={{ ...theme.labels.middle, color: theme.colors.white } as TextStyle}
								isDisabled={formState.loading}
								style={{ height: 40, shadowOpacity: 0 }}
							/>
						) : (
							<OButton
								text={t('CANCEL', 'Cancel')}
								borderColor={theme.colors.backgroundGray300}
								bgColor={theme.colors.backgroundGray300}
								style={{ height: 40, shadowOpacity: 0, borderWidth: 1 }}
								imgRightSrc={null}
								textStyle={theme.labels.middle as TextStyle}
								onClick={() => navigation?.canGoBack() && navigation.goBack()}
							/>
						)}
					</View>
				</>
			</TouchableWithoutFeedback>
		</>
	)
}

export const AddressForm = (props: AddressFormParams) => {
	const addressFormProps = {
		...props,
		UIComponent: AddressFormUI
	}
	return <AddressFormController {...addressFormProps} />
}
