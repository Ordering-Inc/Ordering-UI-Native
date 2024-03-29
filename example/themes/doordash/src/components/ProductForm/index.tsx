import React, { useState, useRef, useEffect } from 'react'
import {
	ProductForm as ProductOptions,
	useSession,
	useLanguage,
	useOrder,
	useUtils
} from 'ordering-components/native'
import { ProductIngredient } from '../ProductIngredient'
import { ProductOption } from '../ProductOption'
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, I18nManager, TextStyle, Platform, KeyboardAvoidingView, Keyboard } from 'react-native'
import {
	ProductHeader,
	WrapHeader,
	TopHeader,
	WrapContent,
	ProductTitle,
	ProductDescription,
	ProductEditions,
	SectionTitle,
	WrapperIngredients,
	WrapperSubOption,
	ProductComment,
	ProductActions
} from './styles'
import { useTheme } from 'styled-components/native'
import { OButton, OIcon, OInput, OText } from '../shared'
import { ProductOptionSubOption } from '../ProductOptionSubOption'
import { NotFoundSource } from '../NotFoundSource'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width

export const ProductOptionsUI = (props: any) => {
	const {
		navigation,
		editMode,
		isSoldOut,
		productCart,
		increment,
		decrement,
		showOption,
		maxProductQuantity,
		errors,
		handleSave,
		handleChangeIngredientState,
		handleChangeSuboptionState,
		handleChangeCommentState,
		productObject,
		onClose,
		isFromCheckout,
		businessSlug
	} = props
	const theme = useTheme();

	const styles = StyleSheet.create({
		mainContainer: {
			flex: 1,
			height: windowHeight
		},
		headerItem: {
			overflow: 'hidden',
			borderRadius: 50,
			backgroundColor: '#CCCCCC80',
			width: 35,
			margin: 15
		},
		optionContainer: {
			marginBottom: 20
		},
		comment: {
			borderRadius: 7.6,
			height: 92,
			alignItems: 'flex-start',
			backgroundColor: theme.colors.backgroundGray
		},
		quantityControl: {
			flexDirection: 'row',
			width: '30%',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		btnBackArrow: {
			borderWidth: 0,
			color: '#FFF',
			backgroundColor: 'rgba(0,0,0,0.3)',
			borderRadius: 24,
			marginRight: 15,
		},
		productHeaderSkeleton: {
			flexDirection: 'row',
			width: '100%',
			position: 'relative',
			maxHeight: 260,
			height: 260,
			resizeMode: 'cover',
			minHeight: 200,
			zIndex: 0
		},
		closeButton: { width: 11, height: 32, backgroundColor: theme.colors.white, alignItems: 'center', justifyContent: 'center' },
		quantityWrap: { width: 40, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 7.6, backgroundColor: theme.colors.inputDisabled },
		productTagWrapper: {
			flexDirection: 'row',
			alignItems: 'center'
		  },
		productTagImageStyle: {
			width: 32,
			height: 32,
			borderRadius: 8,
			resizeMode: 'cover'
		},
		productTagNameStyle: {
			paddingHorizontal: 6,
			marginRight: 5
		}
	})
	const [{ optimizeImage, parsePrice }] = useUtils()
	const [, t] = useLanguage()
	const [orderState] = useOrder()
	const [{ auth }] = useSession()
	const { product, loading, error } = productObject
	const { bottom } = useSafeAreaInsets();
	const [commentY, setCommentY] = useState(0)
	const productFormRef = useRef<any>()
	const isError = (id: number) => {
		let bgColor = theme.colors.white
		if (errors[`id:${id}`]) {
			bgColor = 'rgba(255, 0, 0, 0.05)'
		}
		if (isSoldOut || maxProductQuantity <= 0) {
			bgColor = 'hsl(0, 0%, 72%)'
		}
		return bgColor
	}

	const handleSaveProduct = () => {
		const isErrors = Object.values(errors).length > 0
		if (!isErrors) {
			handleSave && handleSave()
			return
		}
	}

	const handleRedirectLogin = (product: any) => {
		onClose()
		navigation.navigate('Home', { showAuth: true, product: { businessId: product?.businessId, id: product?.id, categoryId: product?.categoryId, slug: businessSlug } })
	}

	const saveErrors = orderState.loading || maxProductQuantity === 0 || Object.keys(errors).length > 0

	useEffect(() => {
		Keyboard.addListener('keyboardDidShow', () => {
			if (commentY > 100) {
				productFormRef?.current?.scrollTo?.({ x: 0, y: commentY + 300, animated: true })
			}
		})

		return () => {
			Keyboard.removeAllListeners('keyboardDidShow')
		}
	}, [productFormRef?.current, commentY])

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS ? 'padding' : 'height'}
			enabled={Platform.OS === 'ios'}
		>
			<ScrollView style={styles.mainContainer} ref={(ref) => productFormRef.current = ref}>
				{!error && (
					<View style={{ paddingBottom: 80 }}>
						<WrapHeader>
							{loading && !product ? (
								<View style={styles.productHeaderSkeleton}>
									<Placeholder Animation={Fade} >
										<PlaceholderLine height={300} style={{ borderRadius: 0 }} width={windowWidth} />
									</Placeholder>
								</View>
							) : (
								<>
									<TopHeader>
										<TouchableOpacity onPress={onClose} style={styles.closeButton}>
											<OIcon src={theme.images.general.close} width={11} />
										</TouchableOpacity>
									</TopHeader>
									<ProductHeader
										source={{ uri: product?.images || productCart?.images }}
										resizeMode={'contain'}
									/>
								</>
							)}
						</WrapHeader>
						<WrapContent>
							<ProductTitle>
								{loading && !product ? (
									<Placeholder Animation={Fade}>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
											<PlaceholderLine width={40} height={20} />
											<PlaceholderLine width={30} height={20} />
										</View>
									</Placeholder>
								) : (
									<View style={{ flexDirection: 'column', width: '100%' }}>
										<OText size={20} style={{ flex: I18nManager.isRTL ? 0 : 1, marginBottom: 10 }}>{product?.name || productCart.name}</OText>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
											{((product?.sku && product?.sku !== '-1' && product?.sku !== '1') || (product?.estimated_person)) && (
												<OText size={14} style={{ marginBottom: 10, flex: I18nManager.isRTL ? 1 : 0 }} color={'#909BA9'}>
													{
														((product?.sku && product?.sku !== '-1' && product?.sku !== '1') || (productCart?.sku && productCart?.sku !== '-1' && productCart?.sku !== '1'))
														&& <>{t('SKU', 'Sku')}{' '}{product?.sku || productCart?.sku}</>
													}
													{product?.sku && product?.sku !== '-1' && product?.sku !== '1' && product?.estimated_person && (
														<>&nbsp;&#183;&nbsp;</>
													)}
													{product?.estimated_person
														&& <>{product?.estimated_person}{' '}{t('ESTIMATED_PERSONS', 'persons')}</>
													}
												</OText>
											)}
										</View>
										<OText size={16} style={{ flex: I18nManager.isRTL ? 1 : 0 }} color={theme.colors.primary}>{productCart.price ? parsePrice(productCart.price) : ''}</OText>
									</View>
								)}
							</ProductTitle>
							{(product?.description || productCart?.description) && (
								<ProductDescription>
									<OText color={theme.colors.textSecondary}>{product?.description || productCart?.description}</OText>
								</ProductDescription>
							)}
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{ paddingBottom: 20 }}
							>
								{product?.tags?.map((tag: any) => (
									<View
										key={tag.id}
										style={styles.productTagWrapper}
									>
										{tag?.image ? (
											<OIcon
												url={optimizeImage(tag?.image, 'h_40,c_limit')}
												style={styles.productTagImageStyle}
											/>
										) : (
											<OIcon
												src={theme.images?.dummies?.product}
												style={styles.productTagImageStyle}
											/>
										)}
										<OText color={theme.colors.textSecondary} style={styles.productTagNameStyle}>{tag.name}</OText>
									</View>
								))}
							</ScrollView>
							{loading && !product ? (
								<>
									{[...Array(2)].map((item, i) => (
										<Placeholder key={i} style={{ marginBottom: 20 }} Animation={Fade}>
											<PlaceholderLine height={40} style={{ flex: 1, marginTop: 10 }} />
											{[...Array(3)].map((item, i) => (
												<View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
													<PlaceholderLine height={30} width={10} style={{ marginBottom: 20 }} />
													<PlaceholderLine height={30} width={50} style={{ marginBottom: 20 }} />
													<PlaceholderLine height={30} width={30} style={{ marginBottom: 20 }} />
												</View>
											))}
										</Placeholder>
									))}
								</>
							) : (
								<ProductEditions>
									{product?.ingredients?.length > 0 && (
										<View style={styles.optionContainer}>
											<SectionTitle>
												<OText style={theme.labels.middle as TextStyle}>{t('INGREDIENTS', 'Ingredients')}</OText>
											</SectionTitle>
											<WrapperIngredients style={{ backgroundColor: isSoldOut || maxProductQuantity <= 0 ? 'hsl(0, 0%, 72%)' : theme.colors.white }}>
												{product?.ingredients.map((ingredient: any) => (
													<ProductIngredient
														key={ingredient.id}
														ingredient={ingredient}
														state={productCart.ingredients[`id:${ingredient.id}`]}
														onChange={handleChangeIngredientState}
													/>
												))}
											</WrapperIngredients>
										</View>
									)}
									{product?.extras?.map((extra: any) => extra.options.map((option: any) => {
										const currentState = productCart.options[`id:${option.id}`] || {}
										return (
											<React.Fragment key={option.id}>
												{
													showOption(option) && (
														<View style={styles.optionContainer}>
															<ProductOption
																option={option}
																currentState={currentState}
																error={errors[`id:${option.id}`]}
															>
																<WrapperSubOption style={{ backgroundColor: isError(option.id) }}>
																	{
																		option.suboptions.map((suboption: any) => {
																			const currentState = productCart.options[`id:${option.id}`]?.suboptions[`id:${suboption.id}`] || {}
																			const balance = productCart.options[`id:${option.id}`]?.balance || 0
																			return suboption?.enabled ? (
																				<ProductOptionSubOption
																					key={suboption.id}
																					onChange={handleChangeSuboptionState}
																					balance={balance}
																					option={option}
																					suboption={suboption}
																					state={currentState}
																					disabled={isSoldOut || maxProductQuantity <= 0}
																				/>
																			) : null
																		})
																	}
																</WrapperSubOption>
															</ProductOption>
														</View>
													)
												}
											</React.Fragment>
										)
									}))}
									{!product?.hide_special_instructions && (
										<ProductComment onLayout={(e: any) => setCommentY(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
											<SectionTitle>
												<OText style={theme.labels.middle as TextStyle}>{t('SPECIAL_COMMENT', 'Special comment')}</OText>
											</SectionTitle>
											<OInput
												multiline
												placeholder={t('SPECIAL_COMMENT', 'Special comment')}
												value={productCart.comment}
												onChange={(val: string) => handleChangeCommentState({ target: { value: val } })}
												isDisabled={!(productCart && !isSoldOut && maxProductQuantity)}
												style={styles.comment}
												inputStyle={{ fontSize: 12, paddingBottom: 7, paddingTop: 17 }}
											/>
										</ProductComment>
									)}
									{productCart && !isSoldOut && maxProductQuantity > 0 && (
										<View style={{ paddingVertical: 4, marginBottom: 10 }}>
											<SectionTitle>
												<OText style={theme.labels.middle as TextStyle}>{t('PREFERENCES', 'Preferences')}</OText>
											</SectionTitle>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
												<OText style={theme.labels.normal as TextStyle}>{t('QUANTITY', 'Quantity')}</OText>
												<View style={styles.quantityControl}>
													<TouchableOpacity
														onPress={decrement}
														disabled={productCart.quantity === 1 || isSoldOut}
													>
														<OIcon src={theme.images.general.minus} width={16} color={productCart.quantity === 1 || isSoldOut ? theme.colors.textSecondary : theme.colors.backgroundDark} />
													</TouchableOpacity>
													<View style={styles.quantityWrap}>
														<OText size={12} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{productCart.quantity}</OText>
													</View>
													<TouchableOpacity
														onPress={increment}
														disabled={maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut}
													>
														<OIcon src={theme.images.general.plus} width={16} color={maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut ? theme.colors.textSecondary : theme.colors.backgroundDark} />
													</TouchableOpacity>
												</View>
											</View>
										</View>
									)}
								</ProductEditions>
							)}
						</WrapContent>
					</View>
				)}
				{error && error.length > 0 && (
					<NotFoundSource
						content={error[0]?.message || error[0]}
					/>
				)}
			</ScrollView>
			{!loading && !error && product && (
				<ProductActions style={{ paddingBottom: bottom + 20 }}>

					<View style={{ width: '100%' }}>
						{/* {productCart && !isSoldOut && maxProductQuantity > 0 && auth && orderState.options?.address_id && ( */}
						<OButton
							onClick={() => handleSaveProduct()}
							imgRightSrc=''
							text={`${orderState.loading ? t('LOADING', 'Loading') : editMode ? t('UPDATE', 'Update') : t('ADD_TO_CART', 'Add to Cart')}`}
							textSub={`${orderState.loading ? '' : productCart.total ? parsePrice(productCart?.total) : ''}`}
							textStyle={{ color: saveErrors ? theme.colors.textSecondary : theme.colors.white, fontSize: 14, fontWeight: Platform.OS === 'ios' ? '600' : 'bold' }}
							style={{
								bottom: 5,
								backgroundColor: saveErrors ? theme.colors.backgroundGray300 : theme.colors.primary,
								borderWidth: 1, shadowOpacity: 0, height: 40,
								borderColor: saveErrors ? theme.colors.backgroundGray300 : theme.colors.primary,
							}}
						/>
						{/* )} */}
						{auth && !orderState.options?.address_id && (
							orderState.loading ? (
								<OButton
									isDisabled
									text={t('LOADING', 'Loading')}
									imgRightSrc=''
								/>
							) : (
								<OButton
									onClick={navigation.navigate('AddressList')}
								/>
							)
						)}
						{(!auth || isSoldOut || maxProductQuantity <= 0) && (
							<OButton
								isDisabled={isSoldOut || maxProductQuantity <= 0}
								onClick={() => handleRedirectLogin(productCart)}
								text={isSoldOut || maxProductQuantity <= 0 ? t('SOLD_OUT', 'Sold out') : t('LOGIN_SIGNUP', 'Login / Sign Up')}
								imgRightSrc=''
								textStyle={{ color: theme.colors.primary, ...theme.labels.middle }}
								style={{ bottom: 5, marginTop: 2, height: 40, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: theme.colors.white }}
							/>
						)}
					</View>
				</ProductActions>
			)}
		</KeyboardAvoidingView>
	)
}

export const ProductForm = (props: any) => {
	const productOptionsProps = {
		...props,
		UIComponent: ProductOptionsUI
	}

	return <ProductOptions {...productOptionsProps} />
}
