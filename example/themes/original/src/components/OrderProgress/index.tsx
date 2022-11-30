import React, { useEffect, useState } from 'react'
import {
  OrderList,
  useLanguage,
  useUtils
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment';
import { OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Placeholder, Fade, PlaceholderLine } from "rn-placeholder";
import FastImage from 'react-native-fast-image'
import {
  ProgressContentWrapper,
  ProgressBar,
  TimeWrapper,
  ProgressTextWrapper,
  OrderInfoWrapper,
  OrderProgressWrapper
} from './styles'
const OrderProgressUI = (props: any) => {
  const {
    orderList,
    navigation,
    loadOrders,
    isFocused
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [{ optimizeImage, parseDate, parseTime }] = useUtils()
  const [lastOrder, setLastOrder] = useState<any>(null)
  const imageFails = theme.images.general.emptyActiveOrders
  const [initialLoaded, setInitialLoaded] = useState(false)

  const styles = StyleSheet.create({
    main: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      flex: 1,
      padding: 15,
      borderRadius: 8,
      shadowOffset: {
        width: 1,
        height: 1
      },
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3
    },
    logoWrapper: {
      overflow: 'hidden',
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 3
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 8,
      resizeMode: 'stretch',
    },
    navigationButton: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  });

  const getOrderStatus = (s: any) => {
    const status = parseInt(s)
    const orderStatus = [
      { key: 0, value: t('PENDING', theme?.defaultLanguages?.PENDING || 'Pending'), slug: 'PENDING', percentage: 25 },
      { key: 1, value: t('COMPLETED', theme?.defaultLanguages?.COMPLETED || 'Completed'), slug: 'COMPLETED', percentage: 100 },
      { key: 2, value: t('REJECTED', theme?.defaultLanguages?.REJECTED || 'Rejected'), slug: 'REJECTED', percentage: 0 },
      { key: 3, value: t('DRIVER_IN_BUSINESS', theme?.defaultLanguages?.DRIVER_IN_BUSINESS || 'Driver in business'), slug: 'DRIVER_IN_BUSINESS', percentage: 60 },
      { key: 4, value: t('PREPARATION_COMPLETED', theme?.defaultLanguages?.PREPARATION_COMPLETED || 'Preparation Completed'), slug: 'PREPARATION_COMPLETED', percentage: 70 },
      { key: 5, value: t('REJECTED_BY_BUSINESS', theme?.defaultLanguages?.REJECTED_BY_BUSINESS || 'Rejected by business'), slug: 'REJECTED_BY_BUSINESS', percentage: 0 },
      { key: 6, value: t('REJECTED_BY_DRIVER', theme?.defaultLanguages?.REJECTED_BY_DRIVER || 'Rejected by Driver'), slug: 'REJECTED_BY_DRIVER', percentage: 0 },
      { key: 7, value: t('ACCEPTED_BY_BUSINESS', theme?.defaultLanguages?.ACCEPTED_BY_BUSINESS || 'Accepted by business'), slug: 'ACCEPTED_BY_BUSINESS', percentage: 35 },
      { key: 8, value: t('ACCEPTED_BY_DRIVER', theme?.defaultLanguages?.ACCEPTED_BY_DRIVER || 'Accepted by driver'), slug: 'ACCEPTED_BY_DRIVER', percentage: 45 },
      { key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', theme?.defaultLanguages?.PICK_UP_COMPLETED_BY_DRIVER || 'Pick up completed by driver'), slug: 'PICK_UP_COMPLETED_BY_DRIVER', percentage: 80 },
      { key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', theme?.defaultLanguages?.PICK_UP_FAILED_BY_DRIVER || 'Pick up Failed by driver'), slug: 'PICK_UP_FAILED_BY_DRIVER', percentage: 0 },
      { key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', theme?.defaultLanguages?.DELIVERY_COMPLETED_BY_DRIVER || 'Delivery completed by driver'), slug: 'DELIVERY_COMPLETED_BY_DRIVER', percentage: 100 },
      { key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', theme?.defaultLanguages?.DELIVERY_FAILED_BY_DRIVER || 'Delivery Failed by driver'), slug: 'DELIVERY_FAILED_BY_DRIVER', percentage: 0 },
      { key: 13, value: t('PREORDER', theme?.defaultLanguages?.PREORDER || 'PreOrder'), slug: 'PREORDER', percentage: 0 },
      { key: 14, value: t('ORDER_NOT_READY', theme?.defaultLanguages?.ORDER_NOT_READY || 'Order not ready'), slug: 'ORDER_NOT_READY', percentage: 65 },
      { key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', theme?.defaultLanguages?.ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER || 'Order picked up completed by customer'), slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', percentage: 100 },
      { key: 16, value: t('ORDER_STATUS_CANCELLED_BY_CUSTOMER', theme?.defaultLanguages?.ORDER_STATUS_CANCELLED_BY_CUSTOMER || 'Order cancelled by customer'), slug: 'ORDER_STATUS_CANCELLED_BY_CUSTOMER', percentage: 0 },
      { key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', theme?.defaultLanguages?.ORDER_NOT_PICKEDUP_BY_CUSTOMER || 'Order not picked up by customer'), slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER', percentage: 0 },
      { key: 18, value: t('ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS', theme?.defaultLanguages?.ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS || 'Driver almost arrived to business'), slug: 'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS', percentage: 55 },
      { key: 19, value: t('ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER', theme?.defaultLanguages?.ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER || 'Driver almost arrived to customer'), slug: 'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER', percentage: 90 },
      { key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', theme?.defaultLanguages?.ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS || 'Customer almost arrived to business'), slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', percentage: 90 },
      { key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', theme?.defaultLanguages?.ORDER_CUSTOMER_ARRIVED_BUSINESS || 'Customer arrived to business'), slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS', percentage: 95 },
      { key: 22, value: t('ORDER_LOOKING_FOR_DRIVER', theme?.defaultLanguages?.ORDER_LOOKING_FOR_DRIVER || 'Looking for driver'), slug: 'ORDER_LOOKING_FOR_DRIVER', percentage: 35 },
      { key: 23, value: t('ORDER_DRIVER_ON_WAY', theme?.defaultLanguages?.ORDER_DRIVER_ON_WAY || 'Driver on way'), slug: 'ORDER_DRIVER_ON_WAY', percentage: 45 }
    ]

    const objectStatus = orderStatus.find((o) => o.key === status)

    return objectStatus && objectStatus
  }

  const convertDiffToHours = (order: any) => {
    const time = order.delivery_type === 1 ? order?.business?.delivery_time : order?.business?.pickup_time
    const deliveryTime = order?.delivery_datetime_utc
      ? parseDate(order?.delivery_datetime_utc, { outputFormat: 'YYYY-MM-DD HH:mm' })
      : parseDate(order?.delivery_datetime, { utc: false, outputFormat: 'YYYY-MM-DD HH:mm' })
    const hour = time?.split(':')?.[0]
    const minute = time?.split(':')?.[1]
    const result = time ? (parseInt(hour, 10) * 60) + parseInt(minute, 10) : 0
    const returnedDate = moment(deliveryTime).add(result, 'minutes').format('hh:mm A')
    return returnedDate
  }

  const handleGoToOrder = (index: string) => {
    navigation && navigation.navigate(index)
  }

  useEffect(() => {
    if (orderList?.orders.length > 0) {
      const sortedOrders = orderList.orders.sort((a: any, b: any) => a.id > b.id ? -1 : 1)
      setLastOrder(sortedOrders[0])
    }
  }, [orderList?.orders])

  useEffect(() => {
    if (isFocused) {
      loadOrders(false, false, false, true)
    }
  }, [isFocused])

  useEffect(() => {
    if (orderList.loading || initialLoaded) return
    setInitialLoaded(true)
  }, [orderList.loading, initialLoaded])

  return (
    <>
      {(orderList?.loading && !initialLoaded) && (
        <OrderProgressWrapper>
          <Placeholder Animation={Fade} height={Platform.OS === 'ios' ? 147.5 : 158}>
            <PlaceholderLine height={60} style={{ borderRadius: 8, marginBottom: 10 }} />
            <PlaceholderLine height={20} style={{ marginBottom: 10 }} />
            <PlaceholderLine height={40} style={{ borderRadius: 8, marginBottom: 10 }} />
          </Placeholder>
        </OrderProgressWrapper>
      )}
      {(!orderList?.loading || initialLoaded) && orderList?.orders?.length > 0 && lastOrder && (
        <OrderProgressWrapper>
          <View style={styles.main}>
            <OrderInfoWrapper style={{ flex: 1 }}>
              <View style={styles.logoWrapper}>
                <FastImage
                  style={{ width: 50, height: 50 }}
                  source={{
                    uri: optimizeImage(lastOrder?.business?.logo, 'h_50,c_limit'),
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
              <View style={{
                paddingHorizontal: 10,
                flex: 1
              }}
              >
                <OText
                  size={13}
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 3
                  }}
                >{t('ORDER_IN_PROGRESS', 'Order in progress')}</OText>
                <OText size={11} numberOfLines={1} ellipsizeMode='tail'>{t('RESTAURANT_PREPARING_YOUR_ORDER', 'The restaurant is preparing your order')}</OText>
                <TouchableOpacity onPress={() => handleGoToOrder('MyOrders')}>
                  <View style={styles.navigationButton}>
                    <OText size={11} color={theme.colors.primary}>{t('GO_TO_MY_ORDERS', 'Go to my orders')}</OText>
                    <IconAntDesign
                      name='arrowright'
                      color={theme.colors.primary}
                      size={13}
                      style={{ marginHorizontal: 5 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </OrderInfoWrapper>
            <View style={{ flex: 1 }}>
              <ProgressContentWrapper>
                <ProgressBar style={{ width: getOrderStatus(lastOrder.status)?.percentage ? `${getOrderStatus(lastOrder.status)?.percentage}%` : '0%' }} />
              </ProgressContentWrapper>
              <ProgressTextWrapper>
                <OText size={12} style={{ width: '50%' }}>{getOrderStatus(lastOrder.status)?.value}</OText>
                <TimeWrapper>
                  <OText size={11}>{t('ESTIMATED_DELIVERY', 'Estimated delivery')}</OText>
                  <OText size={11}>
                    {lastOrder?.delivery_datetime_utc
                      ? parseTime(lastOrder?.delivery_datetime_utc, { outputFormat: 'hh:mm A' })
                      : parseTime(lastOrder?.delivery_datetime, { utc: false })}
                    &nbsp;-&nbsp;
                    {convertDiffToHours(lastOrder)}
                  </OText>
                </TimeWrapper>
              </ProgressTextWrapper>
            </View>
          </View>
        </OrderProgressWrapper>
      )}
      {/* {!orderList?.loading && orderList?.orders?.length === 0 && (
        <NotFoundSource
          image={imageFails}
          content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
          conditioned
        />
      )} */}
    </>
  )
}

export const OrderProgress = (props: any) => {
  const orderProgressProps = {
    ...props,
    UIComponent: OrderProgressUI,
    orderStatus: [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 1,
      controlType: 'infinity'
    }
  }

  return <OrderList {...orderProgressProps} />

}
