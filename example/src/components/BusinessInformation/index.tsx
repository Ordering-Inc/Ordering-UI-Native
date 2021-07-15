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
  WrapBusinessMap,
  InnerContent
} from './styles'
import { StyleSheet } from 'react-native'
import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { BusinessInformationParams } from '../../types'
import { GoogleMap } from '../GoogleMap'
const BusinessInformationUI = (props: BusinessInformationParams) => {
  const {
    businessState,
    businessSchedule,
    businessLocation
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
  const scheduleFormatted = ({ hour, minute } : {hour : number | string, minute : number | string}) => {
    const checkTime = (val : number | string) => val < 10 ? `0${val}` : val
    return `${checkTime(hour)}:${checkTime(minute)}`
  }

  return (
    <BusinessInformationContainer>
      <BusinessBasicInformation
        isBusinessInfoShow
        businessState={businessState}
      />
      <WrapMainContent>
        <InnerContent>
          <GrayBackground>
            <OText size={16} weight='bold'>{t('BUSINESS_LOCATION', 'Business Location')}</OText>
          </GrayBackground>
          {businessLocation.location && (
            <WrapBusinessMap style={styles.wrapMapStyle}>
              <GoogleMap
                readOnly
                location={businessLocation.location}
                markerTitle={businessState?.business?.name}
              />
            </WrapBusinessMap>
          )}
          <OText mBottom={20}>
            {businessState?.business?.address}
          </OText>
          <GrayBackground>
            <OText size={16} weight='bold'>
              {t('BUSINESS_OPENING_TIME', 'Business Opening Time')}
            </OText>
          </GrayBackground>
          {businessSchedule && businessSchedule?.length > 0 && (
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
        </InnerContent>
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

export const BusinessInformation = (props : BusinessInformationParams) => {
  const BusinessInformationProps = {
    ...props,
    UIComponent: BusinessInformationUI
  }
  return <BusinessInformationController {...BusinessInformationProps} />
}
