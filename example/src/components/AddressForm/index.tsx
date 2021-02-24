import React, { useEffect, useState, useRef } from 'react'
import { AddressForm as AddressFormController, useLanguage, useConfig, useSession, } from 'ordering-components/native'
import {StyleSheet} from 'react-native'
import { OInput, OTextarea, OText, OButton, OIcon } from '../shared'
import NavBar from '../NavBar'
import { colors } from '../../theme'
import { ToastType, useToast } from '../../providers/ToastProvider';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import {AddressFormContainer,IconsContainer} from './styles'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export const AddressFormUI = (props) => {
	const { navigation, route, updateChanges, formState, isEditing, handleChangeInput, addressState, addressesList, saveAddress, userCustomerSetup } = props
	const { previousComponent, address, nopadding } = route?.params

	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const { showToast } = useToast()
	const [configState] = useConfig()

	const [data, setData] = useState({ data: {}, details: {} })
	const [location, setLocation] = useState({ lat: null, lng: null })
	const [alertState, setAlertState] = useState({ open: false, content: {} })
	const [locationChange, setLocationChange] = useState(
		isEditing
			? addressState?.address?.location
			: formState.changes?.location ?? null
	)
  const [addressTag, setAddressTag] = useState(addressState?.address?.tag)

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
			setLocationChange(null)
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
			? addressesList.filter((address: any) => address.id !== addressState.address?.id) || []
			: addressesList || []
		const addressToCompare = isEditing
			? { ...addressState.address, ...formState.changes }
			: formState?.changes

		const isAddressAlreadyExist = arrayList.map((address: any) => checkAddress(address, addressToCompare)).some((value: any) => value) ?? false

		if (!isAddressAlreadyExist) {
			saveAddress({}, userCustomerSetup)
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
		return values.every(value => value)
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
	const onNavigationRedirect = (page: string) => {
		navigation.navigate(page)
	}

	const goToBack = () => onNavigationRedirect(previousComponent)

	useEffect(() => {
		if (alertState.open) {
			alertState.content && showToast(
				ToastType.Error,
				alertState.content
			)
		}
	}, [alertState.content])

	return (
		<AddressFormContainer>
			<NavBar
				title={t('ADDRESS_FORM', 'Address Form')}
				titleAlign={'center'}
				onActionLeft={goToBack}
				showCall={false}
				btnStyle={{ paddingLeft: 0 }}
			/>

			<GooglePlacesAutocomplete
				placeholder={t('ADD_ADDRESS', 'Add a address')}
				onPress={(data, details = null) => {
					const { lat, lng }: any = details?.geometry?.location
					setLocation({ lat, lng })
					handleChangeAddress(data, details)
					setData({ data, details })
				}}
				query={{ key: googleMapsApiKey }}
				fetchDetails
				ref={googleInput}
				textInputProps={{
					onChangeText: (text) => {
						handleChangeInput({ target: { name: 'address', value: text } })
					}
				}}
				styles={{
					listView: {
						position: "absolute",
						marginTop: 44,
						borderBottomEndRadius: 15,
						elevation: 2,
					},
				}}
			/>
			<OInput name='internal_number' placeholder={t('INTERNAL_NUMBER', 'Internal number')} onChange={handleChangeInput} />
			<OInput name='zip_code' placeholder={t('ZIP_CODE', 'Zip code')} onChange={handleChangeInput} />
			<OInput name='address_notes' placeholder={t('ADDRESS_NOTES', 'Address notes')} onChange={handleChangeInput} />
			<OButton
				text={
					!formState.loading ? (
						isEditing
							? t('UPDATE', 'Update')
							: t('ADD', 'Add')
					) : t('LOADING', 'Loading')
				}
				imgRightSrc=''
				onClick={() => onSubmit()}
			/>
			<IconsContainer>
				<MaterialIcon name='home' size={64} style={{...styles.icons, backgroundColor: addressTag === 'home' ? colors.primary : colors.backgroundGray}} onPress={() => handleAddressTag('home')} />
				<MaterialIcon name='office-building' size={64} style={{...styles.icons, backgroundColor: addressTag === 'office' ? colors.primary : colors.backgroundGray}} onPress={() => handleAddressTag('office')}/>
				<MaterialIcon name='heart' size={64} style={{...styles.icons, backgroundColor: addressTag === 'favorite' ? colors.primary : colors.backgroundGray}} onPress={() => handleAddressTag('favorite')}/>
				<MaterialIcon name='plus' size={64} style={{...styles.icons, backgroundColor: addressTag === 'other' ? colors.primary : colors.backgroundGray}} onPress={() => handleAddressTag('other')}/>
			</IconsContainer>
		</AddressFormContainer>
	)
}

const styles = StyleSheet.create({
	icons: { 
		borderRadius: 20,
		color: colors.white
	}
})

export const AddressForm = (props) => {
	const addressFormProps = {
		...props,
		UIComponent: AddressFormUI
	}
	return <AddressFormController {...addressFormProps} />
}
