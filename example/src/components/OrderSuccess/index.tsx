import React from 'react'
import { OText, OButton, OIcon, OModal } from '../shared';
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { StyleSheet, View } from 'react-native'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'

import {
  OrderSuccessContainer,
  LocationWrapper,
  DeliveryWrapper,
  DeliveryContentWrapper
} from './styles'

export const OrderSuccess = () => {
  const [, t] = useLanguage();
  const theme = useTheme()

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

  return (
    <OrderSuccessContainer>
      <OText size={20} style={{ ...styles.title }}>{t('ORDER_SUCCESSFULLY_CREATED', 'Order successfully created!')}</OText>
      <OIcon
        url={theme.images.general.orderSuccess}
        src={theme.images.general.orderSuccess}
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
          <SimpleIcon
            name='clock'
            size={20}
            color={theme.colors.primary}
            style={{ marginRight: 10 }}
          />
          <OText size={14}>Business name</OText>
        </DeliveryContentWrapper>
        <View>
          <OText size={14} weight='700'>3products</OText>
        </View>
      </DeliveryWrapper>
    </OrderSuccessContainer>
  )
}
