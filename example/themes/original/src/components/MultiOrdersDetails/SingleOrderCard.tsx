import React, { useState, useEffect } from 'react'
import {
  useLanguage,
  useEvent,
  useUtils,
  OrderDetails as OrderDetailsController
} from 'ordering-components/native'
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OText, OButton, OIcon } from '../shared'
import LinearGradient from 'react-native-linear-gradient'

import {
  SingleOrderContainer,
  StaturBar,
  Icons
} from './styles'

const SingleOrderCardUI = (props: any) => {
  const {
    navigation,
    orderTypes,
    readMessages,
    messages,
    setMessages,
    handleGoToOrderDetails
  } = props

  const { order } = props.order
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parseDate, parsePrice }] = useUtils()

  const styles = StyleSheet.create({
    statusBar: {
      height: 12,
    }
  })

  const getOrderStatus = (s: string) => {
    const status = parseInt(s);
    const orderStatus = [
      {
        key: 0,
        value: t('PENDING', 'Pending'),
        slug: 'PENDING',
        percentage: 0.25,
        image: theme.images.order.status0,
      },
      {
        key: 1,
        value: t('COMPLETED', 'Completed'),
        slug: 'COMPLETED',
        percentage: 1,
        image: theme.images.order.status1,
      },
      {
        key: 2,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 3,
        value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
        slug: 'DRIVER_IN_BUSINESS',
        percentage: 0.6,
        image: theme.images.order.status3,
      },
      {
        key: 4,
        value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
        slug: 'PREPARATION_COMPLETED',
        percentage: 0.7,
        image: theme.images.order.status4,
      },
      {
        key: 5,
        value: t('REJECTED_BY_BUSINESS', 'Rejected by business'),
        slug: 'REJECTED_BY_BUSINESS',
        percentage: 0,
        image: theme.images.order.status5,
      },
      {
        key: 6,
        value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
        slug: 'REJECTED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status6,
      },
      {
        key: 7,
        value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
        slug: 'ACCEPTED_BY_BUSINESS',
        percentage: 0.35,
        image: theme.images.order.status7,
      },
      {
        key: 8,
        value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
        slug: 'ACCEPTED_BY_DRIVER',
        percentage: 0.45,
        image: theme.images.order.status8,
      },
      {
        key: 9,
        value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
        slug: 'PICK_UP_COMPLETED_BY_DRIVER',
        percentage: 0.8,
        image: theme.images.order.status9,
      },
      {
        key: 10,
        value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
        slug: 'PICK_UP_FAILED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status10,
      },
      {
        key: 11,
        value: t(
          'DELIVERY_COMPLETED_BY_DRIVER',
          'Delivery completed by driver',
        ),
        slug: 'DELIVERY_COMPLETED_BY_DRIVER',
        percentage: 1,
        image: theme.images.order.status11,
      },
      {
        key: 12,
        value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
        slug: 'DELIVERY_FAILED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status12,
      },
      {
        key: 13,
        value: t('PREORDER', 'PreOrder'),
        slug: 'PREORDER',
        percentage: 0,
        image: theme.images.order.status13,
      },
      {
        key: 14,
        value: t('ORDER_NOT_READY', 'Order not ready'),
        slug: 'ORDER_NOT_READY',
        percentage: 0,
        image: theme.images.order.status13,
      },
      {
        key: 15,
        value: t(
          'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
          'Order picked up completed by customer',
        ),
        slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        percentage: 100,
        image: theme.images.order.status1,
      },
      {
        key: 16,
        value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
        slug: 'CANCELLED_BY_CUSTOMER',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 17,
        value: t(
          'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
          'Order not picked up by customer',
        ),
        slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 18,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
          'Driver almost arrived to business',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        percentage: 0.15,
        image: theme.images.order.status3,
      },
      {
        key: 19,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
          'Driver almost arrived to customer',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        percentage: 0.9,
        image: theme.images.order.status11,
      },
      {
        key: 20,
        value: t(
          'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
          'Customer almost arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        percentage: 90,
        image: theme.images.order.status7,
      },
      {
        key: 21,
        value: t(
          'ORDER_CUSTOMER_ARRIVED_BUSINESS',
          'Customer arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        percentage: 95,
        image: theme.images.order.status7,
      },
      {
        key: 22,
        value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver'),
        slug: 'ORDER_LOOKING_FOR_DRIVER',
        percentage: 35,
        image: theme.images.order.status8
      },
      {
        key: 23,
        value: t('ORDER_DRIVER_ON_WAY', 'Driver on way'),
        slug: 'ORDER_DRIVER_ON_WAY',
        percentage: 45,
        image: theme.images.order.status8
      }
    ];

    const objectStatus = orderStatus.find((o) => o.key === status);

    return objectStatus && objectStatus;
  };

  const handleGoToMessages = (type: string) => {
    readMessages && readMessages();
    navigation.navigate(
      'MessageDetails',
      {
        type,
        order,
        messages,
        setMessages,
        orderId: order?.id,
        business: type === 'business',
        driver: type === 'driver',
        onClose: () => navigation?.canGoBack()
          ? navigation.goBack()
          : navigation.navigate('BottomTab', { screen: 'MyOrders' }),
      }
    )
  }

  return (
    <SingleOrderContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <OText size={16} lineHeight={24} mBottom={5} weight={'500'} color={theme.colors.textNormal}>
            {t('ORDER', 'Order')} #{order.id}
          </OText>
          <View style={{ flexDirection: 'row' }}>
            <OText size={12} lineHeight={18} color={theme.colors.textNormal}>{orderTypes?.find((type: any) => order?.delivery_type === type?.value)?.text}:</OText>
            <View style={{ flex: 1 }}>
              <OText mLeft={5} size={12} lineHeight={18} color={theme.colors.textNormal}>
                {
                  order?.delivery_datetime_utc
                    ? parseDate(order?.delivery_datetime_utc)
                    : parseDate(order?.delivery_datetime, { utc: false })
                }
              </OText>
            </View>
          </View>
        </View>
        <OButton
          onClick={() => handleGoToOrderDetails(order?.uuid)}
          textStyle={{ color: theme.colors.primary, textAlign: 'center', fontSize: 14 }}
          style={{ flexDirection: 'row', justifyContent: 'center', borderRadius: 7.6, shadowOpacity: 0, paddingLeft: 5, paddingRight: 5, height: 44 }}
          text={t('ORDER_DETAILS', 'Order Details')}
          bgColor={theme.colors.white}
          borderColor={theme.colors.primary}
        />
      </View>
      <OText size={16} lineHeight={24} mBottom={17} weight={'500'} color={theme.colors.textNormal}>
        {t('FROM', 'From')}
      </OText>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
          {order?.business?.name}
        </OText>
        <Icons>
          {!!order?.business?.cellphone && (
            <TouchableOpacity
              onPress={() => order?.business?.cellphone &&
                Linking.openURL(`tel:${order?.business?.cellphone}`)
              }
              style={{ paddingEnd: 5 }}
            >
              <OIcon
                src={theme.images.general.phone}
                width={16}
                color={theme.colors.disabled}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ paddingStart: 5 }}
            onPress={() => handleGoToMessages('business')}>
            <OIcon
              src={theme.images.general.chat}
              width={16}
              color={theme.colors.disabled}
            />
          </TouchableOpacity>
        </Icons>
      </View>
      <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
        {order?.business?.email}
      </OText>
      {!!order?.business?.cellphone && (
        <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
          {order?.business?.cellphone}
        </OText>
      )}      
      <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
        {order?.business?.address}
      </OText>
      <StaturBar>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{
            x: getOrderStatus(order?.status)?.percentage || 0,
            y: 0,
          }}
          locations={[0.9999, 0.9999]}
          colors={[theme.colors.primary, theme.colors.backgroundGray100]}
          style={styles.statusBar}
        />
      </StaturBar>
      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
        {getOrderStatus(order?.status)?.value}
      </OText>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
        <OText size={16} lineHeight={24} weight={'600'} color={theme.colors.textNormal}>
          {t('EXPORT_ORDER_TOTAL', 'Order total')}: {parsePrice(order?.summary?.total ?? order?.total)}
        </OText>
      </View>
    </SingleOrderContainer>
  )
}

export const SingleOrderCard = (props: any) => {
  const [, t] = useLanguage()
  const orderDetailsProps = {
    ...props,
    orderTypes: props.orderTypes || [
      { value: 1, text: t('DELIVERY', 'Delivery') },
      { value: 2, text: t('PICKUP', 'Pickup') },
      { value: 3, text: t('EAT_IN', 'Eat in') },
      { value: 4, text: t('CURBSIDE', 'Curbside') },
      { value: 5, text: t('DRIVE_THRU', 'Drive thru') }
    ],
    UIComponent: SingleOrderCardUI
  }

  return (
    <OrderDetailsController {...orderDetailsProps} />
  )
}
