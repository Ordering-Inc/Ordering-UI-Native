import React, { useState } from 'react'
import { View, Animated, StyleSheet, Platform, I18nManager, TextStyle, TouchableOpacity } from 'react-native'
import { useUtils, useLanguage, useOrder } from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNPickerSelect from 'react-native-picker-select'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {
	Accordion,
	AccordionSection,
	ProductInfo,
	ProductQuantity,
	ContentInfo,
	ProductImage,
	AccordionContent,
	ProductOptionsList,
	ProductOption,
	ProductSubOption,
	ProductComment
} from './styles'
import { OIcon, OText, OAlert } from '../shared'

import { ProductItemAccordionParams } from '../../types'
import { useTheme } from 'styled-components/native'

export const ProductItemAccordion = (props: ProductItemAccordionParams) => {

	const {
		isCartPending,
		isCartProduct,
		product,
		changeQuantity,
		getProductMax,
		onDeleteProduct,
		onEditProduct,
		isMini
		// isFromCheckout,
	} = props
	const theme = useTheme();

	const pickerStyle = StyleSheet.create({
		inputAndroid: {
			color: theme.colors.secundaryContrast,
			borderWidth: 1,
			borderColor: 'transparent',
			borderRadius: 15,
			backgroundColor: theme.colors.inputDisabled,
			width: 50,
		},
		inputIOS: {
			color: theme.colors.white,
			height: 24,
			width: 24,
			borderWidth: 1,
			borderColor: 'transparent',
			borderRadius: 15,
			backgroundColor: theme.colors.black,
			textAlign: 'center',
			paddingEnd: 6
		},
		icon: {
			top: Platform.OS === 'ios' ? 4 : 0,
			right: I18nManager.isRTL ? 16 : 5,
			position: 'absolute',
		},
		placeholder: {
			color: theme.colors.secundaryContrast,
		}
	})

	const [, t] = useLanguage()
	const [orderState] = useOrder()
	const [{ parsePrice }] = useUtils()

	const [isActive, setActiveState] = useState(false)
	// const [setHeight, setHeightState] = useState({ height: new Animated.Value(0) })
	// const [setRotate, setRotateState] = useState({ angle: new Animated.Value(0) })

	const productInfo = () => {
		if (isCartProduct) {
			const ingredients = JSON.parse(JSON.stringify(Object.values(product.ingredients ?? {})))
			let options = JSON.parse(JSON.stringify(Object.values(product.options ?? {})))

			options = options.map((option: any) => {
				option.suboptions = Object.values(option.suboptions ?? {})
				return option
			})
			return {
				...productInfo,
				ingredients,
				options
			}
		}
		return product
	}

	/* const toggleAccordion = () => {
		if ((!product?.valid_menu && isCartProduct)) return
		if (isActive) {
			Animated.timing(setHeight.height, {
			 toValue: 100,
			 duration: 500,
			 easing: Easing.linear,
			 useNativeDriver: false,
			}).start()
		} else {
			setHeightState({height: new Animated.Value(0)})
		}
	 }*/

	const handleChangeQuantity = (value: string) => {
		if (!orderState.loading) {
			if (parseInt(value) === 0) {
				onDeleteProduct && onDeleteProduct(product)
			} else {
				changeQuantity && changeQuantity(product, parseInt(value))
			}
		}
	}

	const getFormattedSubOptionName = ({ quantity, name, position, price }: { quantity: number, name: string, position: string, price: number }) => {
		const pos = position ? `(${position})` : ''
		return `${quantity} x ${name} ${pos} +${price}`
	}

	/*useEffect(() => {
		toggleAccordion()
	}, [isActive])*/

	const productOptions = getProductMax && [...Array(getProductMax(product) + 1),].map((_: any, opt: number) => {
		return {
			label: opt === 0 ? t('REMOVE', 'Remove') : opt.toString(),
			value: opt.toString()
		}
	})

	return (
		<AccordionSection>
			<Accordion
				isValid={product?.valid ?? true}
				onPress={() => (!product?.valid_menu && isCartProduct)
					? {}
					: setActiveState(!isActive)}
				activeOpacity={1}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<ProductInfo>
						{isCartProduct && !isCartPending && getProductMax && !isMini && (
							<RNPickerSelect
								items={productOptions}
								onValueChange={handleChangeQuantity}
								value={product.quantity.toString()}
								style={pickerStyle}
								useNativeAndroidPickerStyle={false}
								placeholder={{}}
								Icon={() => <OText color={theme.colors.white} size={12} style={pickerStyle.icon}>{'x'}</OText>}
								disabled={orderState.loading}
							/>
						)}
					</ProductInfo>
					<ContentInfo>
						{product?.images && !isMini && (
							<ProductImage>
								<OIcon url={product?.images} style={styles.productImage} />
							</ProductImage>
						)}
						<View style={{ flex: 1, flexDirection: isMini ? 'row' : 'column', justifyContent: 'space-between', alignItems: isMini ? 'center' : 'flex-start' }}>
							{isMini && (
								<ProductQuantity>
									<OText size={12} weight={'600'}>
										{product?.quantity}x
									</OText>
								</ProductQuantity>
							)}
							<OText style={{ ...theme.labels.normal, width: isMini ? '60%' : '100%' } as TextStyle}>{product.name}</OText>
							{!isMini && (
								<Animated.View>
									<AccordionContent>
										{productInfo().ingredients.length > 0 && productInfo().ingredients.some((ingredient: any) => !ingredient.selected) && (
											<ProductOptionsList>
												<OText style={theme.labels.small as TextStyle} color={theme.colors.textSecondary}>{t('INGREDIENTS', 'Ingredients')}</OText>
												{productInfo().ingredients.map((ingredient: any) => !ingredient.selected && (
													<OText key={ingredient.id} color={theme.colors.textSecondary} style={{ ...theme.labels.small, marginLeft: 10 } as TextStyle}>{t('NO', 'No')} {ingredient.name}</OText>
												))}
											</ProductOptionsList>
										)}
										{productInfo().options.length > 0 && (
											<ProductOptionsList>
												{productInfo().options.map((option: any, i: number) => (
													<ProductOption key={option.id + i}>
														<OText color={theme.colors.textSecondary} style={theme.labels.small as TextStyle}>{option.name}</OText>
														{option.suboptions.map((suboption: any) => (
															<ProductSubOption key={suboption.id}>
																<OText color={theme.colors.textSecondary} style={theme.labels.small as TextStyle}>
																	{getFormattedSubOptionName({
																		quantity: suboption.quantity,
																		name: suboption.name,
																		position: (suboption.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
																		price: parsePrice(suboption.price)
																	})}
																</OText>
															</ProductSubOption>
														))}
													</ProductOption>
												))}
											</ProductOptionsList>
										)}
										{product.comment && (
											<ProductComment>
												<OText color={theme.colors.textSecondary} style={theme.labels.small as TextStyle}>{t('SPECIAL_COMMENT', 'Special Comment')}</OText>
												<OText color={theme.colors.textSecondary} style={theme.labels.small as TextStyle}>{product.comment}</OText>
											</ProductComment>
										)}
									</AccordionContent>
								</Animated.View>
							)}
							<View style={{ ...styles.actions, justifyContent: isMini ? 'flex-end' : 'space-between' }}>
								<OText style={{ ...theme.labels.normal } as TextStyle}>{parsePrice(product.total || product.price)}</OText>
								{isCartProduct && !isCartPending && (
									<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 12 }}>
										{onEditProduct && product?.valid_menu && (
											<TouchableOpacity onPress={() => onEditProduct(product)} style={{ marginEnd: 8 }}>
												<OIcon src={isMini ? theme.images.general.pencil_line : theme.images.general.pencil} width={isMini ? 10 : 16} color={theme.colors.textPrimary} />
											</TouchableOpacity>
										)}
										{onDeleteProduct && (
											<OAlert
												title={t('DELETE_PRODUCT', 'Delete Product')}
												message={t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?')}
												onAccept={() => onDeleteProduct(product)}
											>
												<OIcon src={isMini ? theme.images.general.close : theme.images.general.trash} width={isMini ? 7 : 16} color={theme.colors.textPrimary} />
											</OAlert>
										)}
									</View>
								)}
							</View>

						</View>

					</ContentInfo>
				</View>

				{((isCartProduct && !isCartPending && product?.valid_menu && !product?.valid_quantity) ||
					(!product?.valid_menu && isCartProduct && !isCartPending)) && (
						<OText size={24} color={theme.colors.red} style={{ textAlign: 'center', marginTop: 10 }}>
							{t('NOT_AVAILABLE', 'Not available')}
						</OText>
					)}
			</Accordion>

			<View style={{}}>

			</View>
		</AccordionSection>
	)
}

const styles = StyleSheet.create({
	productImage: {
		borderRadius: 7.6,
		width: 53,
		height: 53
	},
	actions: { width: '100%', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between' }
})
