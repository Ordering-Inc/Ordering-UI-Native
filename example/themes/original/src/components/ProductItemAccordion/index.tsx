import React, { useEffect, useState } from 'react'
import { View, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { useUtils, useLanguage, useOrder } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNPickerSelect from 'react-native-picker-select'
import { ServiceForm } from '../ServiceForm';
import FastImage from 'react-native-fast-image'

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
import { OIcon, OText, OAlert, OModal } from '../shared'

import { ProductItemAccordionParams } from '../../types'

export const ProductItemAccordion = (props: ProductItemAccordionParams) => {

	const {
		isDisabledEdit,
		isCartPending,
		isCartProduct,
		product,
		changeQuantity,
		getProductMax,
		onDeleteProduct,
		onEditProduct,
		isFromCheckout,
	} = props

	const theme = useTheme();
	const hideProductImage = isFromCheckout
		? theme?.checkout?.components?.cart?.components?.product?.components?.image?.hidden
		: theme?.confirmation?.components?.cart?.components?.products?.components?.photo?.hidden

	const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden
	const hideProductCommentHide = isFromCheckout && theme?.checkout?.components?.cart?.components?.product?.components?.comments?.hidden

	const pickerStyle = StyleSheet.create({
		inputAndroid: {
			width: 45,
			textAlign: 'center',
			overflow: 'visible',
			fontSize: 12,
			height: 30,
			color: theme.colors.textNormal,
			backgroundColor: theme.colors.backgroundGray100,
			paddingVertical: 8,
			paddingRight: 10,
			paddingLeft: 0,
			borderRadius: 7.6,
		},
		inputIOS: {
			width: 45,
			textAlign: 'center',
			overflow: 'visible',
			fontSize: 12,
			backgroundColor: theme.colors.backgroundGray100,
			paddingVertical: 8,
			paddingRight: 15,
			paddingLeft: 0,
			borderRadius: 7.6,
		},
		icon: {
			position: 'absolute',
			zIndex: 1,
			top: 0,
			end: 8,
		},
		placeholder: {
			color: theme.colors.secundaryContrast
		},
	})


	const [, t] = useLanguage()
	const [orderState] = useOrder()
	const [{ parsePrice, optimizeImage, parseDate }] = useUtils()

	const [isActive, setActiveState] = useState(false)
	const [isServiceOpen, setIsServiceOpen] = useState(false)
	const [productQuantityState, setProductQuantityState] = useState<any>(product.quantity.toString())

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

	const handleEditProduct = (curProduct: any) => {
		if (!curProduct?.calendar_event) {
			onEditProduct && onEditProduct(curProduct)
			return
		}
		setIsServiceOpen(true)
	}

	const handleChangeQuantity = (value: string) => {
		if (!orderState.loading) {
			setProductQuantityState(value)
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

	const productOptions = getProductMax && [...Array(getProductMax(product) + 1),].map((_: any, opt: number) => {
		return {
			label: opt === 0 ? t('REMOVE', 'Remove') : opt.toString(),
			value: opt.toString()
		}
	})

	useEffect(() => {
		if (product.quantity.toString() === productQuantityState || productQuantityState) {
			setProductQuantityState(null)
		}
	}, [product.quantity])

	return (
		<>
			<AccordionSection>
				<Accordion
					activeOpacity={1}
					isValid={product?.valid ?? true}
					onPress={
						(!product?.valid_menu && isCartProduct) ||
						!(productInfo().ingredients.length > 0 || productInfo().options.length > 0 || !!product.comment)
						? null : () => setActiveState(!isActive)
					}
				>
					<View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
						<ContentInfo>
							{(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)) && !hideProductImage && (
								<ProductImage>
									{isFromCheckout ? (
										product?.images ? (
											<FastImage
												style={{ ...styles.productImage, ...{ width: 82, height: 82 } }}
												source={{
													uri: optimizeImage(product?.images, 'h_100,c_limit'),
													priority: FastImage.priority.normal,
												}}
												resizeMode={FastImage.resizeMode.cover}
											/>
										) : (
											<OIcon
												src={theme?.images?.dummies?.product}
												style={{ ...styles.productImage, ...{ width: 82, height: 82 } }}
											/>
										)
									) : (
										product?.images ? (
											<FastImage
												style={styles.productImage}
												source={{
													uri: optimizeImage(product?.images, 'h_100,c_limit'),
													priority: FastImage.priority.normal,
												}}
												resizeMode={FastImage.resizeMode.cover}
											/>
										) : (
											<OIcon
												src={theme?.images?.dummies?.product}
												style={styles.productImage}
											/>
										)
									)}
								</ProductImage>
							)}
							{!!product?.calendar_event ? (
								<View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
									<View>
										<OText size={12} lineHeight={18} weight={'400'} numberOfLines={1}>{product?.name}</OText>
									</View>
									<OText size={10} color={theme.colors.textSecondary} style={{ marginTop: 3 }}>
										{parseDate(product?.calendar_event?.start, { outputFormat: 'hh:mm a' })} - {parseDate(product?.calendar_event?.end, { outputFormat: 'hh:mm a' })}
									</OText>
								</View>
							) : (
								<>
									{!isDisabledEdit && isCartProduct && !isCartPending && getProductMax && (
										<ProductInfo>
											<RNPickerSelect
												items={productOptions}
												onValueChange={handleChangeQuantity}
												value={productQuantityState ?? product.quantity.toString()}
												style={pickerStyle}
												useNativeAndroidPickerStyle={false}
												placeholder={{}}
												touchableWrapperProps={{ style: { width: 45 } }}
												Icon={() => (
													<View style={pickerStyle.icon}>
														<OIcon
															src={theme.images.general.arrow_down}
															color={theme.colors.textNormal}
															width={8}
														/>
													</View>
												)}
												disabled={orderState.loading}
											/>
										</ProductInfo>
									)}
									{isFromCheckout && (
										<ProductQuantity>
											<OText size={12} lineHeight={18}>
												{product?.quantity}
											</OText>
										</ProductQuantity>
									)}
									<View style={{ flex: 1 }}>
										<OText size={12} lineHeight={18} weight={'400'} mLeft={8}>{product.name}</OText>
									</View>
								</>
							)}
							<View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end', maxWidth: 100 }}>
								<View style={{ flexDirection: 'row' }}>
									<OText size={12} lineHeight={18} weight={'400'}>{parsePrice(product.total || product.price)}</OText>
									{(productInfo().ingredients.length > 0 || productInfo().options.length > 0 || !!product.comment) && (
										<MaterialCommunityIcon name='chevron-down' size={18} />
									)}
								</View>
								<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', height: 20 }}>
									{!isDisabledEdit && onEditProduct && isCartProduct && !isCartPending && product?.valid_menu && (
										<TouchableOpacity onPress={() => handleEditProduct(product)} style={{ marginRight: 5 }}>
											<MaterialCommunityIcon
												name='pencil-outline'
												size={20}
												color={theme.colors.textSecondary}
											/>
										</TouchableOpacity>
									)}
									{onDeleteProduct && isCartProduct && !isCartPending && (
										<OAlert
											title={t('DELETE_PRODUCT', 'Delete Product')}
											message={t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?')}
											onAccept={() => onDeleteProduct(product)}
										>
											<MaterialCommunityIcon
												name='trash-can-outline'
												size={20}
												color={theme.colors.textSecondary}
											/>
										</OAlert>
									)}
								</View>
							</View>
						</ContentInfo>
					</View>
					{((isCartProduct && !isCartPending && product?.valid_menu && !product?.valid_quantity) ||
						(!product?.valid_menu && isCartProduct && !isCartPending)) && (
							<View style={{ alignItems: 'flex-end', width: '100%', }}>
								<OText size={14} color={theme.colors.red} style={{ textAlign: 'right', marginTop: 5 }}>
									{t('NOT_AVAILABLE', 'Not available')}
								</OText>
							</View>
						)}
				</Accordion>

				<View style={{ display: isActive ? 'flex' : 'none', paddingStart: isFromCheckout ? 100 : 40, marginTop: isFromCheckout ? -80 : -30 }}>
					<Animated.View>
						<AccordionContent>
							{productInfo().ingredients.length > 0 && productInfo().ingredients.some((ingredient: any) => !ingredient.selected) && (
								<ProductOptionsList>
									<OText size={10} color={theme.colors.textSecondary}>{t('INGREDIENTS', 'Ingredients')}</OText>
									{productInfo().ingredients.map((ingredient: any, i) => !ingredient.selected && (
										<OText size={10} color={theme.colors.textThird} key={ingredient.id + i} style={{ marginLeft: 10 }}>{t('NO', 'No')} {ingredient.name}</OText>
									))}
								</ProductOptionsList>
							)}
							{productInfo().options.length > 0 && (
								<ProductOptionsList>
									{productInfo().options.sort((a: any, b: any) => a.rank - b.rank).map((option: any) => (
										<ProductOption key={option.id}>
											<OText size={10} color={theme.colors.textSecondary}>{option.name}</OText>
											{option.suboptions.map((suboption: any) => (
												<ProductSubOption key={suboption.id}>
													<OText size={10} color={theme.colors.textThird}>
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
							{!!product.comment && !hideProductCommentHide && (
								<ProductComment>
									<OText size={10} color={theme.colors.textSecondary}>{t('SPECIAL_COMMENT', 'Special Comment')}</OText>
									<OText size={10} color={theme.colors.textThird}>{product.comment}</OText>
								</ProductComment>
							)}
						</AccordionContent>
					</Animated.View>
				</View>
			</AccordionSection>
			<OModal
				open={isServiceOpen}
				onClose={() => setIsServiceOpen(false)}
				entireModal
			>
				<ServiceForm
					isCartProduct
					isService
					businessId={product?.business_id}
					categoryId={product?.category_id}
					productId={product?.id}
					productCart={product}
					onSave={() => setIsServiceOpen(false)}
					onClose={() => setIsServiceOpen(false)}
					professionalSelected={product?.calendar_event?.professional}
				/>
			</OModal>
		</>
	)
}

const styles = StyleSheet.create({
	productImage: {
		borderRadius: 7.6,
		width: 48,
		height: 48
	},
	test: {
		overflow: 'hidden',
	}
})
