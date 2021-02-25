import React, { useEffect, useState, useRef } from 'react'
import { AddressForm as AddressFormController, useLanguage, useConfig, useSession, useOrder } from 'ordering-components/native'
import { StyleSheet, View } from 'react-native'
import { OInput, OButton } from '../shared'
import NavBar from '../NavBar'
import { colors } from '../../theme'
import { ToastType, useToast } from '../../providers/ToastProvider';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { AddressFormContainer, AutocompleteInput, IconsContainer } from './styles'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useForm, Controller } from 'react-hook-form'
import { AddressFormParams } from '../../types'

const inputNames = [{ name: 'address', code: 'Address' }, { name: 'internal_number', code: 'Internal number' }, { name: 'zipcode', code: 'Zipcode' }, { name: 'address_notes', code: 'Address notes' }]

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
		userCustomerSetup,
		isRequiredField,
	} = props

	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const { showToast } = useToast()
	const [configState] = useConfig()
	const [orderState] = useOrder()
	const { handleSubmit, errors, control, setValue } = useForm()

	const [alertState, setAlertState] = useState({ open: false, content: [] })
	const [addressTag, setAddressTag] = useState(addressState?.address?.tag)
	const [firstLocationNoEdit, setFirstLocationNoEdit] = useState({ value: null })
	const [isFirstTime, setIsFirstTime] = useState(true)
	const [locationChange, setLocationChange] = useState(
		isEditing
			? addressState?.address?.location
			: formState.changes?.location ?? null
	)


	const googleInput = useRef(null)

	const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value
	const isLocationRequired = configState.configs?.google_autocomplete_selection_required?.value === '1' ||
		configState.configs?.google_autocomplete_selection_required?.value === 'true'

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
		}

		const arrayList = isEditing
			? addressesList.addresses.filter((address: any) => address.id !== addressState?.address?.id) || []
			: addressesList.addresses || []
		const addressToCompare = isEditing
			? { ...addressState.address, ...formState.changes }
			: formState?.changes

		const isAddressAlreadyExist = arrayList.map((address: any) => checkAddress(address, addressToCompare)).some((value: any) => value) ?? false

		if (!isAddressAlreadyExist) {
			saveAddress({}, userCustomerSetup)
			goToBack()
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
		const addressSelected = {
			address: data?.description,
			location: details?.geometry?.location,
			utc_offset: details?.utc_offset,
			map_data: { library: 'google', place_id: data.place_id }
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

	const goToBack = () => navigation.goBack()

	useEffect(() => {
		if (alertState.open) {
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

	return (
		<AddressFormContainer>
			<NavBar
				title={t('ADDRESS_FORM', 'Address Form')}
				titleAlign={'center'}
				onActionLeft={goToBack}
				showCall={false}
				btnStyle={{ paddingLeft: 0 }}
			/>
			<AutocompleteInput>
				<Controller
					control={control}
					name='address'
					defaultValue={address?.address || formState.changes?.address || addressState.address.address || ''}
					rules={{ required: isRequiredField('address') ? t(`VALIDATION_ERROR_ADDRESS_REQUIRED`, `The field Address is required`) : null }}
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
							}}
							styles={{
								listView: {
									position: "absolute",
									marginTop: 44,
									borderBottomEndRadius: 15,
									elevation: 2,
									zIndex: 1000
								},
								textInput: {
									borderColor: colors.primary,
									borderWidth: 1,
									borderRadius: 20
								},
							}}
						/>
					)}
				/>
			</AutocompleteInput>
			<Controller
				control={control}
				name='internal_number'
				rules={{ required: isRequiredField('internal_number') ? t(`VALIDATION_ERROR_INTERNAL_NUMBER_REQUIRED`, `The field internal number is required`) : null }}
				defaultValue={address?.internal_number || formState.changes?.internal_number || addressState.address.internal_number || ''}
				render={() => (
					<OInput
						name='internal_number'
						placeholder={t('INTERNAL_NUMBER', 'Internal number')}
						onChange={(text: string) => {
							handleChangeInput(text)
							setValue('internal_number', text)
						}
						}
						value={address?.internal_number || formState.changes?.internal_number || addressState.address.internal_number || ''}
						style={styles.inputsStyle}
					/>
				)}
			/>
			<Controller
				control={control}
				name='zipcode'
				rules={{ required: isRequiredField('zipcode') ? t(`VALIDATION_ERROR_ZIP_CODE_REQUIRED`, `The field Zip Code is required`) : null }}
				defaultValue={address?.zipcode || formState.changes?.zipcode || addressState.address.zipcode || ''}
				render={() => (
					<OInput
						name='zipcode'
						placeholder={t('ZIP_CODE', 'Zip code')}
						onChange={(text: string) => {
							handleChangeInput(text)
							setValue('zipcode', text)
						}
						}
						value={address?.zipcode || formState.changes?.zipcode || addressState.address.zipcode || ''}
						style={styles.inputsStyle}
					/>
				)}
			/>
			<Controller
				control={control}
				name='address_notes'
				rules={{ required: isRequiredField('address_notes') ? t(`VALIDATION_ERROR_ADDRESS_NOTES_REQUIRED`, `The field address notes is required`) : null }}
				defaultValue={address?.address_notes || formState.changes?.address_notes || addressState.address.address_notes || ''}
				render={() => (
					<OInput
						name='address_notes'
						placeholder={t('ADDRESS_NOTES', 'Address notes')}
						onChange={(text) => {
							handleChangeInput(text)
							setValue('address_notes', text)
						}
						}
						value={address?.address_notes || formState.changes?.address_notes || addressState.address.address_notes || ''}
						multiline
						style={styles.textAreaStyles}
					/>
				)}
			/>
			<OButton
				text={
					!formState.loading ? (
						isEditing
							? t('UPDATE', 'Update')
							: t('ADD', 'Add')
					) : t('LOADING', 'Loading')
				}
				imgRightSrc=''
				onClick={handleSubmit(onSubmit)}
				textStyle={{ color: colors.white }}
			/>
			<IconsContainer>
				<View style={{ ...styles.iconContainer, backgroundColor: addressTag === 'home' ? colors.primary : colors.backgroundGray, borderColor: addressTag === 'home' ? colors.primary : colors.backgroundGray }}>
					<MaterialIcon name='home' size={58} style={{ ...styles.icons }} onPress={() => handleAddressTag('home')} />
				</View>
				<View style={{ ...styles.iconContainer, backgroundColor: addressTag === 'office' ? colors.primary : colors.backgroundGray, alignItems: 'center', borderColor: addressTag === 'office' ? colors.primary : colors.backgroundGray }}>
					<MaterialIcon name='office-building' size={58} style={{ ...styles.icons }} onPress={() => handleAddressTag('office')} />
				</View>
				<View style={{ ...styles.iconContainer, backgroundColor: addressTag === 'favorite' ? colors.primary : colors.backgroundGray, alignItems: 'center', borderColor: addressTag === 'favorite' ? colors.primary : colors.backgroundGray }}>
					<MaterialIcon name='heart' size={58} style={{ ...styles.icons }} onPress={() => handleAddressTag('favorite')} />
				</View>
				<View style={{ ...styles.iconContainer, backgroundColor: addressTag === 'other' ? colors.primary : colors.backgroundGray, alignItems: 'center', borderColor: addressTag === 'other' ? colors.primary : colors.backgroundGray }}>
					<MaterialIcon name='plus' size={58} style={{ ...styles.icons }} onPress={() => handleAddressTag('other')} />
				</View>
			</IconsContainer>
		</AddressFormContainer>
	)
}

const styles = StyleSheet.create({
	icons: {
		borderRadius: 20,
		color: colors.white
	},
	iconContainer: {
		marginHorizontal: 10,
		borderWidth: 5,
		alignItems: 'center',
		borderRadius: 25
	},
	inputsStyle: {
		borderBottomColor: colors.secundaryContrast,
		borderRadius: 0,
		marginVertical: 20
	},
	textAreaStyles: {
		borderColor: colors.secundaryContrast,
		borderRadius: 0,
		marginVertical: 20,
		height: 150,
		textAlignVertical: 'top'
	}
})

export const AddressForm = (props: AddressFormParams) => {
	const addressFormProps = {
		...props,
		UIComponent: AddressFormUI
	}
	return <AddressFormController {...addressFormProps} />
}
