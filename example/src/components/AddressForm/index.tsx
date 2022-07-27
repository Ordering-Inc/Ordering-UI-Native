import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native'
import { AddressForm as AddressFormController, useLanguage, useConfig, useSession, useOrder, useValidationFields, ToastType, useToast } from 'ordering-components/native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import Geocoder from 'react-native-geocoding';
import { useTheme } from 'styled-components/native';

import { _retrieveStoreData } from '../../providers/StoreUtil';
import { OInput, OButton, OText, OModal } from '../shared'
import { AddressFormParams } from '../../types'
import { getTraduction } from '../../utils'
import { GoogleMap } from '../GoogleMap'
import NavBar from '../NavBar'
import Geolocation from '@react-native-community/geolocation';

import {
  PERMISSIONS,
  PermissionStatus,
  request,
  openSettings,
} from 'react-native-permissions';

import {
  AddressFormContainer,
  AutocompleteInput,
  IconsContainer,
  GoogleMapContainer,
  FormInput
} from './styles'

const inputNames = [
  { name: 'address', code: 'Address' },
  { name: 'internal_number', code: 'Internal number' },
  { name: 'zipcode', code: 'Zipcode' },
  { name: 'address_notes', code: 'Address notes' }
]
const tagsName = [
  { icon: 'home', value: 'home' },
  { icon: 'office-building', value: 'office' },
  { icon: 'heart', value: 'favorite' },
  { icon: 'plus', value: 'other' }
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
    afterSignup,
    isFromCheckout,
    businessId,
    productId,
    categoryId,
    store
  } = props

  const theme = useTheme();

  const styles = StyleSheet.create({
    iconContainer: {
      display: 'flex',
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
      borderColor: theme.colors.secundaryContrast,
      borderRadius: 10,
      marginBottom: 20,
      height: 50,
      maxHeight: 50,
      minHeight: 50
    },
    textAreaStyles: {
      borderColor: theme.colors.secundaryContrast,
      borderRadius: 10,
      marginBottom: 20,
      height: 90,
      maxHeight: 90,
      textAlignVertical: 'top',
      alignItems: 'flex-start'
    },
  })

  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [, {showToast}] = useToast()
  const [configState] = useConfig()
  const [orderState] = useOrder()
  const { handleSubmit, errors, control, setValue } = useForm()
  const [validationFields] = useValidationFields()
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
  const [isLoadingLocation, setLoadingLocation] = useState(false)
  const [saveMapLocation, setSaveMapLocation] = useState(false)
  const [isKeyboardShow, setIsKeyboardShow] = useState(false)

  const googleInput: any = useRef(null)
  const internalNumberRef: any = useRef(null)
  const zipCodeRef: any = useRef(null)
  const addressNotesRef: any = useRef(null)

  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value
  const isLocationRequired = configState.configs?.google_autocomplete_selection_required?.value === '1' ||
    configState.configs?.google_autocomplete_selection_required?.value === 'true'
  const maxLimitLocation = configState?.configs?.meters_to_change_address?.value

  const isGuestUser = props.isGuestUser || props.isGuestFromStore;
  const isCountryAutocomplete = configState.configs?.country_autocomplete?.value !== '*'

  const queryCountryAutoComplete = () => {
    if (isCountryAutocomplete) {
      return {
        key: googleMapsApiKey,
        components: `country:${configState.configs?.country_autocomplete?.value}`
      }
    } else {
      return {
        key: googleMapsApiKey,
      }
    }
  }
  const continueAsGuest = () => navigation.navigate('BusinessList', {store, businessId, productId, categoryId})
  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  const requestLocationPermission = async () => {
    let permissionStatus: PermissionStatus;
    setLoadingLocation(true)
    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }

    if (permissionStatus === 'denied') {
      openSettings();
    }
    getOneTimeLocation();
  };


  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition( (position) => {
      getAddressFormatted({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
      })
    },(error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const getAddressFormatted = (address: any) => {
    const data: any = { address: null, error: null }
    const isObjet = typeof address === 'object';
    const filterAddressInfo = [
      { tag: 'street_number', isShort: true },
      { tag: 'route', isShort: true },
      { tag: 'locality', isShort: true },
      { tag: 'administrative_area_level_1', isShort: false },
      { tag: 'country', isShort: false },
    ]
    let addressValue: any = [];
    Geocoder.init(googleMapsApiKey);
    Geocoder.from(address)
      .then((json: any) => {
        if (json.results && json.results?.length > 0) {
          let postalCode = null
          for (const component of json.results?.[0].address_components) {
            const addressType = component.types?.[0]
            if (typeof address === 'object') {
              for (const filterProps of filterAddressInfo)  {
                if(filterProps.tag.includes(addressType)) {
                  addressValue.push(filterProps.isShort ? component.short_name : component.long_name)
                }
              }
            }
            if ( addressType === 'postal_code') {
              postalCode = component.short_name
              if (isObjet) {
                setValue('zipcode', postalCode)
                handleChangeInput({ target: { name: 'zipcode', value: postalCode } })
              }
            }
          }
          isObjet ? address = addressValue.join(', ') : address
    
          if (isObjet) {
            setValue('address', address)
            handleChangeInput({ target: { name: 'address', value: address } })
            googleInput?.current?.setAddressText(address)
            setLoadingLocation(false)
            return
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
      .catch((error: any) => {
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
      setLoadingLocation(false)
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
          ? navigation.navigate('Business', {store})
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
      !isFromProductsList ? navigation.navigate('BottomTab') : navigation.navigate('Business', {store})
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
        title={t('ADDRESS_FORM', 'Address Form')}
        titleAlign={'center'}
        onActionLeft={goToBack}
        showCall={false}
        paddingTop={20}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <AddressFormContainer
          style={{ height: 600, overflow: 'scroll' }}
        >
          <View>
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
                      onPress={(data: any, details: any) => {
                        handleChangeAddress(data, details)
                      }}
                      query={
                        queryCountryAutoComplete()
                      }
                      fetchDetails
                      ref={googleInput}
                      textInputProps={{
                        onChangeText: (text: any) => {
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
                      onFail={(error: any) => setAlertState({ open: true, content: getTraduction(error, t) })}
                      styles={{
                        listView: {
                          position: 'relative',
                          borderBottomStartRadius: 15,
                          borderBottomEndRadius: 15,
                          elevation: 2,
                          borderWidth: 1,
                          borderColor: "#ddd",
                          bottom: 20
                        },
                        container: {
                          zIndex: 100
                        },
                        textInput: {
                          borderWidth: 1,
                          borderRadius: 10,
                          flexGrow: 1,
                          fontSize: 15,
                          paddingHorizontal: 20,
                          minHeight: 50,
                          fontFamily: 'Poppins-Regular',
                          marginBottom: !isKeyboardShow && (addressState?.address?.location || formState?.changes?.location) ? 10 : 20
                        }
                      }}
                    />
                  )}
                />
              </AutocompleteInput>

              {!isKeyboardShow && (addressState?.address?.location || formState?.changes?.location) && (
                <TouchableOpacity onPress={handleToggleMap} style={{ marginBottom: 10 }}>
                  <OText
                    color={theme.colors.primary}
                    style={{ textAlign: 'center' }}
                  >
                    {t('VIEW_MAP', 'View map to modify the exact location')}
                  </OText>
                </TouchableOpacity>
              )}
              {!isKeyboardShow && (
                <TouchableOpacity onPress={requestLocationPermission} style={{ marginBottom: 15 }}>
                  <OText
                    color={theme.colors.primary}
                    style={{ textAlign: 'center' }}
                  >
                    {isLoadingLocation ? t('MOBILE_GETTING_CURRENT_LOCATION', 'Getting current location') : t('USE_MY_CURRENT_LOCATION', 'Use my current location')}
                  </OText>
                </TouchableOpacity>
              )}
              {validationFields?.fields?.address['internal_number'].enabled && (
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
                  />
                )}
              />)}
            {validationFields.fields?.address['zipcode'].enabled && (
              <Controller
                control={control}
                name='zipcode'
                rules={{ required: isRequiredField && isRequiredField('zipcode') ? t(`VALIDATION_ERROR_ZIP_CODE_REQUIRED`, `The field Zip Code is required`) : null }}
                defaultValue={address?.zipcode || formState.changes?.zipcode || addressState.address.zipcode || ''}
                render={({ value }) => (
                  <OInput
                    name='zipcode'
                    placeholder={t('ZIP_CODE', 'Zip code')}
                    onChange={(text: string) => {
                      handleChangeInput(text)
                      setValue('zipcode', text)
                    }}
                    value={value || address?.zipcode || formState.changes?.zipcode || addressState.address.zipcode || ''}
                    style={styles.inputsStyle}
                    forwardRef={zipCodeRef}
                    returnKeyType='next'
                    onSubmitEditing={() => addressNotesRef?.current?.focus?.()}
                    blurOnSubmit={false}
                  />
                )}
              />)}
              {validationFields.fields?.address['address_notes'].enabled && (
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
                  />
                )}
              />)}
            </FormInput>
            {!isKeyboardShow && (
              <IconsContainer>
                {tagsName.map(tag => (
                  <TouchableOpacity
                    key={tag.value}
                    onPress={() => handleAddressTag(tag.value)}
                  >
                    <View
                      style={{
                        ...styles.iconContainer,
                        backgroundColor: addressTag === tag.value
                          ? theme.colors.primary
                          : theme.colors.backgroundGray,
                        borderColor: addressTag === tag.value
                          ? theme.colors.primary
                          : theme.colors.backgroundGray
                      }}
                    >
                      <MaterialIcon
                        name={tag.icon}
                        size={40}
                        style={{ ...styles.icons }}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </IconsContainer>
            )}
          </View>

          <View>
            {Object.keys(formState?.changes).length > 0 ? (
              <OButton
                text={
                  !formState.loading ? (
                    isEditing || (!auth && orderState.options?.address?.address)
                      ? t('UPDATE', 'Update')
                      : t('SAVE', 'Save')
                  ) : t('LOADING', 'Loading')
                }
                imgRightSrc=''
                onClick={handleSubmit(onSubmit)}
                textStyle={{ color: theme.colors.white }}
                isDisabled={formState.loading}
              />
            ) : (
              <OButton
                text={t('CANCEL', 'Cancel')}
                style={{ backgroundColor: theme.colors.white }}
                onClick={() => navigation?.canGoBack() && navigation.goBack()}
              />
            )}
          </View>
          <OModal open={toggleMap} onClose={() => handleToggleMap()} entireModal customClose >
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
          </OModal>
          <Spinner visible={saveMapLocation} />
        </AddressFormContainer>
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
