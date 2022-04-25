import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { PlaceSpot as PlaceSpotController, useLanguage } from 'ordering-components/native'
import { PlaceGroupContainer, PlaceSpotContainer } from './styles'
import { NotFoundSource } from '../NotFoundSource'
import { OText, ODropDown } from '../shared'
import { Placeholder, PlaceholderLine } from 'rn-placeholder'
import { PlaceSpotParams } from '../../types'

const PlaceSpotUI = (props: PlaceSpotParams) => {
  const {
    isOpenPlaceSpot,
    cart,
    placesState,
    handleChangePlace,
    getPlacesList,
    setOpenPlaceModal
  } = props

  const [, t] = useLanguage()
  const [placeGroupSelected, setPlaceGroupSelected] = useState<any>(null)

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
    setOpenPlaceModal(false)
    handleChangePlace(place)
  }


  useEffect(() => {
    if (!placesState?.loading) {
      const placeGroupOnCart = placesState?.placeGroups.find((group: any) => group?.id === cart?.place?.place_group_id)
      setPlaceGroupSelected(placeGroupOnCart)
    }
  }, [placesState])

  useEffect(() => {
    getPlacesList()
  }, [isOpenPlaceSpot])

  return (
    <PlaceSpotContainer>
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
                defaultValue={placesState?.places?.find((place : any) => place?.id === cart?.place_id)}
                isModal
              />
            </View>
          )}
        </>
      )}
    </PlaceSpotContainer>
  )
}

export const PlaceSpot = (props: PlaceSpotParams) => {
  const placeSpotProps = {
    ...props,
    UIComponent: PlaceSpotUI
  }

  return <PlaceSpotController {...placeSpotProps} />
}
