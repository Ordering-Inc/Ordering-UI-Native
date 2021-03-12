import React from 'react'
import {
  BusinessInformation as BusinessInformationController,
  useLanguage
} from 'ordering-components/native'
import { OText } from '../shared'
import {
  BusinessInformationContainer,
  WrapMainContent,
  GrayBackground,
  WrapScheduleBlock,
  ScheduleBlock,
  WrapBusinessMap
} from './styles'
import { StyleSheet } from 'react-native'
import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { BusinessInformationParams } from '../../types'
import OrderMap from '../OrderMap'
const BusinessInformationUI = (props: BusinessInformationParams) => {
  const {
    businessState,
    businessSchedule
  } = props
  const [, t] = useLanguage()
  const daysOfWeek = [
    t('SUNDAY_ABBREVIATION', 'Sun'),
    t('MONDAY_ABBREVIATION', 'Mon'),
    t('TUESDAY_ABBREVIATION', 'Tues'),
    t('WEDNESDAY_ABBREVIATION', 'Wed'),
    t('THURSDAY_ABBREVIATION', 'Thur'),
    t('FRIDAY_ABBREVIATION', 'Fri'),
    t('SATURDAY_ABBREVIATION', 'Sat')
  ]
  const scheduleFormatted = ({ hour, minute }) => {
    const checkTime = (val) => val < 10 ? `0${val}` : val
    return `${checkTime(hour)}:${checkTime(minute)}`
  }
  const businessCoordinate = {
    latitude: businessState?.business?.location?.lat,
    longitude: businessState?.business?.location?.lng
  }
  const businessImage = {
    uri: businessState?.business?.logo
  }
  const businessMarker = {
    latlng: businessCoordinate,
    image: businessImage
  }

  return (
    <BusinessInformationContainer>
      <BusinessBasicInformation
        isBusinessInfoShow
        businessState={businessState}
      />
      <WrapMainContent>
        <GrayBackground>
          <OText size={16} weight='bold'>{t('BUSINESS_LOCATION', 'Business Location')}</OText>
        </GrayBackground>
        <WrapBusinessMap style={styles.wrapMapStyle}>
          <OrderMap
            markers={[businessMarker]}
          />
        </WrapBusinessMap>
        <OText mBottom={20}>
          {businessState?.business?.address}
        </OText>
        <GrayBackground>
          <OText size={16} weight='bold'>
            {t('BUSINESS_OPENING_TIME', 'Business Opening Time')}
          </OText>
        </GrayBackground>
        {businessSchedule?.length > 0 && (
          <WrapScheduleBlock horizontal>
            {businessSchedule.map((schedule: any, i: number) => (
              <ScheduleBlock key={i}>
                <OText size={20}>{daysOfWeek[i]}</OText>
                <OText>{scheduleFormatted(schedule.lapses[0].open)}</OText>
                <OText>{scheduleFormatted(schedule.lapses[0].close)}</OText>
              </ScheduleBlock>
            ))}
          </WrapScheduleBlock>
        )}
      </WrapMainContent>
    </BusinessInformationContainer>
  )
}

const styles = StyleSheet.create({
  wrapMapStyle: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 10
  }
})

export const BusinessInformation = (props) => {
  const googleMapsControls = {
    defaultZoom: 15,
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    mapTypeId: 'roadmap', // 'roadmap', 'satellite', 'hybrid', 'terrain'
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite']
    }
  }

  const BusinessInformationProps = {
    ...props,
    UIComponent: BusinessInformationUI,
    googleMapsControls
  }
  return <BusinessInformationController {...BusinessInformationProps} />
}
