import React, { useEffect, useState, useRef } from 'react'
import { AddressForm as AddressFormController, useLanguage, useConfig, useSession, useOrder } from 'ordering-components/native'
import { StyleSheet, View, TouchableOpacity, Keyboard } from 'react-native'
import { OInput, OButton, OText, OModal } from '../shared'
import { getTraduction } from '../../utils'
import NavBar from '../NavBar'
import { colors } from '../../theme.json'
import { ToastType, useToast } from '../../providers/ToastProvider';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { AddressFormContainer, AutocompleteInput, IconsContainer, GoogleMapContainer, FormInput } from './styles'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useForm, Controller } from 'react-hook-form'
import { AddressFormParams } from '../../types'
import { GoogleMap } from '../GoogleMap'
import Spinner from 'react-native-loading-spinner-overlay'

const inputNames = [{ name: 'address', code: 'Address' }, { name: 'internal_number', code: 'Internal number' }, { name: 'zipcode', code: 'Zipcode' }, { name: 'address_notes', code: 'Address notes' }]
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
    userCustomerSetup,
    isGuestUser,
    isRequiredField,
    isFromProductsList,
    hasAddressDefault
  } = props

  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const { showToast } = useToast()
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

  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value
  const isLocationRequired = configState.configs?.google_autocomplete_selection_required?.value === '1' ||
    configState.configs?.google_autocomplete_selection_required?.value === 'true'
  const maxLimitLocation = configState?.configs?.meters_to_change_address?.value

  const continueAsGuest = () => navigation.navigate('BusinessList')
  const goToBack = () => navigation.goBack()

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
      if (!isGuestUser && !auth) {
        !isFromProductsList ? navigation.navigate('Business') : navigation.goBack()
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
    const addressSelected = {
      address: data?.description || data?.address,
      location: details?.geometry?.location,
      utc_offset: details?.utc_offset || null,
      map_data: { library: 'google', place_id: data.place_id },
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
    if (orderState.loading && !addressesList && orderState.options.address && auth) {
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
        title={t('ADDRESS_FORM', 'Address Form')}
        titleAlign={'center'}
        onActionLeft={goToBack}
        showCall={false}
        paddingTop={20}
      />
      <AddressFormContainer style={{ height: 600, overflow: 'scroll' }}>
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
                      autoCorrect: false
                    }}
                    onFail={(error) => setAlertState({ open: true, content: getTraduction(error) })}
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
                  color={colors.primary}
                  style={{ textAlign: 'center' }}
                >
                  {t('VIEW_MAP', 'View map to modify the exact location')}
                </OText>
              </TouchableOpacity>
            )}

            <Controller
              control={control}
              name='internal_number'
              rules={{ required: isRequiredField && isRequiredField('internal_number') ? t(`VALIDATION_ERROR_INTERNAL_NUMBER_REQUIRED`, `The field internal number is required`) : null }}
              defaultValue={address?.internal_number || formState.changes?.internal_number || addressState.address.internal_number || ''}
              render={() => (
                <OInput
                  name='internal_number'
                  placeholder={t('INTERNAL_NUMBER', 'Internal number')}
                  onChange={(text: string) => {
                    handleChangeInput(text)
                    setValue('internal_number', text)
                  }}
                  value={address?.internal_number || formState.changes?.internal_number || addressState.address.internal_number || ''}
                  style={styles.inputsStyle}
                />
              )}
            />

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
                />
              )}
            />
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
                />
              )}
            />
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
                        ? colors.primary
                        : colors.backgroundGray,
                      borderColor: addressTag === tag.value
                        ? colors.primary
                        : colors.backgroundGray
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
              textStyle={{ color: colors.white }}
              isDisabled={formState.loading}
            />
          ) : (
            <OButton
              text={t('CANCEL', 'Cancel')}
              style={{ backgroundColor: colors.white }}
              onClick={() => navigation.goBack()}
            />
          )}
        </View>
        <OModal open={toggleMap} onClose={() => handleToggleMap()} entireModal customClose >
          {locationChange && (
            <GoogleMapContainer>
              <GoogleMap
                location={locationChange}
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
            textStyle={{ color: colors.white }}
            imgRightSrc={null}
            style={{ marginHorizontal: 30, marginBottom: 10 }}
            onClick={() => setSaveMapLocation(true)}
          />
        </OModal>
        <Spinner visible={saveMapLocation} />
      </AddressFormContainer>
    </>
  )
}

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
    color: colors.white
  },
  inputsStyle: {
    borderColor: colors.secundaryContrast,
    borderRadius: 10,
    marginBottom: 20,
    height: 50,
    maxHeight: 50,
    minHeight: 50
  },
  textAreaStyles: {
    borderColor: colors.secundaryContrast,
    borderRadius: 10,
    marginBottom: 20,
    height: 150,
    maxHeight: 150,
    textAlignVertical: 'top',
    alignItems: 'flex-start'
  },
})

export const AddressForm = (props: AddressFormParams) => {
  const addressFormProps = {
    ...props,
    UIComponent: AddressFormUI
  }
  return <AddressFormController {...addressFormProps} />
}
