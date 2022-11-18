import React, { useState } from 'react'
import { View, Animated, StyleSheet, Platform, TouchableOpacity } from 'react-native'
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


	const pickerStyle = StyleSheet.create({
		inputAndroid: {
			width: 34,
			textAlign: 'center',
			overflow: 'visible',
			fontSize: 12,
			height: 20,
			padding: 0,
			color: theme.colors.textNormal
		},
		inputIOS: {
			width: 34,
			textAlign: 'center',
			overflow: 'visible',
			fontSize: 12,
		},
		icon: {
			position: 'absolute',
			zIndex: 1,
			top: -4,
			end: -4,
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

	const handleEditProduct = (curProduct: any) => {
		if (!curProduct?.calendar_event) {
			onEditProduct && onEditProduct(curProduct)
			return
		}
		setIsServiceOpen(true)
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
		<>
			<AccordionSection>
				<Accordion
					isValid={product?.valid ?? true}
					onPress={() => (!product?.valid_menu && isCartProduct)
						? {}
						: setActiveState(!isActive)}
					activeOpacity={1}
				>
					<View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
						<ContentInfo>
							{(product?.images || theme?.images?.dummies?.product) && (
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
							): (
								<>
									{isCartProduct && !isCartPending && getProductMax && (
										<ProductInfo>
											<RNPickerSelect
												items={productOptions}
												onValueChange={handleChangeQuantity}
												value={product.quantity.toString()}
												style={pickerStyle}
												useNativeAndroidPickerStyle={false}
												placeholder={{}}
												Icon={() => <View style={pickerStyle.icon}><OIcon src={theme.images.general.arrow_down} color={theme.colors.textNormal} width={8} /></View>}
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
										<OText size={12} lineHeight={18} weight={'400'}>{product.name}</OText>
									</View>
								</>
							)}
							<View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end', maxWidth: 100 }}>
								<View style={{ flexDirection: 'row' }}>
									<OText size={12} lineHeight={18} weight={'400'}>{parsePrice(product.total || product.price)}</OText>
									{(productInfo().ingredients.length > 0 || productInfo().options.length > 0 || product.comment) && (
										<MaterialCommunityIcon name='chevron-down' size={18} />
									)}
								</View>
								<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
									{onEditProduct && isCartProduct && !isCartPending && product?.valid_menu && (
										<TouchableOpacity onPress={() => handleEditProduct(product)} style={{ marginEnd: 7 }}>
											<OIcon
												src={theme.images.general.pencil}
												width={16}
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
											<OIcon
												src={theme.images.general.trash}
												width={17}
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

				<View style={{ display: isActive ? 'flex' : 'none', paddingStart: 40 }}>
					<Animated.View>
						<AccordionContent>
							{productInfo().ingredients.length > 0 && productInfo().ingredients.some((ingredient: any) => !ingredient.selected) && (
								<ProductOptionsList>
									<OText size={10} color={theme.colors.textSecondary}>{t('INGREDIENTS', 'Ingredients')}</OText>
									{productInfo().ingredients.map((ingredient: any) => !ingredient.selected && (
										<OText size={10} color={theme.colors.textThird} key={ingredient.id} style={{ marginLeft: 10 }}>{t('NO', 'No')} {ingredient.name}</OText>
									))}
								</ProductOptionsList>
							)}
							{productInfo().options.length > 0 && (
								<ProductOptionsList>
									{productInfo().options.map((option: any, i: number) => (
										<ProductOption key={option.id + i}>
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
							{product.comment && (
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
