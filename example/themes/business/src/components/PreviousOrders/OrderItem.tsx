import React, { useEffect, useState } from 'react';
import { Platform, PlatformIOSStatic, StyleSheet, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from 'styled-components/native';
import { useLanguage, useUtils, useConfig } from 'ordering-components/native';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import FastImage from 'react-native-fast-image'
import moment from 'moment'

import {
  Card,
  Logo,
  Information,
  MyOrderOptions,
  NotificationIcon,
  Timestatus
} from './styles'

import { OText } from '../shared';
import { DeviceOrientationMethods } from '../../../../../src/hooks/DeviceOrientation'

const { useDeviceOrientation, PORTRAIT } = DeviceOrientationMethods

export const OrderItem = (props: any) => {
  const {
    order,
    _order,
    isLogisticOrder,
    currentTabSelected,
    getOrderStatus,
    handlePressOrder
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [configState] = useConfig()
  const [{ parseDate, optimizeImage }] = useUtils();
  const [orientationState] = useDeviceOrientation();

  const [allowColumns, setAllowColumns] = useState({
    timer: configState?.configs?.order_deadlines_enabled?.value === '1',
    slaBar: configState?.configs?.order_deadlines_enabled?.value === '1',
  })

  const IS_PORTRAIT = orientationState.orientation === PORTRAIT
  const platformIOS = Platform as PlatformIOSStatic

  const isIpad = platformIOS.isPad
  const isTablet = DeviceInfo.isTablet();

  const styles = StyleSheet.create({
    cardButton: {
      flex: 1,
      paddingVertical: (isIpad || isTablet) ? 20 : 0,
      marginBottom: IS_PORTRAIT ? 25 : 0,
      marginLeft: 3,
    },
    icon: {
      borderRadius: 7.6,
      width: 60,
      height: 60
    },
    logo: {
      borderRadius: 10,
      shadowColor: "#0000006e",
      shadowRadius: 10,
      elevation: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 3,
    },
    title: {
      marginBottom: 6,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 16,
      color: theme.colors.textGray,
    },
    date: {
      marginBottom: 6,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 12,
    },
    orderType: {
      fontSize: 12,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      color: theme.colors.orderTypeColor,
    },
  });

  const getDelayMinutes = (order: any) => {
    const cdtToutc = moment(order?.delivery_datetime).utc().format('YYYY-MM-DD HH:mm:ss')
    const _delivery = order?.delivery_datetime_utc
      ? parseDate(order?.delivery_datetime_utc, { outputFormat: 'YYYY-MM-DD hh:mm A' })
      : parseDate(cdtToutc, { outputFormat: 'YYYY-MM-DD hh:mm A' })
    const _eta = order?.eta_time
    const diffTimeAsSeconds = moment(_delivery, 'YYYY-MM-DD hh:mm A').add(_eta, 'minutes').diff(moment().utc(), 'seconds')
    return Math.ceil(diffTimeAsSeconds / 60)
  }

  const displayDelayedTime = (order: any) => {
    let tagetedMin = getDelayMinutes(order)
    // get day, hour and minutes
    const sign = tagetedMin >= 0 ? '' : '- '
    tagetedMin = Math.abs(tagetedMin)
    let day: string | number = Math.floor(tagetedMin / 1440)
    const restMinOfTargetedMin = tagetedMin - 1440 * day
    let restHours: string | number = Math.floor(restMinOfTargetedMin / 60)
    let restMins: string | number = restMinOfTargetedMin - 60 * restHours
    // make standard time format
    day = day === 0 ? '' : day + 'day  '
    restHours = restHours < 10 ? '0' + restHours : restHours
    restMins = restMins < 10 ? '0' + restMins : restMins

    const finalTaget = sign + day + restHours + ':' + restMins
    return finalTaget
  }

  const getStatusClassName = (minutes: number) => {
    if (isNaN(Number(minutes))) return 'in_time'
    const delayTime = configState?.configs?.order_deadlines_delayed_time?.value
    return minutes > 0 ? 'in_time' : Math.abs(minutes) <= delayTime ? 'at_risk' : 'delayed'
  }

  useEffect(() => {
    const slaSettings = configState?.configs?.order_deadlines_enabled?.value === '1'
    setAllowColumns({
      ...allowColumns,
      timer: slaSettings,
      slaBar: slaSettings
    })
  }, [configState.loading])

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={order?.locked && isLogisticOrder}
      style={styles.cardButton}
      onPress={() => handlePressOrder({ ...order, logistic_order_id: _order?.id })}
    >
      <Card key={order.id}>
        {!!allowColumns?.slaBar && (
          <Timestatus
            style={{
              backgroundColor: getStatusClassName(getDelayMinutes(order)) === 'in_time'
                ? '#00D27A'
                : getStatusClassName(getDelayMinutes(order)) === 'at_risk'
                  ? '#FFC700'
                  : getStatusClassName(getDelayMinutes(order)) === 'delayed'
                    ? '#E63757'
                    : ''
            }}
          />
        )}
        <Logo style={styles.logo}>
          <FastImage
            style={styles.icon}
            source={order.business?.logo ? {
              uri: optimizeImage(order.business?.logo, 'h_100,c_limit'),
              priority: FastImage.priority.normal,
            } : theme?.images?.dummies?.businessLogo}
            resizeMode={FastImage.resizeMode.cover}
          />
        </Logo>
        <Information>
          {!!order?.order_group_id && (
            <OText>
              <OText>{(t('INVOICE_GROUP_NO', 'Group No.') + order?.order_group_id)}</OText>
            </OText>
          )}
          {!!order.business?.name && (
            <OText numberOfLines={1} style={styles.title}>
              {order.business?.name}
            </OText>
          )}
          {!!order?.showNotification && (
            <NotificationIcon>
              <EntypoIcon
                name="dot-single"
                size={32}
                color={theme.colors.primary}
              />
            </NotificationIcon>
          )}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <OText
              style={styles.date}
              color={theme.colors.unselectText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {(!!order?.order_group_id && order?.order_group && isLogisticOrder
                  ? `${order?.order_group?.orders?.length} ${t('ORDERS', 'Orders')}`
                  : (t('NO', 'Order No.') + order.id)
                ) + ' · '}
              {order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc, { outputFormat: 'MM/DD/YY · HH:mm a' })
                : parseDate(order?.delivery_datetime, { utc: false })}
            </OText>
            {((currentTabSelected === 'pending' || currentTabSelected === 'inProgress') && allowColumns?.timer) && (
              <>
                <OText> · </OText>
                <OText
                  style={styles.date}
                  color={
                    getStatusClassName(getDelayMinutes(order)) === 'in_time'
                      ? '#00D27A'
                      : getStatusClassName(getDelayMinutes(order)) === 'at_risk'
                        ? '#FFC700'
                        : getStatusClassName(getDelayMinutes(order)) === 'delayed'
                          ? '#E63757'
                          : ''}
                >
                  {displayDelayedTime(order)}
                </OText>
              </>
            )}
          </View>
          {!isLogisticOrder && (
            <MyOrderOptions>
              <OText
                style={styles.orderType}
                mRight={5}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {order.delivery_type === 1
                  ? t('DELIVERY', 'Delivery')
                  : order.delivery_type === 2
                    ? t('PICKUP', 'Pickup')
                    : order.delivery_type === 3
                      ? t('EAT_IN', 'Eat in')
                      : order.delivery_type === 4
                        ? t('CURBSIDE', 'Curbside')
                        : t('DRIVER_THRU', 'Driver thru')}
                {` · ${getOrderStatus(order.status)}`}
              </OText>
            </MyOrderOptions>
          )}
        </Information>
      </Card>
    </TouchableOpacity>
  )
}
