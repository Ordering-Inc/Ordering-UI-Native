import React, { useEffect, useState } from 'react'
import { OText, OButton, OIcon, OModal } from '../shared';
import { useLanguage, useOrder } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'
import { getIconCard } from '../../utils'

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
    isOrderDetail,
    businessLogo,
    cardData
  } = props

  const [, t] = useLanguage();
  const theme = useTheme()
  const [orderState] = useOrder()
  const [address, setAddress] = useState<any>(null)

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

  const getHourMin = (hour: any, min: any) => {
    let _hour
    if (hour < 12) {
      _hour = hour < 10 ? `0${hour}` : `${hour}`
    } else {
      _hour = (hour - 12) < 10 ? `0${hour - 12}` : `${hour - 12}`
    }
    const _min = min < 10 ? `0${min}` : `${min}`
    if (hour < 12) {
      return `${_hour} : ${_min} AM`
    } else {
      return `${_hour} : ${_min} PM`
    }
  }

  const parseDeliveryTime = () => {
    let hour = 0
    let min = 0
    if (orderState?.options?.type === 1 && cart) {
      if (cart?.business?.delivery_time) {
        hour = (cart?.business?.delivery_time).split(':')[0]
        min = (cart?.business?.delivery_time).split(':')[1]
      }
    }

    if (orderState?.options?.type === 2 && cart) {
      if (cart?.business?.pickup_time) {
        hour = (cart?.business?.pickup_time).split(':')[0]
        min = (cart?.business?.pickup_time).split(':')[1]
      }
    }
    return getHourMin(hour, min)
  }

  useEffect(() => {
    if (business?.address) {
      AsyncStorage.setItem(
        'business-address',
        business?.address
      );
      setAddress(business?.address)
    }
  }, [business?.address])

  useEffect(() => {
    const updateAddress = async () => {
      if (isOrderDetail) {
        try {
          const value = await AsyncStorage.getItem('business-address');
          setAddress(value)
        } catch {
          console.log('err')
        }
      }
    }
    updateAddress()
  }, [])

  return (
    <OrderCreatingContainer>
      <OText size={20} style={{ ...styles.title }}>
        {isCheckOut
          ? t('WE_ARE_CREATING_YOUR_ORDER', 'We are creating your order!')
          : t('WE_SUCCESSFULLY_CREATED', 'Order successfully created!')
        }
      </OText>
      <OIcon
        src={isCheckOut ? theme.images.general.orderCreating : theme.images.general.orderSuccess}
        cover
        height={314}
        style={{ ...styles.imageWrapper }}
      />
      {address !== null && (
        <LocationWrapper>
          <SimpleIcon
            name='location-pin'
            size={20}
            color={theme.colors.primary}
            style={{ marginRight: 10 }}
          />
          <OText size={14}>{address}</OText>
        </LocationWrapper>
      )}
      {cardData?.card?.brand && (
        <View style={{ flexDirection: 'row', marginBottom: 27 }}>
          {getIconCard(cardData?.card?.brand, 20)}
          <OText size={14} mLeft={10}>{cardData?.card?.brand} {cardData?.card?.last4}</OText>
        </View>
      )}
      {business && (
        <DeliveryWrapper>
          <DeliveryContentWrapper>
            <OIcon
              url={businessLogo || business?.logo}
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
      )}
    </OrderCreatingContainer>
  )
}
