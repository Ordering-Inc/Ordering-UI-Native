import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { PlaceSpot as PlaceSpotController, useLanguage, useOrder, useToast, ToastType } from 'ordering-components/native'
import { PlaceGroupContainer, PlaceSpotContainer } from './styles'
import { NotFoundSource } from '../NotFoundSource'
import { OText, ODropDown, OInput, OButton } from '../shared'
import { Placeholder, PlaceholderLine } from 'rn-placeholder'
import { PlaceSpotParams } from '../../types'
import { useTheme } from 'styled-components/native'
import SelectDropdown from 'react-native-select-dropdown'
import IconAntDesign from 'react-native-vector-icons/AntDesign'

const PlaceSpotUI = (props: PlaceSpotParams) => {
  const {
    cart,
    orderTypes,
    placesState,
    handleChangePlace,
    spotNumber,
    spotState,
    isCheckout,
    vehicle,
    isInputMode,
    setSpotNumber,
    setVehicle,
    handleChangeSpot,
    setPlaceSpotNumber
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [, { showToast }] = useToast();

  const [placeGroupSelected, setPlaceGroupSelected] = useState<any>(null)
  const vehicleInputAllowed = [4, 5]

  const currentOrderType = isCheckout ? orderState?.options?.type : cart?.delivery_type
  const isEatin = currentOrderType === 3
  const isDriveThru = currentOrderType === 5
  const placeholderText = isEatin
    ? t('EATIN_SPOT_NUMBER', 'Table number')
    : isDriveThru
      ? t('DRIVE_THRU_SPOT_NUMBER', 'Drive thru lane')
      : t('CURBSIDE_SPOT_NUMBER', 'Spot number')

  const styles = StyleSheet.create({
    selectOption: {
      backgroundColor: theme.colors.backgroundGray100,
      borderRadius: 7.6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 50,
      width: '100%'
    },
    optionWrapper: {
      marginBottom: 20
    }
  })

  const vehicleTypeList: any = [
    { key: 'car', text: t('VEHICLE_TYPE_CAR', 'Car') },
    { key: 'truck', text: t('VEHICLE_TYPE_TRUCK', 'Truck') },
    { key: 'suv', text: t('VEHICLE_TYPE_SUV', 'SUV') },
    { key: 'van', text: t('VEHICLE_TYPE_VAN', 'Van') },
    { key: 'motorcycle', text: t('VEHICLE_TYPE_MOTORCYCLE', 'Motorcycle') }
  ]

  const vehicleInputList = [
    { key: 'model', text: t('VEHICLE_MODEL', 'Model') },
    { key: 'car_registration', text: t('VEHICLE_CAR_REGISTRATION', 'Car registration') },
    { key: 'color', text: t('VEHICLE_COLOR', 'Color') }
  ]

  const getPlacesGroups = () => {
    const groups = placesState.placeGroups?.filter((group: any) => group?.enabled && placesState?.places?.find((place: any) => place?.enabled && place?.place_group_id === group?.id))
    return groups.map((group: any) => ({
      value: group,
      content: group?.name,
      showOnSelected: group?.name
    }))
  }

  const getPlaces = () => {
    const places = placeGroupSelected && placesState?.places?.filter((place: any) => place?.enabled && place?.place_group_id === placeGroupSelected?.id)
    return places.map((place: any) => ({
      value: place,
      content: place.name,
      showOnSelected: place.name
    }))
  }

  const handlerChangePlace = (place: any) => {
    handleChangePlace(place)
  }

  const onChangeSpot = () => {
    if (orderState.loading) return
    if (!Number.isInteger(Number(spotNumber))) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_INTEGER', 'The _attribute_ must be an integer.').replace('_attribute_', placeholderText))
      return
    }
    if (Number(spotNumber) < 0) {
      showToast(ToastType.Error, t('VALIDATION_MUST_BIGGER_ZERO', '_attribute_ must be bigger than zero').replace('_attribute_', placeholderText))
      return
    }
    const isVehicle = Object.values(vehicle).every(e => e)
    const bodyToSend: any = {}
    spotNumber && (bodyToSend.spot_number = spotNumber)
    isVehicle && (bodyToSend.vehicle = vehicle)

    if (Object.keys(bodyToSend).length) {
      handleChangeSpot({ bodyToSend, isCheckout: !!isCheckout })
    }
  }

  const manageErrorsToShow = (array = []) => {
    let stringError = ''
    const list = Array.isArray(array) ? array : Object.values(array)
    list.map((item: any, i: number) => {
      stringError += (i + 1) === array.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
    })
    return stringError;
  }

  useEffect(() => {
    if (!placesState?.loading) {
      const placeGroupOnCart = placesState?.placeGroups.find((group: any) => group?.id === cart?.place?.place_group_id)
      setPlaceGroupSelected(placeGroupOnCart)
    }
  }, [placesState])

  useEffect(() => {
    if (spotState?.error?.length > 0) {
      const errorText = manageErrorsToShow(spotState?.error)
      showToast(ToastType.Error, errorText)
    }
  }, [spotState?.error])

  const onChangePlaceSpot = (value: string) => {
    setSpotNumber(value)
    setPlaceSpotNumber(value)
  }

  return (
    <PlaceSpotContainer>
      {isInputMode ? (
        <PlaceGroupContainer>
          <OText color={theme.colors.textNormal} size={16} weight='500' mBottom={15}>{orderTypes[currentOrderType]}</OText>
          {vehicleInputAllowed.includes(currentOrderType) && (
            <>
              <View style={styles.optionWrapper}>
                <OText color={theme.colors.textNormal} size={12} mBottom={5}>{t('VEHICLE_TYPE', 'Vehicle type')}</OText>
                <SelectDropdown
                  defaultButtonText={t('SELECT_AN_OPTION', 'Select an option')}
                  data={vehicleTypeList}
                  defaultValue={vehicle?.type ? vehicleTypeList.find((obj: any) => obj.key === vehicle.type) : null}
                  onSelect={(selectedItem, index) => {
                    setVehicle({ ...vehicle, type: selectedItem.key ?? '' })
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.text
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.text
                  }}
                  buttonStyle={styles.selectOption}
                  buttonTextStyle={{
                    color: theme.colors.disabled,
                    fontSize: 14,
                    textAlign: 'left',
                    marginHorizontal: 0
                  }}
                  dropdownStyle={{
                    borderRadius: 8,
                    borderColor: theme.colors.lightGray
                  }}
                  rowStyle={{
                    borderBottomColor: theme.colors.backgroundGray100,
                    backgroundColor: theme.colors.backgroundGray100,
                    height: 40,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingTop: 8,
                    paddingHorizontal: 14
                  }}
                  rowTextStyle={{
                    color: theme.colors.disabled,
                    fontSize: 14,
                    marginHorizontal: 0
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <IconAntDesign
                        name='down'
                        color={theme.colors.textThird}
                        size={16}
                      />
                    )
                  }}
                />
              </View>
              {vehicleInputList.map((input: any) => (
                <View key={input.key}>
                  <OText color={theme.colors.textNormal} size={12} mBottom={5}>{input.text}</OText>
                  <OInput
                    placeholder={input.text}
                    value={vehicle[input.key] ?? ''}
                    onChange={(value: string) => setVehicle({ ...vehicle, [input.key]: value })}
                    style={{
                      borderColor: theme.colors.border,
                      borderRadius: 7.6,
                      marginBottom: 20
                    }}
                    inputStyle={{ fontSize: 12, color: theme.colors.textNormal }}
                  />
                </View>
              ))}
            </>
          )}
          <OText color={theme.colors.textNormal} size={12} mBottom={5}>{placeholderText}</OText>
          <OInput
            value={spotNumber?.toString() ?? ''}
            placeholder={placeholderText}
            type='number-pad'
            onChange={(value: string) => onChangePlaceSpot(value)}
            style={{
              borderColor: theme.colors.border,
              borderRadius: 7.6
            }}
            inputStyle={{ fontSize: 12, color: theme.colors.textNormal }}
          />
          <View style={{ alignItems: 'flex-start' }}>
            <OButton
              onClick={() => onChangeSpot()}
              textStyle={{ fontSize: 12 }}
              imgRightSrc={null}
              text={t('UPDATE_SPOT_NUMBER', 'Update')}
              isDisabled={(!spotNumber && !Object.values(vehicle).every(e => e))}
              style={{ borderRadius: 7.6, height: 44, shadowOpacity: 0, marginTop: 20 }}
            />
          </View>
        </PlaceGroupContainer>
      ) : (
        <>
          {(placesState.error || placesState?.placeGroups?.length === 0) && !placesState?.loading && (
            <NotFoundSource
              content={t('NO_PLACES_THIS_BUSINESS', 'There are not places for this business')}
            />
          )}
          {placesState?.loading && (
            <Placeholder>
              <PlaceGroupContainer>
                <PlaceholderLine width={100} height={25} />
                <PlaceholderLine height={30} />
              </PlaceGroupContainer>
              <View>
                <PlaceholderLine width={120} height={25} />
                <PlaceholderLine height={30} />
              </View>
            </Placeholder>
          )}
          {!(placesState.error || placesState?.placeGroups?.length === 0) && !placesState?.loading && (
            <>
              <PlaceGroupContainer>
                <OText size={16} mBottom={10}>{t('PLACE_GROUP', 'Place group')}</OText>
                <ODropDown
                  placeholder={t('PLACE_GROUP', 'Place group')}
                  options={getPlacesGroups()}
                  onSelect={(group: any) => setPlaceGroupSelected(group)}
                  defaultValue={placeGroupSelected ?? cart?.place}
                  isModal
                />
              </PlaceGroupContainer>
              {placeGroupSelected && (
                <View>
                  <OText size={16} mBottom={10}>{t('SELECT_YOUR_SPOT', 'Select your spot')}</OText>
                  <ODropDown
                    onSelect={(place: any) => handlerChangePlace(place)}
                    placeholder={t('SELECT_YOUR_SPOT', 'Select your spot')}
                    options={getPlaces()}
                    defaultValue={placesState?.places?.find((place: any) => place?.id === cart?.place_id)}
                    isModal
                  />
                </View>
              )}
            </>
          )}
        </>
      )}
    </PlaceSpotContainer>
  )
}

export const PlaceSpot = (props: PlaceSpotParams) => {
  const [, t] = useLanguage()

  const placeSpotProps = {
    ...props,
    UIComponent: PlaceSpotUI,
    orderTypes: {
      1: t('DELIVERY', 'Delivery'),
      2: t('PICKUP', 'Pickup'),
      3: t('EAT_IN', 'Eat in'),
      4: t('CURBSIDE', 'Curbside'),
      5: t('DRIVE_THRU', 'Drive thru')
    }
  }

  return <PlaceSpotController {...placeSpotProps} />
}
