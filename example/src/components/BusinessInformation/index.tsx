import React from 'react'
import {
  BusinessInformation as BusinessInformationController,
  useLanguage,
  useConfig
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
import { useTheme } from 'styled-components/native';
import moment from 'moment';

const BusinessInformationUI = (props: BusinessInformationParams) => {
  const {
    businessState,
    businessSchedule,
    businessLocation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
	const [{ configs }] = useConfig();

  const daysOfWeek = [
    t('SUNDAY_ABBREVIATION', 'Sun'),
    t('MONDAY_ABBREVIATION', 'Mon'),
    t('TUESDAY_ABBREVIATION', 'Tues'),
    t('WEDNESDAY_ABBREVIATION', 'Wed'),
    t('THURSDAY_ABBREVIATION', 'Thur'),
    t('FRIDAY_ABBREVIATION', 'Fri'),
    t('SATURDAY_ABBREVIATION', 'Sat')
  ]

  const formatTime = configs?.general_hour_format?.value

	const checkTime = (val: number) => (val < 10 ? `0${val}` : val);
	const timeFormated = (time: any) => {
		return moment(`1900-01-01 ${checkTime(time.hour)}:${checkTime(time.minute)}`).format(formatTime)
	}

  return (
    <BusinessInformationContainer>
      <BusinessBasicInformation
        isBusinessInfoShow
        businessState={businessState}
      />
      <WrapMainContent>
        <InnerContent>
          {(!!businessState?.business?.description) && (
            <>
              <GrayBackground>
                <OText size={16} weight='bold'>{t('BUSINESS_DESCRIPTION', 'Business description')}</OText>
              </GrayBackground>
              <OText size={14} mBottom={20} mLeft={15} mRight={15} style={{ marginTop: 10 }}>{businessState?.business?.description}</OText>
            </>
          )}
          {(!!businessState?.business?.email || !!businessState?.business?.cellphone) && (
            <>
              <GrayBackground>
                <OText size={16} weight='bold'>{t('BUSINESS_DETAILS', 'Business Details')}</OText>
              </GrayBackground>
              {!!businessState?.business?.email && (
                <OText size={14} mBottom={5} mLeft={15} style={{ marginTop: 10 }}>{t('EMAIL', 'Email')}: <OText color={theme.colors.textSecondary}>{businessState?.business?.email}</OText></OText>
              )}
              {!!businessState?.business?.cellphone && (
                <OText size={14} mBottom={20} mLeft={15}>{t('CELLPHONE', 'Cellphone')}: <OText color={theme.colors.textSecondary}>{businessState?.business?.cellphone}</OText></OText>
              )}
            </>
          )}

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
                  {schedule.enabled ? (
                    schedule.lapses.map( (time: any, k: number) => (
                    <React.Fragment key={k}>
                      <OText>{timeFormated(time.open)}</OText>
                      <OText mBottom={10} style={{
                        padding: 3,
                        borderBottomColor: theme.colors.primary,
                        borderBottomWidth: 1
                      }}
                      >{timeFormated(time.close)}</OText>
                    </React.Fragment>
                  ))) : ( <OText>{t('CLOSED', 'Closed')}</OText>)}
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
