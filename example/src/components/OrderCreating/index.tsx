import React from 'react'
import { OText, OButton, OIcon, OModal } from '../shared';
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { StyleSheet } from 'react-native'

import {
  OrderCreatingContainer
} from './styles'

export const OrderCreating = () => {
  const [, t] = useLanguage();
  const theme = useTheme()

  const styles = StyleSheet.create({
    imageWrapper: {
      width: '100%',
    },
  });

  return (
    <OrderCreatingContainer>
      <OText size={18}>{t('WE_ARE_CREATING_YOUR_ORDER', 'We are creating your order!')}</OText>
      <OIcon
        url={theme.images.general.orderCreating}
        src={theme.images.general.orderCreating}
        cover
        height={314}
        style={{ ...styles.imageWrapper }}
      />
    </OrderCreatingContainer>
  )
}