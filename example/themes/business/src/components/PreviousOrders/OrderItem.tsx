import React, { useEffect, useState } from 'react';
import { Platform, PlatformIOSStatic, Pressable, StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from 'styled-components/native';
import { useLanguage, useUtils, useConfig, useEvent } from 'ordering-components/native';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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

function OrderItemPropsAreEqual(prevProps: any, nextProps: any) {
  return JSON.stringify(prevProps.order) === JSON.stringify(nextProps.order) &&
    JSON.stringify(prevProps._order) === JSON.stringify(nextProps._order) &&
    prevProps.currentTabSelected === nextProps.currentTabSelected
}

export const OrderItem = React.memo((props: any) => {
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
  const [events] = useEvent()
  const [configState] = useConfig()
  const [{ parseDate }] = useUtils();
  const [orientationState] = useDeviceOrientation();

  const [ordersOffUpdated, setOrdersOffUpdated] = useState<number[]>([])
  const [allowColumns, setAllowColumns] = useState({
    timer: configState?.configs?.order_deadlines_enabled?.value === '1',
    slaBar: configState?.configs?.order_deadlines_enabled?.value === '1',
  })
  const showExternalId = configState?.configs?.change_order_id?.value === '1'

  const IS_PORTRAIT = orientationState.orientation === PORTRAIT
  const platformIOS = Platform as PlatformIOSStatic

  const isIpad = platformIOS.isPad
  const isTablet = DeviceInfo.isTablet();

  const styles = StyleSheet.create({
    cardButton: {
      flex: 1,
      paddingVertical: (isIpad || isTablet) ? 20 : 15,
      marginBottom: IS_PORTRAIT ? 15 : 0,
      marginLeft: 3,
      backgroundColor: order?.time_status === 'delayed' 
        ? theme.colors.danger100
        : order?.time_status === 'at_risk' 
          ? theme.colors.warning100
          : theme.colors.primaryContrast
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
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 16,
      color: theme.colors.textGray,
    },
    date: {
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
    const offset = 300
    const cdtToutc = moment(order?.delivery_datetime).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss')
    const _delivery = order?.delivery_datetime_utc
      ? parseDate(order?.delivery_datetime_utc, { outputFormat: 'YYYY-MM-DD HH:mm:ss' })
      : parseDate(cdtToutc, { outputFormat: 'YYYY-MM-DD HH:mm:ss' })
    const _eta = order?.eta_time
    const diffTimeAsSeconds = moment(_delivery).add(_eta, 'minutes').diff(moment().utc(), 'seconds')
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
    day = day === 0 ? '' : `${day + ' ' + t('DAY', 'day') + ' '}`
    restHours = restHours < 10 ? '0' + restHours : restHours
    restMins = restMins < 10 ? '0' + restMins : restMins

    const finalTaget = sign + day + restHours + ':' + restMins
    return finalTaget
  }

  useEffect(() => {
    const slaSettings = configState?.configs?.order_deadlines_enabled?.value === '1'
    setAllowColumns({
      ...allowColumns,
      timer: slaSettings,
      slaBar: slaSettings
    })
  }, [configState.loading])

  useEffect(() => {
    const handleOfflineOrder = (ids: any) => {
      ids && setOrdersOffUpdated(ids)
    }

    events.on('offline_order_updated', handleOfflineOrder)
    return () => {
      events.off('offline_order_updated', handleOfflineOrder)
    }
  }, [])

  return (
    <Pressable
      disabled={order?.locked && isLogisticOrder}
      style={styles.cardButton}
      onPress={() => handlePressOrder({
        ...order,
        logistic_order_id: _order?.id,
        unsync: order?.unsync && !ordersOffUpdated?.includes(order?.id)
      })}
    >
      <Card key={order.id}>
        {!!allowColumns?.slaBar && (
          <Timestatus
            timeState={order?.time_status}
          />
        )}
        <Logo style={styles.logo}>
          <FastImage
            style={styles.icon}
            source={order.business?.logo?.includes('https') ? {
              uri: order.business?.logo,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable
            } : order.business?.logo ?? theme?.images?.dummies?.businessLogo}
            resizeMode={FastImage.resizeMode.cover}
          />
        </Logo>
        <Information>
          {!!order?.order_group_id && (
            <OText>
              <OText>{(t('INVOICE_GROUP_NO', 'Group No.') + order?.order_group_id)}</OText>
            </OText>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            {!!order.business?.name && (
              <OText numberOfLines={1} style={styles.title}>
                {order.business?.name}
              </OText>
            )}
            {order?.unsync && !ordersOffUpdated?.includes(order?.id) && (
              <MCIcon
                name={'cloud-sync'}
                color={'#444'}
                size={18}
              />
            )}
          </View>
          {!!order?.showNotification && (
            <NotificationIcon>
              <EntypoIcon
                name="dot-single"
                size={32}
                color={theme.colors.primary}
              />
            </NotificationIcon>
          )}
          <View>
            {!order?.order_group_id && showExternalId && !order?.order_group && (
              <OText
                style={styles.date}
                color={theme.colors.unselectText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {`${order?.external_id ?? t('NO_EXTERNAL_ID', 'No external Id ') + t('NO', 'Order No.') + order?.id}` + ' · ' + `${order?.delivery_datetime_utc
                  ? parseDate(order?.delivery_datetime_utc)
                  : parseDate(order?.delivery_datetime, { utc: false })
                  }`}
              </OText>
            )}
            {!showExternalId && (<OText
              style={styles.date}
              color={theme.colors.unselectText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {((!!order?.order_group_id && order?.order_group && isLogisticOrder
                ? `${order?.order_group?.orders?.length} ${t('ORDERS', 'Orders')}`
                : (t('NO', 'Order No.') + order?.id)
              ) + ' · ' + `${order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc)
                : parseDate(order?.delivery_datetime, { utc: false })}`)}
            </OText>
            )}
            {((currentTabSelected === 'pending' || currentTabSelected === 'inProgress' || currentTabSelected === 'active') && allowColumns?.timer) && (
              <>
                <OText
                  style={styles.date}
                  color={
                    order?.time_status === 'in_time'
                      ? '#00D27A'
                      : order?.time_status === 'at_risk'
                        ? '#FFC700'
                        : order?.time_status === 'delayed'
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
    </Pressable>
  )
}, OrderItemPropsAreEqual)
