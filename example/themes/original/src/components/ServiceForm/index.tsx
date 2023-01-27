import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'styled-components/native'
import { Platform, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Text } from 'react-native'
import { OText, OButton, OModal, OIcon } from '../shared'
import FastImage from 'react-native-fast-image'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import SelectDropdown from 'react-native-select-dropdown'
import moment from 'moment'
import CalendarPicker from 'react-native-calendar-picker'
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ServiceFormParams } from '../../types'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import uuid from 'react-native-uuid';
import { orderTypeList } from '../../utils'

import {
  ProductForm as ProductFormController,
  useUtils,
  useLanguage,
  useConfig,
  useOrder,
  useSession
} from 'ordering-components/native'

import {
  Container,
  ProfessionalPhoto,
  InfoWrapper,
  Divider,
  ProfessionalWrapper,
  ScheduleWrapper,
  CalendarWrapper,
  ButtonWrapper
} from './styles'

const screenWidth = Dimensions.get('window').width

const ServiceFormUI = (props: ServiceFormParams) => {
  const {
    professionalSelected,
    productObject,
    handleSave,
    productCart,
    navigation,
    isSoldOut,
    maxProductQuantity,
    onClose,
    professionalListState,
    isCartProduct,
    actionStatus,
    handleCreateGuestUser
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ optimizeImage, parsePrice, parseDate }] = useUtils()
  const { top } = useSafeAreaInsets()
  const [{ configs }] = useConfig()
	const [orderState] = useOrder()
	const [{ auth }] = useSession()
	const { product, loading, error } = productObject;

  const [selectDate, setSelectedDate] = useState<any>(new Date())
  const [timeList, setTimeList] = useState<any>([])
  const [isEnabled, setIsEnabled] = useState(false)
  const [timeSelected, setTimeSelected] = useState<string | null>(null)
  const [dateSelected, setDateSelected] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [currentProfessional, setCurrentProfessional] = useState<any>(null)

  const guestCheckoutEnabled = configs?.guest_checkout_enabled?.value === '1'
  const orderTypeEnabled = !orderTypeList[orderState?.options?.type - 1] || configs?.allowed_order_types_guest_checkout?.value?.includes(orderTypeList[orderState?.options?.type - 1])

  const dropdownRef = useRef<any>(null)

  const styles = StyleSheet.create({
    photoStyle: {
      width: 45,
			height: 45,
			borderRadius: 7.6
    },
    buttonStyle: {
      borderRadius: 7.6,
      height: 44,
      borderWidth: 0
    },
    professionalSelect: {
      borderRadius: 7.6,
      padding: 11,
      borderWidth: 1,
      borderColor: theme.colors.backgroundGray200,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    professionalItem: {
      paddingVertical: 11,
      borderColor: theme.colors.backgroundGray200,
      borderTopWidth: 1
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
    dropDownRow: {
      color: theme.colors.primary,
      fontSize: 14,
      marginHorizontal: 0
    },
    professionalList: {
      paddingHorizontal: 40,
      paddingVertical: 30,
    }
  })

  const getMomentTime = (time) => {
    const _moment = moment(`${moment(selectDate).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm').toDate()
    return _moment
  }

  const isBusyTime = (professional, selectedMoment) => {
    if (!selectedMoment) return false
    const startDay = moment(selectedMoment).utc().format('d')
    const isStartScheduleEnabled = professional?.schedule?.[startDay]?.enabled
    const duration = product?.duration ?? 0
    const endDay = moment(selectedMoment).add(duration - 1, 'minutes').utc().format('d')
    const isEndScheduleEnabled = professional?.schedule?.[endDay]?.enabled
    if (!isStartScheduleEnabled || !isEndScheduleEnabled) return true

    if (professional?.busy_times?.length === 0) return false

    const busyTimes = isCartProduct
      ? professional?.busy_times.filter(item => !(item.start === productCart?.calendar_event?.start && item.end === productCart?.calendar_event?.end))
      : [...professional?.busy_times]
    const valid = busyTimes.some(item => {
      return (moment.utc(item?.start).local().valueOf() <= moment(selectedMoment).valueOf() &&
        moment(selectedMoment).valueOf() < moment.utc(item?.end).local().valueOf()) ||
        (moment.utc(item?.start).local().valueOf() < moment(selectedMoment).add(duration, 'minutes').valueOf() &&
        moment(selectedMoment).add(duration, 'minutes').valueOf() < moment.utc(item?.end).local().valueOf())
    })
    return valid
  }

  const onDateChange = (date: any) => {
    setSelectedDate(date)
    setTimeSelected(null)
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

  const handleUpdateGuest = () => {
		const guestToken = uuid.v4()
		if (guestToken) handleCreateGuestUser({ guest_token: guestToken })
	}

  const customDayHeaderStylesCallback = () => {
    return {
      textStyle: {
        color: theme.colors.disabled,
        fontSize: 12,
      },
    };
  };

  const handleSaveService = () => {
    const updated = {
      serviceTime: moment(dateSelected).utc().format('YYYY-MM-DD HH:mm:00'),
      professional: currentProfessional
    }
    handleSave && handleSave(updated)
  }

  const validateSelectedDate = (curdate: any, menu: any) => {
    const day = moment(curdate).format('d')
    setIsEnabled(menu?.schedule?.[day]?.enabled || false)
  }

  const handleRedirectLogin = () => {
		navigation && navigation.navigate('Login', {
			store_slug: props.businessSlug
		});
    onClose && onClose()
	};

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

  const addressRedirect = () => {
    navigation && navigation.navigate('AddressList')
    onClose && onClose()
  }

  const handleChangeProfessional = (professional: any) => {
    setCurrentProfessional(professional)
    setIsOpen(false)
  }

  useEffect(() => {
    if (selectDate === null || currentProfessional === null) return
    const _times = getTimes(selectDate, currentProfessional)
    setTimeList(_times)
  }, [selectDate, currentProfessional])

  useEffect(() => {
    if (!selectDate || !timeSelected) {
      setDateSelected(null)
      return
    }
    const date = `${moment(selectDate).format('YYYY-MM-DD')} ${timeSelected}:00`
    setDateSelected(date)
  }, [selectDate, timeSelected])

  useEffect(() => {
    if (!professionalSelected?.schedule) return
    setCurrentProfessional(professionalSelected)
  }, [professionalSelected])

  useEffect(() => {
    if (isCartProduct && professionalListState?.professionals?.length > 0) {
      const professional = professionalListState?.professionals?.find((item: any) => item.id === professionalSelected?.id)
      setCurrentProfessional(professional)
    }
  }, [isCartProduct, professionalListState?.professionals])

  useEffect(() => {
    if (!productCart?.calendar_event?.start) return
    setSelectedDate(moment.utc(productCart?.calendar_event?.start).local())
    setTimeSelected(moment.utc(productCart?.calendar_event?.start).local().format('HH:mm'))
  }, [productCart])
  
  return (
    <>
      {loading && !error && (
        <Placeholder Animation={Fade}>
          <PlaceholderLine
            height={258}
            style={{ borderRadius: 0 }}
            width={screenWidth}
          />
        </Placeholder>
      )}
      {!loading && !error && (
        <Container>
          {!!product?.images ? (
            <ProfessionalPhoto
              source={{
                uri: product?.images
              }}
            />
          ) : (
            <OIcon
              src={theme?.images?.dummies?.product}
              cover={false}
              style={{ alignSelf: 'center' }}
              width={200}
              height={200}
            />
          )}
          <InfoWrapper>
            <OText
              size={20}
              style={{ marginBottom: 4 }}
              weight={Platform.OS === 'ios' ? '600' : 'bold'}
            >
              {product?.name}
            </OText>
            <OText
              size={16}
              style={{ marginBottom: 10 }}
              weight={'400'}
            >
              {parsePrice(product?.price)} • {product?.duration}min
            </OText>
            <OText
              size={14}
              weight={'400'}
              color={theme?.colors?.disabled}
            >
              {product?.description}
            </OText>
          </InfoWrapper>
          <Divider />
          <ProfessionalWrapper>
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
                {t('PROFESSIONAL', 'Professional')}
              </OText>
              <OText
                size={10}
                weight={'400'}
                color={theme.colors?.danger5}
              >
                {t('REQUIRED', 'Required')}
              </OText>
            </View>
            <TouchableOpacity
              style={styles.professionalSelect}
              onPress={() => setIsOpen(true)}
            >
              {!!currentProfessional ? (
                <>
                  <View style={{ flexDirection: 'row' }}>
                    {!!currentProfessional?.photo ? (
                      <FastImage
                        style={styles.photoStyle}
                        source={{
                          uri: optimizeImage(currentProfessional?.photo, 'h_250,c_limit'),
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <OIcon
                        src={theme?.images?.general?.user}
                        cover={false}
                        style={styles.photoStyle}
                      />
                    )}
                    <View style={{ marginLeft: 14 }}>
                      <OText
                        size={14}
                        weight={'400'}
                        lineHeight={22}
                      >
                        {currentProfessional?.name} {currentProfessional?.lastname}
                      </OText>
                      <OText
                        size={12}
                        weight={'400'}
                        lineHeight={17}
                        color={isBusyTime(currentProfessional, dateSelected) ? theme.colors.danger5 : theme.colors.success500}
                      >
                        {isBusyTime(currentProfessional, dateSelected)
                          ? t('BUSY_ON_SELECTED_TIME', 'Busy on selected time')
                          : t('AVAILABLE', 'Available')
                        }
                      </OText>
                    </View>
                  </View>
                </>
              ) : (
                <OText size={12}>{t('SELECT_PROFESSIONAL', 'Select professional')}</OText>
              )}
              <View style={{ marginLeft: 5 }}>
                <IconAntDesign
                  name='down'
                  color={theme.colors.textThird}
                  size={12}
                />
              </View>
            </TouchableOpacity>
          </ProfessionalWrapper>
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
            {!!currentProfessional?.schedule ? (
              <CalendarWrapper>
                {(timeList?.length > 0 && isEnabled) ? (
                  <SelectDropdown
                    ref={dropdownRef} 
                    defaultValueByIndex={timeList.findIndex((item: any) => item.value === timeSelected)}
                    data={timeList}
                    onSelect={(selectedItem, index) => {
                      setTimeSelected(selectedItem?.value)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem?.text
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
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <Text style={[styles.dropDownRow, { color: isBusyTime(currentProfessional, getMomentTime(item.value)) ? theme.colors.lightGray : theme.colors.primary } ]}>
                          {item.text}
                        </Text>
                      )
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
                  width={screenWidth - 110}
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
                size={16}
                style={{ marginBottom: 30, textAlign: 'center' }}
                color={theme?.colors?.disabled}
                weight={Platform.OS === 'ios' ? '600' : 'bold'}
              >
                {t('NO_SCHEDULE', 'No schedule')}
              </OText>
            )}
          </ScheduleWrapper>
          <ButtonWrapper>
            <OText
              size={14}
              weight={Platform.OS === 'ios' ? '600' : 'bold'}
            >
              {dateSelected && moment(dateSelected).format('hh:mm A')}
            </OText>
            {((productCart &&
              auth &&
              orderState.options?.address_id)) && (
                <OButton
                  bgColor={theme.colors.primary}
                  onClick={() => handleSaveService()}
                  text={orderState.loading
                    ? t('LOADING', 'Loading')
                    : ((isSoldOut || maxProductQuantity <= 0)
                      ? t('SOLD_OUT', 'Sold out')
                      : t('BOOK', 'Book'))}
                  style={styles.buttonStyle}
                  isDisabled={isSoldOut || maxProductQuantity <= 0 || !currentProfessional?.id || !dateSelected || isBusyTime(currentProfessional, dateSelected)}
                  textStyle={{ fontSize: 14, color: theme.colors.white }}
                />
              )}
            {auth &&
              !orderState.options?.address_id &&
              (orderState.loading ? (
                <OButton
                  isDisabled
                  text={t('LOADING', 'Loading')}
                  imgRightSrc=""
                  textStyle={{ fontSize: 10 }}
                />
              ) : (
                <OButton onClick={() => addressRedirect()} />
              ))}
              {!auth && (
                <OButton
                  isDisabled={isSoldOut || maxProductQuantity <= 0}
                  onClick={() => handleRedirectLogin()}
                  text={
                    isSoldOut || maxProductQuantity <= 0
                      ? t('SOLD_OUT', 'Sold out')
                      : t('LOGIN_SIGNUP', 'Login / Sign Up')
                  }
                  imgRightSrc=""
                  textStyle={{ color: theme.colors.primary, fontSize: 14 }}
                  style={{
                    height: 44,
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.white,
                  }}
                />
              )}
              {!auth && guestCheckoutEnabled && orderTypeEnabled &&  (
                <TouchableOpacity style={{ marginTop: 10 }} onPress={handleUpdateGuest}>
                  {actionStatus?.loading ? (
                    <Placeholder Animation={Fade}>
                      <PlaceholderLine width={60} height={20} />
                    </Placeholder>
                  ) : (
                    <OText color={theme.colors.primary} size={13}>{t('WITH_GUEST_USER', 'With Guest user')}</OText>
                  )}
                </TouchableOpacity>
              )}
          </ButtonWrapper>
        </Container>
      )}

      <OModal
				open={isOpen}
				onClose={() => setIsOpen(false)}
				entireModal
			>
				<ScrollView contentContainerStyle={styles.professionalList}>
          <View style={{ paddingVertical: 11 }}>
            <OText
              size={14}
              weight={'400'}
            >
              {t('ANY_OROFESSIONAL_MEMBER', 'Any professional member')}
            </OText>
          </View>
          {professionalListState?.professionals?.map((professional: any) => (
            <TouchableOpacity
              key={professional?.id}
              style={styles.professionalItem}
              onPress={() => handleChangeProfessional(professional)}
            >
              <View style={{ flexDirection: 'row' }}>
                {!!professional?.photo ? (
                  <FastImage
                    style={styles.photoStyle}
                    source={{
                      uri: optimizeImage(professional?.photo, 'h_250,c_limit'),
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <OIcon
                    src={theme?.images?.general?.user}
                    cover={false}
                    style={styles.photoStyle}
                  />
                )}
                <View style={{ marginLeft: 14 }}>
                  <OText
                    size={14}
                    weight={'400'}
                    lineHeight={22}
                  >
                    {professional?.name} {professional?.lastname}
                  </OText>
                  <OText
                    size={12}
                    weight={'400'}
                    lineHeight={17}
                    color={isBusyTime(professional, dateSelected) ? theme.colors.danger5 : theme.colors.success500}
                  >
                    {isBusyTime(professional, dateSelected)
                      ? t('BUSY_ON_SELECTED_TIME', 'Busy on selected time')
                      : t('AVAILABLE', 'Available')
                    }
                  </OText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
			</OModal>
    </>
  )
}

export const ServiceForm = (props: any) => {
  const serviceFormProps = {
    ...props,
    UIComponent: ServiceFormUI,
    isService: true
  }
  return <ProductFormController {...serviceFormProps} />
}
