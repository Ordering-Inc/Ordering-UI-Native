import React, { useEffect } from 'react'
import { OText, OButton, OIcon, OModal } from '../shared';
import { useLanguage, useOrder } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { StyleSheet, View, AsyncStorage } from 'react-native'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'
import { getHourMin, getIconCard } from '../../utils'

import {
  OrderCreatingContainer,
  LocationWrapper,
  DeliveryWrapper,
  DeliveryContentWrapper
} from './styles'

export const OrderCreating = (props: any) => {
  const {
    cart,
    business,
    isCheckOut,
    isOrderDetail
  } = props

  const [, t] = useLanguage();
  const theme = useTheme()
  const [orderState] = useOrder()

  const styles = StyleSheet.create({
    title: {
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 18
    },
    imageWrapper: {
      width: '100%',
      marginBottom: 73
    },
  });

  const getProducts = () => {
    if (cart && cart?.products.length > 0) {
      return cart?.products.length
    }
    return 1
  }

  const parseDeliveryTime = () => {
    let hour = 0
    let min = 0
    if (orderState?.options?.type === 1 && cart) {
      hour = (cart?.business?.delivery_time).split(':')[0]
      min = (cart?.business?.delivery_time).split(':')[1]
    }

    if (orderState?.options?.type === 2 && cart) {
      hour = (cart?.business?.pickup_time).split(':')[0]
      min = (cart?.business?.pickup_time).split(':')[1]
    }
    return getHourMin(hour, min)
  }

  const businessAddress = () => {
    if (isCheckOut && business) {
      return business?.address
    }

    if (isOrderDetail) {
      return JSON.parse(AsyncStorage.getItem('business-address'))
    }

    return JSON.parse(AsyncStorage.getItem('user-customer'))
  }

  useEffect(() => {
    if (business?.address) {
      AsyncStorage.setItem(
        'business-address',
        JSON.stringify(business?.address)
      );
    }
  }, [business?.address])

  return (
    <OrderCreatingContainer>
      <OText size={20} style={{ ...styles.title }}>{t('WE_ARE_CREATING_YOUR_ORDER', 'We are creating your order!')}</OText>
      <OIcon
        url={theme.images.general.orderCreating}
        src={theme.images.general.orderCreating}
        cover
        height={314}
        style={{ ...styles.imageWrapper }}
      />
      <LocationWrapper>
        <SimpleIcon
          name='location-pin'
          size={20}
          color={theme.colors.primary}
          style={{ marginRight: 10 }}
        />
        <OText size={14}>{t('WE_ARE_CREATING_YOUR_ORDER', 'We are creating your order!')}</OText>
      </LocationWrapper>
      <DeliveryWrapper>
        <DeliveryContentWrapper>
          <SimpleIcon
            name='clock'
            size={20}
            color={theme.colors.primary}
            style={{ marginRight: 10 }}
          />
          <OText size={14}>{t('DELIVERY', 'Delivery')}</OText>
        </DeliveryContentWrapper>
        <View>
          <OText size={14} weight='700'>{t('DELIVERY', 'Delivery')}</OText>
        </View>
      </DeliveryWrapper>
      <View style={{ flexDirection: 'row', marginBottom: 27 }}>
        <OIcon
          src={theme.images.general.stripes}
          cover
          height={20}
          style={{ marginRight: 10 }}
        />
        <OText size={14}>{t('WE_ARE_CREATING_YOUR_ORDER', 'We are creating your order!')}</OText>
      </View>
      <DeliveryWrapper>
        <DeliveryContentWrapper>
          <OIcon
            src={business?.logo || theme.images.dummies.businessLogo}
            cover
            height={20}
            style={{ marginRight: 10 }}
          />
          <OText size={14}>{business?.name}</OText>
        </DeliveryContentWrapper>
        <View>
          <OText size={14} weight='700'>{getProducts()} {t('PRODUCT', 'products')}</OText>
        </View>
      </DeliveryWrapper>
    </OrderCreatingContainer>
  )
}