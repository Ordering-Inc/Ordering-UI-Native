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
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay';
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
  const [momentState, setMomentState] = useState({ isLoading: 0, isEditing: false })

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  const _handleAsap = () => {
    setMomentState({ isLoading: 1, isEditing: true })
    handleAsap()
    setOptionSelected({ isAsap: true, isSchedule: false })
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

  useEffect(() => {
    if (momentState.isLoading === 2 && !orderState?.loading) {
      goToBack()
    }
  }, [momentState.isLoading])

  return (
    <Container nopadding={nopadding}>
      <View style={{ paddingBottom: 10 }}>
        <NavBar
          onActionLeft={() => goToBack()}
          btnStyle={{ paddingLeft: 0 }}
          paddingTop={0}
          style={{ paddingBottom: 0 }}
        />
        <HeaderTitle>
          <OText size={28} weight='bold'>{t('DELIVERY_TIME', 'Delivery time')}</OText>
          <OText color={colors.textSecondary}>{t('SELECT_A_DELIVERY_DATE', 'Select a Delivery Date')}</OText>
        </HeaderTitle>

        <WrapSelectOption
          onPress={() => _handleAsap()}
          disabled={orderState.loading}
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
          disabled={orderState.loading}
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

        {optionSelected.isSchedule && (
          <WrapDelveryTime>
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

            {hoursList.length > 0 && optionSelected.isSchedule && (
              <>
                <OText color={colors.textSecondary}>{t('DELIVERY_TIME', 'Delivery Time')}</OText>
                <WrapHours nestedScrollEnabled={true}>
                  <Hours name='hours'>
                    {
                      hoursList.map((hour: any, i: any) => (
                        <Hour
                          key={i}
                          onPress={() => handleChangeMoment(hour.startTime)}
                          disabled={orderState.loading}
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
  const momentOptionProps = {
    ...props,
    UIComponent: MomentOptionUI
  }
  return <MomentOptionController {...momentOptionProps} />
}
