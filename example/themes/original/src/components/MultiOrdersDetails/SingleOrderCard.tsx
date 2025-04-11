import React, { useState, useEffect } from 'react'
import {
  useLanguage,
  useEvent,
  useUtils,
  useConfig,
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
import { getOrderStatus } from '../../utils'

const SingleOrderCardUI = (props: any) => {
  const {
    navigation,
    orderTypes,
    readMessages,
    messages,
    setMessages,
    handleGoToOrderDetails,
    showProgressBar
  } = props

  const { order } = props.order
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parseDate, parsePrice }] = useUtils()
  const [{ configs }] = useConfig()

  const hideIndividualButton = configs.multi_business_checkout_remove_individual_buttons?.value === '1'

  const styles = StyleSheet.create({
    statusBar: {
      height: 12,
    }
  })

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
        {!hideIndividualButton && (
          <OButton
            onClick={() => handleGoToOrderDetails(order?.uuid)}
            textStyle={{ color: theme.colors.primary, textAlign: 'center', fontSize: 14 }}
            style={{ flexDirection: 'row', justifyContent: 'center', borderRadius: 7.6, shadowOpacity: 0, paddingLeft: 5, paddingRight: 5, height: 44 }}
            text={t('ORDER_DETAILS', 'Order Details')}
            bgColor={theme.colors.white}
            borderColor={theme.colors.primary}
          />
        )}
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
      {showProgressBar && (
        <>
          <StaturBar>
            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{
                x: getOrderStatus(order?.status, t)?.percentage || 0,
                y: 0,
              }}
              locations={[0.9999, 0.9999]}
              colors={[theme.colors.primary, theme.colors.backgroundGray100]}
              style={styles.statusBar}
            />
          </StaturBar>
          <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
            {getOrderStatus(order?.status, t)?.value}
          </OText>
        </>
      )}
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
