import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  useLanguage,
  useConfig,
  useUtils,
  useOrder,
  MomentOption as MomentOptionController
} from 'ordering-components/native'
import { StyleSheet, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import { MomentOptionParams } from '../../types'
import { OText, OButton } from '../shared'
import { useTheme } from 'styled-components/native'
import {
  Container,
  HeaderTitle,
  ButtonGroup,
  Days,
  Day,
  WrapHours,
  Hours,
  Hour,
  WrapDelveryTime
} from './styles'

const MomentOptionUI = (props: MomentOptionParams) => {
  const {
    nopadding,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    handleAsap,
    handleChangeDate,
    handleChangeTime
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parseTime }] = useUtils()
  const [orderState] = useOrder()
  const [optionSelected, setOptionSelected] = useState({ isAsap: false, isSchedule: false })
  const [momentState, setMomentState] = useState({ isLoading: 0, isEditing: false })

  const _handleAsap = () => {
    setMomentState({ isLoading: 1, isEditing: true })
    handleAsap()
    setOptionSelected({ isAsap: true, isSchedule: false })
    if (!orderState.options?.moment) {
      setMomentState({ isLoading: 2, isEditing: false })
    }
  }

  const handleChangeMoment = (time : any) => {
    setMomentState({ isLoading: 1, isEditing: true })
    handleChangeTime(time)
  }

  const momento = moment(`${dateSelected} ${timeSelected}`, 'YYYY-MM-DD HH:mm').toDate()
  const momentUnix = momento.getTime() / 1000
  const momentFormat = moment.unix(momentUnix).utc().format('YYYY-MM-DD HH:mm:ss')

  useEffect(() => {
    if (orderState.options?.moment) {
      setOptionSelected({ isAsap: false, isSchedule: true })
    } else {
      setOptionSelected({ isAsap: true, isSchedule: false })
    }

    if (momentState.isEditing && (momentFormat === orderState.options?.moment || timeSelected === null)) {
      setMomentState({ isLoading: 2, isEditing: false })
    }
  }, [orderState.options?.moment])

  return (
    <Container nopadding={nopadding}>
      <View>
        <ButtonGroup>
          <OButton
            text={t('ASAP_ABBREVIATION', 'ASAP')}
            bgColor={optionSelected.isAsap ? theme.colors.primary : theme.colors.gray}
            borderColor={optionSelected.isAsap ? theme.colors.primary : theme.colors.gray}
            textStyle={{ color: optionSelected.isAsap ? theme.colors.white : theme.colors.primary, fontSize: 14 }}
            style={{ height: 42 }}
            imgRightSrc={null}
            isLoading={orderState.loading}
            onClick={() => _handleAsap()}
          />
          <OButton
            text={t('SCHEDULE_FOR_LATER', 'Schedule for later')}
            bgColor={optionSelected.isSchedule ? theme.colors.primary : theme.colors.gray}
            borderColor={optionSelected.isSchedule ? theme.colors.primary : theme.colors.gray}
            textStyle={{ color: optionSelected.isSchedule ? theme.colors.white : theme.colors.primary, fontSize: 14 }}
            imgRightSrc={null}
            style={{ marginHorizontal: 10, height: 42 }}
            isLoading={orderState.loading}
            onClick={() => setOptionSelected({ isAsap: false, isSchedule: true })}
          />
        </ButtonGroup>

        {optionSelected.isSchedule && (
          <WrapDelveryTime>
            {datesList.length > 0 && (
              <>
                <OText color={theme.colors.textSecondary} style={{ textAlign: 'left' }}>{t('DELIVERY_DATE', 'Delivery Date')}</OText>
                <Days>
                  {
                    datesList.slice(0, 6).map((date: any, i: any) => {
                      const dateParts = date.split('-')
                      const _date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                      const dayName = t('DAY' + (_date.getDay() >= 1 ? _date.getDay() : 7)).substring(0, 3).toUpperCase()
                      const dayNumber = (_date.getDate() < 10 ? '0' : '') + _date.getDate()
                      return (
                        <Day
                          key={dayNumber}
                          borderLeftShow={i === 0 || i === 4}
                          onPress={() => handleChangeDate(date)}
                        >
                          <OText
                            style={styles.dayNameStyle}
                            color={(dateSelected === date && optionSelected.isSchedule) ? theme.colors.primary : theme.colors.textSecondary}
                          >{dayName}</OText>
                          <OText
                            size={28}
                            color={(dateSelected === date && optionSelected.isSchedule) ? theme.colors.primary : theme.colors.textSecondary}
                          >{dayNumber}</OText>
                        </Day>
                      )
                    })
                  }
                </Days>
              </>
            )}

            {hoursList.length > 0 && optionSelected.isSchedule && (
              <>
                <OText color={theme.colors.textSecondary} style={{ textAlign: 'left' }}>{t('DELIVERY_TIME', 'Delivery Time')}</OText>
                <WrapHours nestedScrollEnabled={true}>
                  <Hours name='hours'>
                    {
                      hoursList.map((hour: any, i: any) => (
                        <Hour
                          key={i}
                          onPress={() => handleChangeMoment(hour.startTime)}
                          disabled={orderState.loading}
                        >
                          <OText color={timeSelected === hour.startTime ? theme.colors.primary : theme.colors.textSecondary}>
                            {configs?.format_time?.value === '12' ? (
                              hour.startTime.includes('12')
                                ? `${hour.startTime}PM`
                                : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
                            ) : (
                              parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
                            )}
                          </OText>
                        </Hour>
                      ))
                    }
                  </Hours>
                </WrapHours>
              </>
            )}
          </WrapDelveryTime>
        )}
      </View>
      <Spinner visible={momentState.isLoading === 1} />
    </Container>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 10
  },
  dayNameStyle: {
    textTransform: 'uppercase'
  },
  selectStyle: {
    zIndex: 10
  }
})

export const MomentOption = (props: any) => {
  const [{ configs }] = useConfig()
  const limitDays = configs?.max_days_preorder?.value
  const currentDate = new Date()
  const time = limitDays > 1
  ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
  : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)

  currentDate.setTime(time)
  currentDate.setHours(23)
  currentDate.setMinutes(59)
  const momentOptionProps = {
    ...props,
    maxDate: currentDate,
    UIComponent: MomentOptionUI
  }
  return <MomentOptionController {...momentOptionProps} />
}
