import React from 'react'
import { useLanguage, useConfig, useOrder, useUtils } from 'ordering-components/native'
import { SingleProductCardParams } from '../../types'
import {
  CardContainer,
  CardInfo,
  SoldOut
} from './styles'
import { StyleSheet } from 'react-native'
import { OText, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'

export const SingleProductCard = (props: SingleProductCardParams) => {
  const {
    businessId,
    product,
    isSoldOut,
    onProductClick
  } = props

  const theme = useTheme();

  const styles = StyleSheet.create({
    textStyle: {
      flex: 1,
      textAlign: 'left'
    },
    soldOutBackgroundStyle: {
      backgroundColor: '#B8B8B8',
    },
    soldOutTextStyle : {
      textTransform: 'uppercase'
    },
    productStyle: {
      width: 80,
      height: 80
    }
  })

  const [, t] = useLanguage()
  const [stateConfig] = useConfig()
  const [{ parsePrice, optimizeImage }] = useUtils()
  const [orderState] = useOrder()

  const editMode = typeof product?.code !== 'undefined'

  const removeToBalance = editMode ? product?.quantity : 0
  const cart = orderState.carts[`businessId:${businessId}`]
  const productCart = cart?.products?.find((prod: any) => prod.id === product?.id)
  const totalBalance = (productCart?.quantity || 0) - removeToBalance

  const maxCartProductConfig = (stateConfig.configs.max_product_amount ? parseInt(stateConfig.configs.max_product_amount) : 100) - totalBalance

  const productBalance = (cart?.products?.reduce((sum: any, _product: any) => sum + (product && _product.id === product?.id ? _product.quantity : 0), 0) || 0) - removeToBalance
  let maxCartProductInventory = (product?.inventoried ? product?.quantity : undefined) - productBalance
  maxCartProductInventory = !isNaN(maxCartProductInventory) ? maxCartProductInventory : maxCartProductConfig

  const maxProductQuantity = Math.min(maxCartProductConfig, maxCartProductInventory)

  return (
    <CardContainer style={[(isSoldOut || maxProductQuantity <= 0) && styles.soldOutBackgroundStyle]}
      onPress={() => onProductClick(product)}
    >
      <CardInfo>
        <OText weight={500} numberOfLines={1} ellipsizeMode='tail' style={styles.textStyle}>{product?.name}</OText>
        <OText
          size={12}
          numberOfLines={2}
          ellipsizeMode='tail'
          color={theme.colors.gray}
          style={{ ...styles.textStyle, paddingVertical: 6 }}
        >
          {product?.description}
        </OText>
        <OText color={theme.colors.primary}>{parsePrice(product?.price)}</OText>
      </CardInfo>
      <OIcon
        url={optimizeImage(product?.images, 'h_200,c_limit')}
        style={styles.productStyle}
      />
      {(isSoldOut || maxProductQuantity <= 0) && (
        <SoldOut>
          <OText weight='bold' style={styles.soldOutTextStyle}>{t('SOLD_OUT', 'SOLD OUT')}</OText>
        </SoldOut>
      )}
    </CardContainer>
  )
}
