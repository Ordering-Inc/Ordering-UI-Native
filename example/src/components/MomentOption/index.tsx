import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  useLanguage,
  useConfig,
  useUtils,
  useOrder,
  MomentOption as MomentOptionController
} from 'ordering-components/native'
import { StyleSheet } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { MomentOptionParams } from '../../types'
import NavBar from '../NavBar'
import { OText } from '../shared'
import { colors } from '../../theme.json'
import {Container} from '../../layouts/Container'
import {
  HeaderTitle,
  WrapSelectOption,
  Days,
  Day,
  WrapHours,
  Hours,
  Hour,
  WrapDelveryTime
} from './styles'

const MomentOptionUI = (props: MomentOptionParams) => {
  const {
    navigation,
    nopadding,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    handleAsap,
    handleChangeDate,
    handleChangeTime
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parseTime }] = useUtils()
  const [orderState] = useOrder()
  const [optionSelected, setOptionSelected] = useState({ isAsap: false, isSchedule: false })

  const goToBack = () => navigation.goBack()
  const _handleAsap = () => {
    handleAsap()
    setOptionSelected({ isAsap: true, isSchedule: false })
    goToBack()
  }

  const handleChangeMoment = (time : any) => {
    handleChangeTime(time)
    goToBack()
  }

  useEffect(() => {
    if (orderState.options?.moment) {
      setOptionSelected({ isAsap: false, isSchedule: true })
    } else {
      setOptionSelected({ isAsap: true, isSchedule: false })
    }
  }, [orderState.options?.moment])

  return (
    <Container nopadding={nopadding}>
      <NavBar
        onActionLeft={() => goToBack()}
        btnStyle={{ paddingLeft: 0 }}
        paddingTop={0}
      />
      <HeaderTitle>
        <OText size={28} weight='bold'>{t('DELIVERY_TIME', 'Delivery time')}</OText>
        <OText color={colors.textSecondary}>{t('SELECT_A_DELIVERY_DATE', 'Select a Delivery Date')}</OText>
      </HeaderTitle>

      <WrapSelectOption
        onPress={() => _handleAsap()}
      >
        {optionSelected.isAsap ? (
          <MaterialIcon
            name='radiobox-marked'
            size={32}
            color={colors.primary}
            style={styles.icon}
          />
        ) : (
          <MaterialIcon
            name='radiobox-blank'
            size={32}
            color={colors.textSecondary}
            style={styles.icon}
          />
        )}
        <OText>{t('ASAP_ABBREVIATION', 'ASAP')}</OText>
      </WrapSelectOption>
      <WrapSelectOption
        onPress={() => setOptionSelected({ isAsap: false, isSchedule: true })}
      >
        {optionSelected.isSchedule ? (
          <MaterialIcon
            name='radiobox-marked'
            size={32}
            color={colors.primary}
            style={styles.icon}
          />
        ) : (
          <MaterialIcon
            name='radiobox-blank'
            size={32}
            color={colors.textSecondary}
            style={styles.icon}
          />
        )}
        <OText>{t('SCHEDULE_FOR_LATER', 'Schedule for later')}</OText>
      </WrapSelectOption>

      <WrapDelveryTime
        pointerEvents={optionSelected.isAsap ? 'none': 'auto'}
      >
        {datesList.length > 0 && (
          <>
            <OText color={colors.textSecondary}>{t('DELIVERY_DATE', 'Delivery Date')}</OText>
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
                        color={(dateSelected === date && optionSelected.isSchedule) ? colors.primary : colors.textSecondary}
                      >{dayName}</OText>
                      <OText
                        size={28}
                        color={(dateSelected === date && optionSelected.isSchedule) ? colors.primary : colors.textSecondary}
                      >{dayNumber}</OText>
                    </Day>
                  )
                })
              }
            </Days>
          </>
        )}

        {hoursList.length > 0 && (
          <>
            <OText color={colors.textSecondary}>{t('DELIVERY_TIME', 'Delivery Time')}</OText>
            {optionSelected.isSchedule && (
              <WrapHours>
                <Hours name='hours'>
                  {
                    hoursList.map((hour: any, i: any) => (
                      <Hour
                        key={i}
                        onPress={() => handleChangeMoment(hour.startTime)}
                      >
                        <OText color={timeSelected === hour.startTime ? colors.primary : colors.textSecondary}>
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
            )}
          </>
        )}
      </WrapDelveryTime>
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
  const momentOptionProps = {
    ...props,
    UIComponent: MomentOptionUI
  }
  return <MomentOptionController {...momentOptionProps} />
}
