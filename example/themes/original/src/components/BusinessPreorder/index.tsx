import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { TouchableOpacity, StyleSheet, View, Dimensions, Platform } from 'react-native'
import { useLanguage, useUtils, useConfig, useOrder, MomentOption } from 'ordering-components/native'
import { OButton, OIcon, OText } from '../shared'
import { useTheme } from 'styled-components/native'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import FastImage from 'react-native-fast-image'
import CalendarStrip from 'react-native-calendar-strip'
import { BusinessMenuList } from '../BusinessMenuList'
import Spinner from 'react-native-loading-spinner-overlay'
import { BusinessPreorderParams } from '../../types'
import moment from 'moment'
import { setLocalMoment } from '../../utils';

import SelectDropdown from 'react-native-select-dropdown'
import {
  PreOrderContainer,
  BusinessInfoWrapper,
  PreorderTypeWrapper,
  MenuWrapper,
  OrderTimeWrapper,
  TimeListWrapper,
  TimeContentWrapper,
  TimeItem
} from './styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const windowHeight = Dimensions.get('window').height;

const BusinessPreorderUI = (props: BusinessPreorderParams) => {
  const {
    goToBack,
    business,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    handleBusinessClick,
    handleChangeDate,
    handleChangeTime,
    handleAsap,
    getActualSchedule,
    isAsap,
    cateringPreorder,
    preorderLeadTime,
    preorderMaximumDays
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ optimizeImage, parseTime }] = useUtils()
  const [{ configs }] = useConfig()
  const [orderState] = useOrder()
  const [selectedPreorderType, setSelectedPreorderType] = useState(0)
  const [menu, setMenu] = useState<any>({})
  const [timeList, setTimeList] = useState<any>([])
  const [selectDate, setSelectedDate] = useState<any>(null)
  const [datesWhitelist, setDateWhitelist] = useState<any>([{ start: null, end: null }])
  const [isEnabled, setIsEnabled] = useState(false)
  const { top } = useSafeAreaInsets()
  const is12hours = configs?.general_hour_format?.value?.includes('hh:mm')

  const showOrderTime = (selectedPreorderType === 1 && Object.keys(menu)?.length > 0) || selectedPreorderType === 0
  const isPreOrderSetting = configs?.preorder_status_enabled?.value === '1'
  const styles = StyleSheet.create({
    container: {
      height: windowHeight,
      paddingVertical: 30,
      paddingHorizontal: 20
    },
    businessLogo: {
      backgroundColor: 'white',
      width: 60,
      height: 60,
      borderRadius: 7.6,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2
    },
    selectOption: {
      backgroundColor: theme.colors.backgroundGray100,
      borderRadius: 7.6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 44,
      width: '100%'
    },
    calendar: {
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderColor: theme.colors.backgroundGray200,
      height: 100,
    },
    calendarHeaderContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      textAlign: 'left',
      marginBottom: 17,
      borderBottomWidth: 1,
      borderColor: theme.colors.backgroundGray200
    },
    calendarHeader: {
      color: '#344050',
      alignSelf: 'flex-start',
      fontSize: 14,
      fontWeight: '400'
    },
    dateNumber: {
      color: '#B1BCCC',
      fontSize: 16,
      fontWeight: '500',
    },
    dateName: {
      color: '#B1BCCC',
      fontSize: 12,
      textTransform: 'capitalize',
    },
    highlightDateName: {
      color: '#344050',
      fontSize: 12,
      textTransform: 'capitalize',
    },
    highlightDateNumber: {
      color: '#344050',
      fontSize: 16,
      textTransform: 'capitalize',
    },
    disabledDateName: {
      color: '#B1BCCC',
      fontSize: 10,
      textTransform: 'capitalize',
      opacity: 1,
    },
    disabledDateNumber: {
      color: '#B1BCCC',
      fontSize: 14,
      fontWeight: '500'
    }
  })

  const preorderTypeList = [
    { key: 'business_hours', name: t('BUSINESS_HOURS', 'Business hours') },
    { key: 'business_menu', name: t('BUSINESS_MENU', 'Business menu') }
  ]

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
          if (is12hours) {
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

  const onSelectDate = (val: any) => {
    setSelectedDate(val)
    if (handleChangeDate) handleChangeDate(moment(val).format('YYYY-MM-DD'))
  }

  const LeftSelector = () => {
    return (
      <View style={{ height: '100%', justifyContent: 'flex-end' }}>
        <IconAntDesign
          name='caretleft'
          color={theme.colors.textNormal}
          size={16}
        />
      </View>
    )
  }

  const RightSelector = () => {
    return (
      <View style={{ height: '100%', justifyContent: 'flex-end' }}>
        <IconAntDesign
          name='caretright'
          color={theme.colors.textNormal}
          size={16}
        />
      </View>
    )
  }

  useEffect(() => {
    if (datesList?.length > 0) {
      const _datesList = datesList.slice(0, Number(configs?.max_days_preorder?.value || 6))
      const minDateParts = _datesList[0].split('-')
      const maxDateParts = _datesList[_datesList.length - 1].split('-')
      const _minDate = new Date(minDateParts[0], minDateParts[1] - 1, minDateParts[2])
      const _maxDate = new Date(maxDateParts[0], maxDateParts[1] - 1, maxDateParts[2])
      setDateWhitelist([{ start: _minDate, end: _maxDate }])
    }
  }, [datesList])

  const handleClickBusiness = () => {
    handleBusinessClick && handleBusinessClick(business)
  }

  const dropDownIcon = () => {
    return (
      <IconAntDesign
        name='down'
        color={theme.colors.textThird}
        size={16}
      />
    )
  }

  useEffect(() => {
    if (selectDate === null) return
    if (cateringPreorder) {
      let _timeLists = []
      const schedule = business && getActualSchedule()
      if (!schedule && business) {
        setTimeList([])
        return
      }

      _timeLists = hoursList
        .filter(hour => {
          return (Object.keys(business || {})?.length === 0 || schedule?.lapses?.some((lapse: any) => {
            const openHour = lapse.open.hour < 10 ? `0${lapse.open.hour}` : lapse.open.hour
            const openMinute = lapse.open.minute < 10 ? `0${lapse.open.minute}` : lapse.open.minute
            const closeHour = lapse.close.hour < 10 ? `0${lapse.close.hour}` : lapse.close.hour
            const closeMinute = lapse.close.minute < 10 ? `0${lapse.close.minute}` : lapse.close.minute
            return moment(dateSelected + ` ${hour.startTime}`) >= moment(dateSelected + ` ${openHour}:${openMinute}`).add(preorderLeadTime, 'minutes') && moment(dateSelected + ` ${hour.endTime}`) <= moment(dateSelected + ` ${closeHour}:${closeMinute}`)
          })) &&
            (moment(dateSelected + ` ${hour.startTime}`) < moment(dateSelected + ` ${hour.endTime}`)) &&
            (moment().add(preorderLeadTime, 'minutes') < moment(dateSelected + ` ${hour.startTime}`) || !cateringPreorder)
        })
        .map(hour => {
          return {
            value: hour.startTime,
            text: is12hours ? (
              hour.startTime.includes('12')
                ? `${hour.startTime}PM`
                : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
            ) : (
              parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
            ),
            endText: is12hours ? (
              hour.endTime.includes('12')
                ? `${hour.endTime}PM`
                : parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'hh:mma' })
            ) : (
              parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'HH:mm' })
            )
          }
        })
      if (_timeLists?.length > 0) {
        setTimeList(_timeLists)
      }
    } else {
      const selectedMenu = Object.keys(menu).length > 0 ? (menu?.use_business_schedule ? business : menu) : business
      const _times = getTimes(selectDate, selectedMenu)
      setTimeList(_times)
    }
  }, [selectDate, menu, JSON.stringify(datesWhitelist), JSON.stringify(business), cateringPreorder, JSON.stringify(hoursList), dateSelected])

  useEffect(() => {
    if (selectedPreorderType === 0 && Object.keys(menu).length > 0) setMenu({})
  }, [selectedPreorderType])

  useEffect(() => {
    if (dateSelected) {

      const dateParts = dateSelected.split('-')
      const _dateSelected = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
      setSelectedDate(_dateSelected)
    }
  }, [dateSelected])

  useEffect(() => {
    setLocalMoment(moment, t)
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      handleAsap && handleAsap()
    }, [])
  )

  return (
    <>
      <PreOrderContainer contentContainerStyle={{ paddingVertical: 32, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => goToBack && goToBack()} style={{ marginBottom: 12 }}>
          <IconAntDesign
            name='close'
            size={24}
            style={{ marginLeft: -4 }}
          />
        </TouchableOpacity>
        <BusinessInfoWrapper>
          <OText
            size={20}
            style={{
              fontWeight: '600'
            }}
          >{t('PREORDER', 'Preorder')}</OText>
          <View style={styles.businessLogo}>
            <FastImage
              style={{ width: 59, height: 59 }}
              source={{
                uri: optimizeImage(business?.logo, 'h_60,c_limit'),
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </BusinessInfoWrapper>
        {isPreOrderSetting && !cateringPreorder && (
          <PreorderTypeWrapper>
            <OText
              size={16}
              style={{
                fontWeight: '600',
                lineHeight: 24,
                marginBottom: 12
              }}
            >
              {t('PREORDER_TYPE', 'Preorder type')}
            </OText>
            <SelectDropdown
              defaultValueByIndex={selectedPreorderType}
              data={preorderTypeList}
              // disabled={orderState.loading}
              onSelect={(selectedItem, index) => {
                setSelectedPreorderType(index)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name
              }}
              rowTextForSelection={(item, index) => {
                return item.name
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
                borderColor: theme.colors.lightGray,
                marginTop: Platform.OS === 'ios' ? 12 : -top
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
              renderDropdownIcon={() => dropDownIcon()}
              dropdownOverlayColor='transparent'
            />
          </PreorderTypeWrapper>
        )}
        {selectedPreorderType === 1 && (
          <MenuWrapper>
            <OText
              size={16}
              style={{
                fontWeight: '600',
                lineHeight: 24,
                marginBottom: 12
              }}
            >
              {t('MENU', 'Menu')}
            </OText>
            <BusinessMenuList
              businessId={business.id}
              setMenu={setMenu}
              menu={menu}
            />
          </MenuWrapper>
        )}
        {isPreOrderSetting && showOrderTime && (
          <OrderTimeWrapper>
            <OText
              size={16}
              style={{
                fontWeight: '600',
                lineHeight: 24
              }}
            >
              {t('ORDER_TIME', 'Order time')}
            </OText>
            <View style={{ flex: 1 }}>
              {selectDate && datesWhitelist[0]?.start !== null && (
                <CalendarStrip
                  scrollable
                  style={styles.calendar}
                  calendarHeaderContainerStyle={styles.calendarHeaderContainer}
                  calendarHeaderStyle={styles.calendarHeader}
                  iconContainer={{ flex: 0.1 }}
                  dayContainerStyle={{ height: '100%' }}
                  highlightDateContainerStyle={{ height: '100%' }}
                  calendarHeaderFormat='MMMM, YYYY'
                  iconStyle={{ borderWidth: 1 }}
                  selectedDate={selectDate}
                  datesWhitelist={datesWhitelist}
                  highlightDateNameStyle={styles.highlightDateName}
                  highlightDateNumberStyle={styles.highlightDateNumber}
                  minDate={moment()}
                  maxDate={cateringPreorder ? moment().add(preorderMaximumDays, 'days') : undefined}
                  disabledDateNameStyle={styles.disabledDateName}
                  disabledDateNumberStyle={styles.disabledDateNumber}
                  dateNumberStyle={styles.dateNumber}
                  dateNameStyle={styles.dateName}
                  disabledDateOpacity={0.6}
                  onDateSelected={(date: any) => onSelectDate(date)}
                  leftSelector={<LeftSelector />}
                  rightSelector={<RightSelector />}
                />
              )}
            </View>
            <TimeListWrapper nestedScrollEnabled={true} cateringPreorder={cateringPreorder}>
              {((isEnabled || cateringPreorder) && timeList?.length > 0) ? (
                <TimeContentWrapper>
                  {timeList.map((time: any, i: number) => (
                    <TouchableOpacity key={i} onPress={() => handleChangeTime(time.value)}>
                      <TimeItem active={timeSelected === time.value} cateringPreorder={cateringPreorder}>
                        {cateringPreorder && (
                          <>
                            {timeSelected === time.value ? (
                              <OIcon
                                src={theme.images.general.option_checked}
                                width={18}
                                style={{ marginEnd: 24, bottom: 2 }}
                              />
                            ) : (
                              <OIcon
                                src={theme.images.general.option_normal}
                                width={18}
                                style={{ marginEnd: 24, bottom: 2 }}
                              />
                            )}
                          </>
                        )}
                        <OText
                          size={cateringPreorder ? 18 : 16}
                          color={timeSelected === time.value ? theme.colors.primary : theme.colors.textNormal}
                          style={{
                            lineHeight: 24
                          }}
                        >{time.text} {cateringPreorder && `- ${time.endText}`}</OText>
                      </TimeItem>
                    </TouchableOpacity>
                  ))}
                  {timeList.length % 3 === 2 && (
                    <TimeItem style={{ backgroundColor: 'transparent' }} />
                  )}
                </TimeContentWrapper>
              ) : (
                <OText
                  size={16}
                  style={{
                    fontWeight: '600',
                    lineHeight: 24,
                    marginBottom: 12,
                    textAlign: 'center'
                  }}
                >
                  {t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment')}
                </OText>
              )}
            </TimeListWrapper>
          </OrderTimeWrapper>
        )}
        {!isPreOrderSetting && (
          <OText
            size={16}
            style={{
              fontWeight: '600',
              lineHeight: 24,
              marginTop: 30,
              marginBottom: 12,
              textAlign: 'center'
            }}
          >
            {t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment')}
          </OText>
        )}
        <OButton
          text={t('GO_TO_MENU', 'Go to menu')}
          style={{ borderRadius: 7.6, marginBottom: 20, marginTop: 30 }}
          onClick={() => handleClickBusiness()}
          isDisabled={isAsap || !(dateSelected && timeSelected)}
        />
      </PreOrderContainer>
      <Spinner visible={orderState.loading} />
    </>
  )
}

export const BusinessPreorder = (props: any) => {
  const [{ configs }] = useConfig()
  const [orderState] = useOrder()
  const limitDays = parseInt(configs?.max_days_preorder?.value, 10)

  const currentDate = new Date()
  const time = limitDays > 1
    ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
    : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)

  currentDate.setTime(time)
  currentDate.setHours(23)
  currentDate.setMinutes(59)

  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null

  const splitCateringValue = (configName: string) =>
    Object.values(props?.business?.configs || {})
      ?.find((config : any) => config?.key === configName)
      ?.value?.split('|')
      ?.find((val : any) => val.includes(cateringTypeString || ''))?.split(',')[1]

  const preorderSlotInterval = parseInt(splitCateringValue('preorder_slot_interval'))
  const preorderLeadTime = parseInt(splitCateringValue('preorder_lead_time'))
  const preorderTimeRange = parseInt(splitCateringValue('preorder_time_range'))
  const preorderMaximumDays = parseInt(splitCateringValue('preorder_maximum_days'))
  const preorderMinimumDays = parseInt(splitCateringValue('preorder_minimum_days'))

  const businessPreorderProps = {
    ...props,
    UIComponent: BusinessPreorderUI,
    maxDate: currentDate,
    preorderLeadTime,
    preorderSlotInterval,
    preorderTimeRange,
    preorderMaximumDays,
    preorderMinimumDays,
    cateringPreorder: !!cateringTypeString
  }
  return <MomentOption {...businessPreorderProps} />
}