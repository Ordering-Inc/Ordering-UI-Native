import React, { useEffect, useState } from 'react'
import {
  OrderList,
  useLanguage,
  useUtils,
  useConfig
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment';
import { OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Placeholder, Fade, PlaceholderLine } from "rn-placeholder";
import FastImage from 'react-native-fast-image'
import { OrderEta } from '../OrderDetails/OrderEta'
import {
  ProgressContentWrapper,
  ProgressBar,
  TimeWrapper,
  ProgressTextWrapper,
  OrderInfoWrapper,
  OrderProgressWrapper
} from './styles'
import { getOrderStatuPickUp, getOrderStatus } from '../../utils'
import DeviceInfo from 'react-native-device-info'

const OrderProgressUI = (props: any) => {
  const {
    orderList,
    navigation,
    loadOrders,
    isFocused
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [{ optimizeImage, parseTime, parseDate }] = useUtils()
  const [{ configs }] = useConfig()
  const [lastOrder, setLastOrder] = useState<any>(null)
  const imageFails = theme.images.general.emptyActiveOrders
  const [initialLoaded, setInitialLoaded] = useState(false)
  const statusToShow = [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23]

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
      elevation: 3,
      borderWidth: Platform.OS === 'android' && Number(DeviceInfo?.getSystemVersion?.()) < 5 ? 1 : 0,
      borderColor: 'rgba(0,0,0,0.2)'
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

  const handleGoToOrder = (index: string) => {
    navigation && navigation.navigate(index)
  }

  useEffect(() => {
    if (orderList?.orders.length > 0) {
      const sortedOrders = orderList.orders.sort((a: any, b: any) => a.id > b.id ? -1 : 1)
      const orderInProgress = sortedOrders.find((order: any) => (statusToShow.includes(order.status)))

      let _lastOrder = null
      if (orderInProgress) {
        _lastOrder = orderInProgress
      } else {
        _lastOrder = sortedOrders[0]
      }
      setLastOrder(_lastOrder)
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

  const progressBarObjt = (s: any) => lastOrder?.delivery_type && lastOrder?.delivery_type === 2 ? getOrderStatuPickUp(s) : getOrderStatus(s)

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
                  source={orderList?.orders.length === 1 && lastOrder?.business?.logo.includes('http') ? {
                    uri: optimizeImage(lastOrder?.business?.logo, 'h_50,c_limit'),
                    priority: FastImage.priority.normal,
                  } : theme.images.logos.logotype}
                  resizeMode={FastImage.resizeMode.contain}
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
                >{statusToShow.includes(lastOrder?.status) ? t('ORDER_IN_PROGRESS', 'Order in progress') : t('ORDER', 'Order')}</OText>
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
                <ProgressBar style={{ width: progressBarObjt(lastOrder.status)?.percentage ? `${(progressBarObjt(lastOrder.status) as any).percentage * 100}%` : '0%' }} />
              </ProgressContentWrapper>
              <ProgressTextWrapper>
                <OText size={12} style={{ width: '50%' }}>{progressBarObjt(lastOrder.status)?.value}</OText>
                <TimeWrapper>
                  <OText size={11}>{lastOrder?.delivery_type === 1 ? t('ESTIMATED_DELIVERY', 'Estimated delivery') : t('ESTIMATED_TIME', 'Estimated time')}</OText>
                  <OText size={11}>
                    {lastOrder?.delivery_datetime_utc
                      ? parseTime(lastOrder?.delivery_datetime_utc, { outputFormat: configs?.general_hour_format?.value || 'HH:mm' })
                      : parseTime(lastOrder?.delivery_datetime, { utc: false })}
                    &nbsp;-&nbsp;
                    {statusToShow.includes(lastOrder?.status) ? (
                      <OrderEta order={lastOrder} outputFormat={configs?.general_hour_format?.value || 'HH:mm'} />
                    ) : (
                      parseDate(lastOrder?.reporting_data?.at[`status:${lastOrder.status}`], { outputFormat: configs?.general_hour_format?.value })
                    )}
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
      pageSize: 10,
      controlType: 'infinity'
    },
    propsToFetch: [
      'id',
      'name',
      'business',
      'status',
      'delivery_type',
      'delivery_datetime_utc',
      'delivery_datetime',
      'reporting_data'
    ],
    noGiftCardOrders: true
  }

  return <OrderList {...orderProgressProps} />

}
