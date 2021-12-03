import React, {useEffect} from 'react'
import { useLanguage, useConfig, useOrder, useUtils } from 'ordering-components/native'
import { SingleProductCardParams } from '../../types'
import {
  CardContainer,
  CardInfo,
  SoldOut
} from './styles'
import { StyleSheet, TouchableOpacity } from 'react-native'
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
    container: {
      marginBottom: 15,
    },
    textStyle: {
      flex: 1,
    },
    soldOutTextStyle : {
      textTransform: 'capitalize',
      color: 'white',
      fontSize: 12,
      lineHeight: 18
    },
    productStyle: {
      width: 100,
      height: 100,
      borderRadius: 3,
		  marginTop: 5
    },
	 addBtn: {
		 position: 'absolute',
		 top: 0,
		 end: 9,
		 padding: 4
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

  useEffect(() => {
    
  }, [product]);

  return (
    <CardContainer style={styles.container}
      onPress={() => onProductClick(product)}
		activeOpacity={0.8}
    >
      <OIcon
        url={optimizeImage(product?.images, 'h_200,c_limit')}
        src={!product?.images && theme.images.dummies.product}
        style={{...styles.productStyle, opacity: (isSoldOut || maxProductQuantity <= 0) ? 0.4 : 1}}
      />
      <CardInfo>
        <OText color={theme.colors.textPrimary} style={{...theme.labels.normal, marginTop: 9}}>{parsePrice(product?.price)}</OText>
        <OText numberOfLines={1} ellipsizeMode='tail' style={{...styles.textStyle, ...theme.labels.small}}>{product?.name}</OText>
        <OText color={theme.colors.textSecondary} size={9} numberOfLines={2} ellipsizeMode='tail' style={{...styles.textStyle, ...theme.labels.small}}>{product?.description}</OText>
      </CardInfo>

		<TouchableOpacity style={styles.addBtn} onPress={() => onProductClick(product)} activeOpacity={0.7}>
			<OIcon src={theme.images.general.plus_circle} />
		</TouchableOpacity>

      {(isSoldOut || maxProductQuantity <= 0) && (
        <SoldOut>
          <OText size={10} style={styles.soldOutTextStyle}>{t('SOLD_OUT', 'SOLD OUT')}</OText>
        </SoldOut>
      )}
    </CardContainer>
  )
}
