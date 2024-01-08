import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { useTheme } from 'styled-components/native'
import {
  MomentOption as MomentOptionController,
  useConfig,
  useUtils,
  useLanguage
} from 'ordering-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { Container } from './styles'
import moment from 'moment'

const MomentSelectorUI = (props: any) => {
  const {
		datesList,
		hoursList,
		dateSelected,
		timeSelected,
		handleChangeDate,
		handleChangeTime,
  } = props

  const theme = useTheme()
  const { top } = useSafeAreaInsets()
  const [{ configs }] = useConfig()
  const [{ parseTime }] = useUtils()
	const [, t] = useLanguage()

  const [customizedDateList, setCustomizedDateList] = useState([])
  const [customizedTimeList, setCustomizedTimeList] = useState([])

  const is12hours = configs?.general_hour_format?.value?.includes('hh:mm')

  const styles = StyleSheet.create({
    selectOption: {
      width: '100%',
      backgroundColor: theme.colors.backgroundGray100,
      paddingVertical: 5,
      paddingHorizontal: 14,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 30
    },
    selectWrapper: {
      flex: 1
    }
  })

  useEffect(() => {
    const updatedDatesList = datesList?.map((date: any) => {
      return { value: moment(date).format('MMM DD, YYYY'), key: date }
    })
    setCustomizedDateList(updatedDatesList)
  }, [datesList])

  useEffect(() => {
    if (hoursList?.length > 0) {
      
      const updatedHoursList = hoursList?.map((hour: any) => {
        const timeValue = is12hours ? (
          hour?.startTime?.includes('12')
            ? `${hour.startTime}PM`
            : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
        ) : (
          parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
          )
          return { value: timeValue, key: hour.startTime }
        })
      setCustomizedTimeList(updatedHoursList)
    }
  }, [hoursList])

  const dropDownIcon = () => {
    return (
      <IconAntDesign
        name='down'
        color={theme.colors.textThird}
        size={12}
      />
    )
  }

  return (
    <Container>
      <View style={styles.selectWrapper}>
        <SelectDropdown
          defaultValue={customizedDateList?.find((item: any) => item.key === dateSelected)}
          data={customizedDateList}
          onSelect={(selectedItem, index) => {
            handleChangeDate(selectedItem?.key)
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem?.value
          }}
          rowTextForSelection={(item, index) => {
            return item.value
          }}
          buttonStyle={{borderTopLeftRadius: 7.6, borderBottomLeftRadius: 7.6, ...styles.selectOption}}
          buttonTextStyle={{
            color: theme.colors.disabled,
            fontSize: 12,
            textAlign: 'left',
            marginHorizontal: 0
          }}
          dropdownStyle={{
            borderRadius: 8,
            borderColor: theme.colors.lightGray,
            marginTop: Platform.OS === 'ios' ? 12 : -top
          }}
          rowStyle={{
            borderBottomColor: theme.colors.backgroundGray100,
            backgroundColor: theme.colors.backgroundGray100,
            height: 30,
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingTop: 8,
            paddingHorizontal: 12
          }}
          rowTextStyle={{
            color: theme.colors.disabled,
            fontSize: 12,
            marginHorizontal: 0
          }}
          renderDropdownIcon={() => dropDownIcon()}
          dropdownOverlayColor='transparent'
        />
      </View>
      <View style={styles.selectWrapper}>
        <SelectDropdown
          defaultValue={customizedTimeList?.find((item: any) => item.key === timeSelected)}
          defaultButtonText={t('SELECT_A_TIME_OPTION', 'Select an option')}
          data={customizedTimeList}
          onSelect={(selectedItem, index) => {
            handleChangeTime(selectedItem.key)
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.value
          }}
          rowTextForSelection={(item, index) => {
            return item.value
          }}
          buttonStyle={{borderTopRightRadius: 7.6, borderBottomRightRadius: 7.6, ...styles.selectOption}}
          buttonTextStyle={{
            color: theme.colors.disabled,
            fontSize: 12,
            textAlign: 'left',
            marginHorizontal: 0
          }}
          dropdownStyle={{
            borderRadius: 8,
            borderColor: theme.colors.lightGray,
            marginTop: Platform.OS === 'ios' ? 12 : -top
          }}
          rowStyle={{
            borderBottomColor: theme.colors.backgroundGray100,
            backgroundColor: theme.colors.backgroundGray100,
            height: 30,
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingTop: 8,
            paddingHorizontal: 14
          }}
          rowTextStyle={{
            color: theme.colors.disabled,
            fontSize: 12,
            marginHorizontal: 0
          }}
          renderDropdownIcon={() => dropDownIcon()}
          dropdownOverlayColor='transparent'
        />
      </View>
    </Container>
  )
}

export const MomentSelector = (props: any) => {
  const [{ configs }] = useConfig()

  const limitDays = parseInt(configs?.max_days_preorder?.value, 10)

  const currentDate = new Date()
  const time = limitDays > 1
    ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
    : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)

  currentDate.setTime(time)
  currentDate.setHours(23)
  currentDate.setMinutes(59)

  const businessPreorderProps = {
    ...props,
    UIComponent: MomentSelectorUI,
    maxDate: currentDate
  }
  return <MomentOptionController {...businessPreorderProps} />
}
