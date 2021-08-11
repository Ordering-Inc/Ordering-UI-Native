import React, { useState } from 'react'
import { View, Animated, StyleSheet, Platform, I18nManager, TouchableOpacity } from 'react-native'
import { useUtils, useLanguage, useOrder } from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNPickerSelect from 'react-native-picker-select'

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
		isExpanded
	} = props

	const theme = useTheme();

	const pickerStyle = StyleSheet.create({
		inputAndroid: {
			color: theme.colors.textPrimary,
			borderWidth: 1,
			borderColor: theme.colors.border,
			borderRadius: 3,
			paddingHorizontal: 4,
			backgroundColor: theme.colors.white,
			height: 30,
			fontSize: 10
		},
		inputIOS: {
			color: theme.colors.textPrimary,
			height: 30,
			borderWidth: 1,
			borderColor: theme.colors.border,
			borderRadius: 3,
			paddingHorizontal: 4,
			backgroundColor: theme.colors.white,
			fontSize: 10,
			textAlign: 'center'
		},
		icon: {
			top: Platform.OS === 'ios' ? 10 : 15,
			right: Platform.OS === 'ios' ? 0 : (I18nManager.isRTL ? 30 : 7),
			position: 'absolute',
			fontSize: 20
		},
		placeholder: {
			color: theme.colors.secundaryContrast,
		}
	})

	const [, t] = useLanguage()
	const [orderState] = useOrder()
	const [{ parsePrice }] = useUtils()

	const [isActive, setActiveState] = useState(isExpanded)

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
				onPress={() => (!product?.valid_menu && isCartProduct) || isExpanded
					? {}
					: setActiveState(!isActive)}
				activeOpacity={1}
			>
				{product?.images && (
					<ProductImage>
						<OIcon
							url={product?.images}
							style={styles.productImage}
						/>
					</ProductImage>
				)}
				<ContentInfo>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<OText style={{ ...theme.labels.small, flexWrap: 'wrap', flex: 1, paddingEnd: 6 }} color={theme.colors.textPrimary}>{product.name}</OText>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<ProductInfo>
								{isCartProduct && !isCartPending && getProductMax ? (
									<RNPickerSelect
										items={productOptions}
										onValueChange={handleChangeQuantity}
										value={product.quantity.toString()}
										style={pickerStyle}
										useNativeAndroidPickerStyle={false}
										placeholder={{}}
										disabled={orderState.loading}
									/>
								) : (
									<ProductQuantity>
										<OText style={theme.labels.small} color={theme.colors.textPrimary}>
											{product?.quantity + ' x'}
										</OText>
									</ProductQuantity>
								)}
							</ProductInfo>
							<View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 50, justifyContent: 'flex-end' }}>
								<OText style={theme.labels.small} color={theme.colors.textPrimary}>{parsePrice(product.total || product.price)}</OText>
								{(productInfo().ingredients.length > 0 || productInfo().options.length > 0 || product.comment) && (
									<>
										{!isExpanded && <MaterialCommunityIcon name='chevron-down' size={18} />}
									</>
								)}
							</View>
						</View>
					</View>
					<AccordionContent style={{ display: isActive ? 'flex' : 'none', width: '80%' }}>
						<Animated.View>
							{productInfo().ingredients.length > 0 && productInfo().ingredients.some((ingredient: any) => !ingredient.selected) && (
								<ProductOptionsList>
									<OText style={theme.labels.small} color={theme.colors.textSecondary}>{t('INGREDIENTS', 'Ingredients')}</OText>
									{productInfo().ingredients.map((ingredient: any) => !ingredient.selected && (
										<OText style={theme.labels.small} color={theme.colors.textSecondary} key={ingredient.id}>{t('NO', 'No')} {ingredient.name}</OText>
									))}
								</ProductOptionsList>
							)}
							{productInfo().options.length > 0 && (
								<ProductOptionsList>
									{productInfo().options.map((option: any, i: number) => (
										<ProductOption key={option.id + i}>
											<OText style={theme.labels.small} color={theme.colors.textSecondary}>{option.name}</OText>
											{option.suboptions.map((suboption: any) => (
												<ProductSubOption key={suboption.id}>
													<OText style={theme.labels.small} color={theme.colors.textSecondary}>
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
									<OText style={theme.labels.small} color={theme.colors.textThird}>{t('SPECIAL_COMMENT', 'Special Comment')}</OText>
									<OText style={theme.labels.small} color={theme.colors.textThird}>{product.comment}</OText>
								</ProductComment>
							)}
						</Animated.View>
					</AccordionContent>
					<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 7 }}>
						{onEditProduct && isCartProduct && !isCartPending && product?.valid_menu && (

							<TouchableOpacity onPress={() => onEditProduct(product)} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<OIcon
									src={theme.images.general.edit}
									width={16}
									color={theme.colors.primary}
								/>
								<OText style={{ ...theme.labels.small, marginStart: 4, marginEnd: 12 }} color={theme.colors.textSecondary}>{t('EDIT', 'Edit')}</OText>
							</TouchableOpacity>
						)}
						{onDeleteProduct && isCartProduct && !isCartPending && (
							<OAlert
								title={t('DELETE_PRODUCT', 'Delete Product')}
								message={t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?')}
								onAccept={() => onDeleteProduct(product)}
							>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<OIcon
										src={theme.images.general.trash}
										width={16}
										color={theme.colors.primary}
									/>
									<OText style={{ ...theme.labels.small, marginStart: 4 }} color={theme.colors.textSecondary}>{t('REMOVE', 'Remove')}</OText>
								</View>
							</OAlert>
						)}
					</View>
				</ContentInfo>

				{((isCartProduct && !isCartPending && product?.valid_menu && !product?.valid_quantity) ||
					(!product?.valid_menu && isCartProduct && !isCartPending)) && (
						<OText size={24} color={theme.colors.red} style={{ textAlign: 'center', marginTop: 10 }}>
							{t('NOT_AVAILABLE', 'Not available')}
						</OText>
					)}

			</Accordion>

		</AccordionSection>
	)
}

const styles = StyleSheet.create({
	productImage: {
		borderRadius: 3,
		width: 42,
		height: 42
	}
})
