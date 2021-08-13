import React from 'react'
import { useLanguage, useConfig, useOrder, useUtils } from 'ordering-components/native'
import { SingleProductCardParams } from '../../types'
import {
	CardContainer,
	CardInfo,
	SoldOut
} from './styles'
import { ImageBackground, StyleSheet, TextStyle, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OText, OIcon } from '../shared'

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
			borderWidth: 1,
			borderRadius: 7.6,
			borderColor: theme.colors.backgroundGray300,
			marginBottom: 24,
			minHeight: 115,
		},
		textStyle: {
			flex: 1,
		},
		soldOutBackgroundStyle: {
			position: 'absolute',
			height: 115,
			top: 0,
			start: 0,
			end: 0,
			backgroundColor: '#19191966',
			borderRadius: 7.6
		},
		soldOutTextStyle: {
			textTransform: 'uppercase'
		},
		productStyle: {
			width: 115,
			height: 115,
			borderTopEndRadius: 7.6,
			borderBottomEndRadius: 7.6,
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
		<CardContainer style={styles.container}
			onPress={() => onProductClick(product)}
			activeOpacity={0.8}
		>
			<CardInfo>
				<OText numberOfLines={1} ellipsizeMode='tail' style={{ ...styles.textStyle, ...theme.labels.middle } as TextStyle}>{product?.name}</OText>
				<OText color={theme.colors.textSecondary} numberOfLines={2} ellipsizeMode='tail' style={{ ...styles.textStyle, ...theme.labels.normal } as TextStyle}>{product?.description}</OText>
				<OText color={theme.colors.textThird} style={theme.labels.normal as TextStyle}>{parsePrice(product?.price)}</OText>
			</CardInfo>
			<ImageBackground source={{ uri: optimizeImage(product?.images, 'h_200,c_limit') }} style={{ width: 115, height: 115, borderRadius: 7.6, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, overflow: 'hidden' }} />

			{(isSoldOut || maxProductQuantity <= 0) && (
				<View style={styles.soldOutBackgroundStyle}>
					<SoldOut>
						<OText weight={'bold'} color={theme.colors.white} style={styles.soldOutTextStyle}>{t('SOLD_OUT', 'SOLD OUT')}</OText>
					</SoldOut>
				</View>
			)}
		</CardContainer>
	)
}
