import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Platform, View, Dimensions } from 'react-native'
import { useUtils, useLanguage, useConfig } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import CalendarPicker from 'react-native-calendar-picker'
import FeatherIcon from 'react-native-vector-icons/Feather';
import moment from 'moment'
import SelectDropdown from 'react-native-select-dropdown'
import { OButton, OText, OIcon } from '../shared'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ProfessionalProfileParams } from '../../types'

import {
  Container,
  ProfessionalPhoto,
  InfoWrapper,
  Divider,
  ScheduleWrapper,
  ButtonWrapper,
  CalendarWrapper
} from './styles'

const windowWidth = Dimensions.get('window').width

export const ProfessionalProfile = (props: ProfessionalProfileParams) => {
  const {
    professional,
    handleChangeProfessionalSelected,
    onClose
  } = props

  const [{ optimizeImage }] = useUtils()
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const { top } = useSafeAreaInsets()

  const [selectDate, setSelectedDate] = useState<any>(new Date())
  const [isEnabled, setIsEnabled] = useState(false)
  const [timeList, setTimeList] = useState<any>([])
  const dropdownRef = useRef<any>(null)

  const styles = StyleSheet.create({
    buttonStyle: {
      borderRadius: 7.6,
      height: 44,
      borderWidth: 0
    },
    selectOption: {
      width: '100%',
      backgroundColor: theme.colors.backgroundGray100,
      paddingVertical: 5,
      paddingHorizontal: 14,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 40,
      marginBottom: 30
    },
    photoStyle: {
      alignSelf: 'center'
    }
  })

  const onDateChange = (date: any) => {
    setSelectedDate(date)
    dropdownRef?.current && dropdownRef.current.reset()
  }

  const dropDownIcon = () => {
    return (
      <IconAntDesign
        name='down'
        color={theme.colors.textThird}
        size={12}
      />
    )
  }

  const customDayHeaderStylesCallback = () => {
    return {
      textStyle: {
        color: theme.colors.disabled,
        fontSize: 12,
      },
    };
  };

  const validateSelectedDate = (curdate: any, menu: any) => {
    const day = moment(curdate).format('d')
    setIsEnabled(menu?.schedule?.[day]?.enabled || false)
  }

  const getTimes = (curdate: any, menu: any) => {
    validateSelectedDate(curdate, menu)
    const date = new Date()
    var dateSeleted = new Date(curdate)
    var times = []
    for (var k = 0; k < menu.schedule[dateSeleted.getDay()].lapses.length; k++) {
      var open = {
        hour: menu.schedule[dateSeleted.getDay()].lapses[k].open.hour,
        minute: menu.schedule[dateSeleted.getDay()].lapses[k].open.minute
      }
      var close = {
        hour: menu.schedule[dateSeleted.getDay()].lapses[k].close.hour,
        minute: menu.schedule[dateSeleted.getDay()].lapses[k].close.minute
      }
      for (var i = open.hour; i <= close.hour; i++) {
        if (date.getDate() !== dateSeleted.getDate() || i >= date.getHours()) {
          let hour = ''
          let meridian = ''
          if (configs?.format_time?.value === '12') {
            if (i === 0) {
              hour = '12'
              meridian = ' ' + t('AM', 'AM')
            } else if (i > 0 && i < 12) {
              hour = (i < 10 ? '0' + i : i)
              meridian = ' ' + t('AM', 'AM')
            } else if (i === 12) {
              hour = '12'
              meridian = ' ' + t('PM', 'PM')
            } else {
              hour = ((i - 12 < 10) ? '0' + (i - 12) : `${(i - 12)}`)
              meridian = ' ' + t('PM', 'PM')
            }
          } else {
            hour = i < 10 ? '0' + i : i
          }
          for (let j = (i === open.hour ? open.minute : 0); j <= (i === close.hour ? close.minute : 59); j += 15) {
            if (i !== date.getHours() || j >= date.getMinutes() || date.getDate() !== dateSeleted.getDate()) {
              times.push({
                text: hour + ':' + (j < 10 ? '0' + j : j) + meridian,
                value: (i < 10 ? '0' + i : i) + ':' + (j < 10 ? '0' + j : j)
              })
            }
          }
        }
      }
    }
    return times
  }

  const handleSelectProfessional = () => {
    handleChangeProfessionalSelected(professional)
    onClose && onClose()
  }

  useEffect(() => {
    if (selectDate === null || !professional?.schedule) return
    const _times = getTimes(selectDate, professional)
    setTimeList(_times)
  }, [selectDate, professional])

  return (
    <Container>
      {!!professional?.photo ? (
        <ProfessionalPhoto
          source={{
            uri: professional?.photo
          }}
        />
      ) : (
        <OIcon
          src={theme.images.general.user}
          style={styles.photoStyle}
          cover={false}
          width={200}
          height={200}
        />
      )}
      <InfoWrapper>
        <OText
          size={20}
          style={{ marginBottom: 3 }}
          weight={Platform.OS === 'ios' ? '600' : 'bold'}
        >
          {professional?.name} {professional?.lastname}
        </OText>
      </InfoWrapper>
      <Divider />
      <ScheduleWrapper>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 23
          }}
        >
          <OText
            size={16}
            weight={Platform.OS === 'ios' ? '600' : 'bold'}
          >
            {t('SCHEDULE', 'Schedule')}
          </OText>
          <OText
            size={10}
            weight={'400'}
            color={theme.colors?.danger5}
          >
            {t('REQUIRED', 'Required')}
          </OText>
        </View>
        {!!professional?.schedule ? (
          <CalendarWrapper>
            {(timeList?.length > 0 && isEnabled) ? (
              <SelectDropdown
                ref={dropdownRef} 
                data={timeList}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem.value)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.text
                }}
                rowTextForSelection={(item, index) => {
                  return item.text
                }}
                buttonStyle={{borderRadius: 7.6, ...styles.selectOption}}
                buttonTextStyle={{
                  color: theme.colors.disabled,
                  fontSize: 14,
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
                  fontSize: 14,
                  marginHorizontal: 0
                }}
                renderDropdownIcon={() => dropDownIcon()}
                dropdownOverlayColor='transparent'
              />
            ) : (
              <OText
                size={12}
                style={{ marginBottom: 30 }}
                weight={'400'}
                color={theme.colors?.danger5}
              >
                {t('PROFESSIONAL_NOT_AVAILABLE', 'Professional is not available at the moment')}
              </OText>
            )}

            <CalendarPicker
              previousComponent={
                <FeatherIcon
                  name='chevron-left'
                  color={theme.colors.disabled}
                  size={24}
                  style={{ marginHorizontal: 4 }}
                />
              }
              nextComponent={
                <FeatherIcon
                  name='chevron-right'
                  color={theme.colors.disabled}
                  size={24}
                  style={{ marginHorizontal: 4 }}
                />
              }
              width={windowWidth - 110}
              selectedDayTextColor={theme.colors.white}
              selectedDayColor={theme.colors.primary}
              todayBackgroundColor={theme.colors.border}
              dayLabelsWrapper={{ borderColor: theme.colors.clear }}
              onDateChange={onDateChange}
              minDate={new Date()}
              customDayHeaderStyles={customDayHeaderStylesCallback}
              selectedStartDate={selectDate}
            />
          </CalendarWrapper>
        ) : (
          <OText
            size={20}
            style={{ marginBottom: 30 }}
            weight={Platform.OS === 'ios' ? '600' : 'bold'}
          >
            {t('NO_SCHEDULE', 'No schedule')}
          </OText>
        )}
      </ScheduleWrapper>
      <ButtonWrapper>
        <OButton
          bgColor={theme.colors.primary}
          onClick={() => handleSelectProfessional()}
          text={t('BOOK', 'Book')}
          style={styles.buttonStyle}
          textStyle={{ fontSize: 14, color: theme.colors.white }}
        />
      </ButtonWrapper>
    </Container>
  )
}
