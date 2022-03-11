import React, { useEffect, useRef } from 'react';
import {
	ProductForm as ProductOptions,
	useSession,
	useLanguage,
	useOrder,
	useUtils
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { ProductIngredient } from '../ProductIngredient';
import { ProductOption } from '../ProductOption';
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {
	Grayscale
} from 'react-native-color-matrix-image-filters'

import { View, TouchableOpacity, StyleSheet, Dimensions, I18nManager, SafeAreaView } from 'react-native';

import {
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
	ProductActions,
	ExtraOptionWrap,
	WeightUnitSwitch,
	WeightUnitItem,
	TopActions
} from './styles';
import { OButton, OIcon, OInput, OText } from '../shared';
import { ScrollView } from 'react-native-gesture-handler';
import { ProductOptionSubOption } from '../ProductOptionSubOption';
import { NotFoundSource } from '../NotFoundSource';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useState } from 'react';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

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
	} = props;

	const theme = useTheme();

	const styles = StyleSheet.create({
		mainContainer: {

		},
		headerItem: {
			overflow: 'hidden',
			backgroundColor: theme.colors.clear,
			width: 35,
			marginVertical: 18,
		},
		optionContainer: {
			marginBottom: 20,
		},
		comment: {
			borderWidth: 1,
			borderRadius: 8,
			borderColor: theme.colors.border,
			height: 100,
			alignItems: 'flex-start',
		},
		quantityControl: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginRight: 10,
		},
		btnBackArrow: {
			borderWidth: 0,
			backgroundColor: '#FFF',
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
			zIndex: 0,
		},
		extraItem: {
			paddingHorizontal: 7,
			paddingBottom: 10,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.border,
			justifyContent: 'center',
		},
		slide1: {
			flex: 1,
		},
		mainSwiper: {
			height: 258,
		},
		swiperButton: {
			marginHorizontal: 25,
			alignItems: 'center',
			justifyContent: 'center',
			width: 32,
			height: 32,
			borderRadius: 16,
			backgroundColor: 'rgba(208,208,208,0.5)'
		},
		unitItem: {
			fontSize: 12
		},
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
	});

	const [{ parsePrice, optimizeImage }] = useUtils();
	const [, t] = useLanguage();
	const [orderState] = useOrder();
	const [{ auth }] = useSession();
	const { product, loading, error } = productObject;
	const [gallery, setGallery] = useState([])
	const [thumbsSwiper, setThumbsSwiper] = useState(0)

	const [selOpt, setSelectedOpt] = useState(0);
	const [isHaveWeight, setIsHaveWeight] = useState(false)
	const [qtyBy, setQtyBy] = useState({
		weight_unit: false,
		pieces: true
	})
	const [pricePerWeightUnit, setPricePerWeightUnit] = useState<any>(null)

	const swiperRef: any = useRef(null)

	const isError = (id: number) => {
		let bgColor = theme.colors.white;
		if (errors[`id:${id}`]) {
			bgColor = 'rgba(255, 0, 0, 0.05)';
		}
		if (maxProductQuantity <= 0) {
			bgColor = 'hsl(0, 0%, 72%)';
		}
		if (isSoldOut) {
			bgColor = theme.colors.white;
		}
		return bgColor;
	};

	const handleSaveProduct = () => {
		const isErrors = Object.values(errors).length > 0;
		if (!isErrors) {
			handleSave && handleSave();
			return;
		}
	};

	const hasRespected = (options: Array<any>, respect_id: number) => {
		if (respect_id == null) return;
		const option: any = options.filter(({ id }: any) => id === selOpt);
		if (option == undefined) return false;
		if (option?.suboptions?.length == 0) return false;
		const sel = option[0]?.suboptions?.filter(
			({ id }: any) => id === respect_id,
		);
		return sel?.[0]?.id !== undefined;
	};

	const handleChangeMainIndex = (index: number) => {
		if (index < 0 || index > gallery.length - 1) {
			setThumbsSwiper(0)
			return
		}
		setThumbsSwiper(index)
	}

	const handleClickThumb = (index: number) => {
		swiperRef?.current.scrollBy(index - thumbsSwiper, true);
	}

	const handleRedirectLogin = () => {
		navigation.navigate('Login', {
			store_slug:  props.businessSlug
		});
	};

	const handleSwitchQtyUnit = (val: string) => {
		setQtyBy({ [val]: true, [!val]: false })
	}

	useEffect(() => {
		const productImgList: any = []
		product?.images && productImgList.push(product.images)
		if (product?.gallery && product?.gallery.length > 0) {
			for (const img of product?.gallery) {
				productImgList.push(img.file)
			}
		}
		setGallery(productImgList)

		if (product?.weight && product?.weight_unit) {
			setIsHaveWeight(true)
			setPricePerWeightUnit(product?.price / product?.weight)
		}
	}, [product])

	const saveErrors =
		orderState.loading ||
		maxProductQuantity === 0 ||
		Object.keys(errors).length > 0;

	const ExtraOptions = ({ eID, options }: any) => (
		<>
			{product?.ingredients.length > 0 && (
				<TouchableOpacity
					key={`eopt_all_00`}
					onPress={() => setSelectedOpt(-1)}
					style={[
						styles.extraItem,
						{
							borderBottomColor:
								selOpt == -1 ? theme.colors.textNormal : theme.colors.border,
						},
					]}>
					<OText
						color={selOpt == -1 ? theme.colors.textNormal : theme.colors.textSecondary}
						size={selOpt == -1 ? 14 : 12}
						weight={selOpt == -1 ? '600' : 'normal'}>
						{t('INGREDIENTS', 'Ingredients')}
					</OText>
				</TouchableOpacity>
			)}
			{options.map(({ id, name, respect_to }: any) => (
				<React.Fragment key={`cont_key_${id}`}>
					{respect_to == null && (
						<TouchableOpacity
							key={`eopt_key_${id}`}
							onPress={() => setSelectedOpt(id)}
							style={[
								styles.extraItem,
								{
									borderBottomColor:
										selOpt == id ? theme.colors.textNormal : theme.colors.border,
								},
							]}>
							<OText
								color={
									selOpt == id ? theme.colors.textNormal : theme.colors.textSecondary
								}
								size={selOpt == id ? 14 : 12}
								weight={selOpt == id ? '600' : 'normal'}>
								{name}
							</OText>
						</TouchableOpacity>
					)}
				</React.Fragment>
			))}
		</>
	);

	const handleGoBack = navigation?.canGoBack()
		? () => navigation.goBack()
		: () => navigation.navigate('Business', { store: props.businessSlug })

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TopHeader>
				<TopActions onPress={() => handleGoBack()}>
					<OIcon src={theme.images.general.arrow_left} width={15} />
				</TopActions>
			</TopHeader>
			<ScrollView>
				{!error && (
					<View style={{ paddingBottom: 80 }}>
						<WrapHeader>
							{loading && !product ? (
								<View style={styles.productHeaderSkeleton}>
									<Placeholder Animation={Fade}>
										<PlaceholderLine
											height={258}
											style={{ borderRadius: 0 }}
											width={windowWidth}
										/>
									</Placeholder>
								</View>
							) : (
								<>
									<Swiper
										loop={false}
										ref={swiperRef}
										showsButtons={true}
										style={styles.mainSwiper}
										showsPagination={false}
										onIndexChanged={(index) => handleChangeMainIndex(index)}
										prevButton={
											<View style={styles.swiperButton}>
												<IconAntDesign
													name="caretleft"
													color={theme.colors.white}
													size={13}
												// style={styles.starIcon}
												/>
											</View>
										}
										nextButton={
											<View style={styles.swiperButton}>
												<IconAntDesign
													name="caretright"
													color={theme.colors.white}
													size={13}
												// style={styles.starIcon}
												/>
											</View>
										}
									>
										{gallery.length > 0 && gallery.map((img, i) => (
											<View
												style={styles.slide1}
												key={i}
											>
												<FastImage
													style={{ height: '100%', opacity: isSoldOut ? 0.5 : 1 }}
													source={{
														uri: optimizeImage(img, 'h_258,c_limit'),
														priority: FastImage.priority.normal,
													}}
												/>
											</View>
										))}
									</Swiper>
									<ScrollView
										horizontal
										contentContainerStyle={{
											paddingHorizontal: 30,
											paddingVertical: 15
										}}
									>
										{gallery.length > 0 && gallery.map((img, index) => (
											<TouchableOpacity
												key={index}
												onPress={() => handleClickThumb(index)}
											>
												<View
													style={{
														height: 56,
														borderRadius: 8,
														margin: 8,
														opacity: index === thumbsSwiper ? 1 : 0.8
													}}
												>
													<OIcon
														url={img}
														style={{
															borderColor: theme.colors.lightGray,
															borderRadius: 8,
															minHeight: '100%',
															opacity: isSoldOut ? 0.5 : 1
														}}
														width={56}
														height={56}
														cover
													/>
												</View>
											</TouchableOpacity>

										))}
									</ScrollView>
								</>
							)}
						</WrapHeader>
						<WrapContent>
							<ProductTitle>
								{loading && !product ? (
									<Placeholder Animation={Fade}>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
											}}>
											<PlaceholderLine width={40} height={20} />
											<PlaceholderLine width={30} height={20} />
										</View>
									</Placeholder>
								) : (
									<>
										<View style={{ flexDirection: 'row' }}>
											<OText
												size={20}
												lineHeight={30}
												weight={'600'}
												style={{ flex: 1, marginBottom: 10 }}>
												{product?.name || productCart.name}
											</OText>
											{!!product?.calories && (
												<OText size={16} style={{ color: '#808080' }}>{product?.calories} cal
												</OText>
											)}
										</View>
										{((!!product?.sku && product?.sku !== '-1' && product?.sku !== '1') || (!!product?.estimated_person)) && (
											<OText size={14} style={{ flex: I18nManager.isRTL ? 1 : 0 }} color={'#909BA9'} mBottom={7}>
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
										{isHaveWeight ? (
											<OText size={16} lineHeight={24} color={theme.colors.primary}>{parsePrice(pricePerWeightUnit)} / {product?.weight_unit}</OText>
										) : (
											<View style={{ flexDirection: 'row', marginBottom: 10 }}>
												<OText size={16} style={{ flex: I18nManager.isRTL ? 1 : 0 }} color={theme.colors.primary}>{productCart.price ? parsePrice(productCart.price) : ''}</OText>
												{product?.offer_price !== null && product?.in_offer && (
													<OText style={{
														fontSize: 14,
														color: '#808080',
														textDecorationLine: 'line-through',
														marginLeft: 7,
														marginRight: 7
													}}>{parsePrice(product?.offer_price)}</OText>
												)}
											</View>
										)}
									</>
								)}
							</ProductTitle>
							<ProductDescription>
								<OText color={theme.colors.textSecondary} size={12} lineHeight={18}>
									{product?.description || productCart?.description}
								</OText>
							</ProductDescription>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{ paddingBottom: 30 }}
							>
								{product?.tags?.map((tag: any) => (
									<View
										key={tag.id}
										style={styles.productTagWrapper}
									>
										{!!tag?.image ? (
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
										<OText color={theme.colors.textSecondary} size={12} style={styles.productTagNameStyle}>{tag.name}</OText>
									</View>
								))}
							</ScrollView>
							{loading && !product ? (
								<>
									{[...Array(2)].map((item, i) => (
										<Placeholder
											key={i}
											style={{ marginBottom: 20 }}
											Animation={Fade}>
											<PlaceholderLine
												height={40}
												style={{ flex: 1, marginTop: 10 }}
											/>
											{[...Array(3)].map((item, i) => (
												<View
													key={'place_key_' + i}
													style={{
														flexDirection: 'row',
														justifyContent: 'space-between',
													}}>
													<PlaceholderLine
														height={30}
														width={10}
														style={{ marginBottom: 20 }}
													/>
													<PlaceholderLine
														height={30}
														width={50}
														style={{ marginBottom: 20 }}
													/>
													<PlaceholderLine
														height={30}
														width={30}
														style={{ marginBottom: 20 }}
													/>
												</View>
											))}
										</Placeholder>
									))}
								</>
							) : (
								<ProductEditions>
									<ExtraOptionWrap
										horizontal
										showsHorizontalScrollIndicator={false}
										style={{ marginBottom: 20 }}
										contentContainerStyle={{ paddingHorizontal: 33 }}
									>
										<TouchableOpacity
											key={`eopt_all_0`}
											onPress={() => setSelectedOpt(0)}
											style={[
												styles.extraItem,
												{
													borderBottomColor: selOpt == 0 ? theme.colors.textNormal : theme.colors.border,
												},
											]}>
											<OText
												color={selOpt == 0 ? theme.colors.textNormal : theme.colors.textSecondary}
												size={selOpt == 0 ? 14 : 12}
												weight={selOpt == 0 ? '600' : 'normal'}>
												{t('ALL', 'All')}
											</OText>
										</TouchableOpacity>
										{product?.extras.map((extra: any) =>
											<ExtraOptions key={extra.id} options={extra.options} />
										)}
									</ExtraOptionWrap>

									{selOpt == 0 ? (
										<>
											{product?.ingredients.length > 0 && (
												<View style={styles.optionContainer}>
													<SectionTitle>
														<OText size={16}>
															{t('INGREDIENTS', 'Ingredients')}
														</OText>
													</SectionTitle>
													<WrapperIngredients>
														{product?.ingredients.map((ingredient: any) => (
															<ProductIngredient
																key={ingredient.id}
																ingredient={ingredient}
																state={
																	productCart.ingredients[`id:${ingredient.id}`]
																}
																onChange={handleChangeIngredientState}
																isSoldOut={isSoldOut}
															/>
														))}
													</WrapperIngredients>
												</View>
											)}
											{product?.extras.map((extra: any) =>
												extra.options.map((option: any) => {
													const currentState =
														productCart.options[`id:${option.id}`] || {};
													return (
														<React.Fragment key={`popt_${option.id}`}>
															{showOption(option) && (
																<View style={styles.optionContainer}>
																	<ProductOption
																		option={option}
																		currentState={currentState}
																		error={errors[`id:${option.id}`]}>
																		<WrapperSubOption
																			style={{
																				backgroundColor: isError(option.id),
																				borderRadius: 7.6
																			}}>
																			{option.suboptions.map(
																				(suboption: any) => {
																					const currentState =
																						productCart.options[
																							`id:${option.id}`
																						]?.suboptions[
																						`id:${suboption.id}`
																						] || {};
																					const balance =
																						productCart.options[
																							`id:${option.id}`
																						]?.balance || 0;
																					return (
																						<ProductOptionSubOption
																							key={suboption.id}
																							isSoldOut={isSoldOut}
																							onChange={
																								handleChangeSuboptionState
																							}
																							balance={balance}
																							option={option}
																							suboption={suboption}
																							state={currentState}
																							disabled={
																								isSoldOut ||
																								maxProductQuantity <= 0
																							}
																						/>
																					);
																				},
																			)}
																		</WrapperSubOption>
																	</ProductOption>
																</View>
															)}
														</React.Fragment>
													);
												}),
											)}
										</>
									) : (
										<>
											{selOpt == -1 ? (
												<View style={styles.optionContainer}>
													<SectionTitle>
														<OText size={16}>
															{t('INGREDIENTS', 'Ingredients')}
														</OText>
													</SectionTitle>
													<WrapperIngredients>
														{product?.ingredients.map((ingredient: any) => (
															<ProductIngredient
																key={ingredient.id}
																ingredient={ingredient}
																state={
																	productCart.ingredients[`id:${ingredient.id}`]
																}
																onChange={handleChangeIngredientState}
																isSoldOut={isSoldOut}
															/>
														))}
													</WrapperIngredients>
												</View>
											) : (
												<>
													{product?.extras.map((extra: any) =>
														extra.options.map((option: any) => {
															if (
																option.id == selOpt ||
																(hasRespected(
																	extra.options,
																	option.respect_to,
																) &&
																	showOption(option))
															) {
																const currentState =
																	productCart.options[`id:${option.id}`] || {};
																return (
																	<React.Fragment key={option.id}>
																		{showOption(option) && (
																			<View style={styles.optionContainer}>
																				<ProductOption
																					option={option}
																					currentState={currentState}
																					error={errors[`id:${option.id}`]}>
																					<WrapperSubOption
																						style={{
																							backgroundColor: isError(
																								option.id,
																							),
																						}}>
																						{option.suboptions.map(
																							(suboption: any) => {
																								const currentState =
																									productCart.options[
																										`id:${option.id}`
																									]?.suboptions[
																									`id:${suboption.id}`
																									] || {};
																								const balance =
																									productCart.options[
																										`id:${option.id}`
																									]?.balance || 0;
																								return (
																									<ProductOptionSubOption
																										key={suboption.id}
																										onChange={
																											handleChangeSuboptionState
																										}
																										balance={balance}
																										option={option}
																										suboption={suboption}
																										state={currentState}
																										disabled={
																											isSoldOut ||
																											maxProductQuantity <= 0
																										}
																									/>
																								);
																							},
																						)}
																					</WrapperSubOption>
																				</ProductOption>
																			</View>
																		)}
																	</React.Fragment>
																);
															}
														}),
													)}
												</>
											)}
										</>
									)}
									{!product?.hide_special_instructions && (
										<ProductComment>
											<SectionTitle>
												<OText size={16} weight={'600'} lineHeight={24}>
													{t('SPECIAL_COMMENT', 'Special comment')}
												</OText>
											</SectionTitle>
											<OInput
												multiline
												placeholder={t('SPECIAL_COMMENT', 'Special comment')}
												value={productCart.comment}
												onChange={(val: string) =>
													handleChangeCommentState({ target: { value: val } })
												}
												isDisabled={
													!(productCart && !isSoldOut && maxProductQuantity)
												}
												style={styles.comment}
											/>
										</ProductComment>
									)}
								</ProductEditions>
							)}
						</WrapContent>
					</View>
				)}
				{!!error && error.length > 0 && (
					<NotFoundSource content={error[0]?.message || error[0]} />
				)}
			</ScrollView>
			{!loading && !error && product && (
				<ProductActions>
					<OText size={16} lineHeight={24} weight={'600'}>
						{productCart.total ? parsePrice(productCart?.total) : ''}
					</OText>
					{productCart && !isSoldOut && maxProductQuantity > 0 && (
						<View style={styles.quantityControl}>
							<TouchableOpacity
								onPress={decrement}
								disabled={productCart.quantity === 1 || isSoldOut}>
								<OIcon
									src={theme.images.general.minus}
									width={16}
									color={
										productCart.quantity === 1 || isSoldOut
											? theme.colors.backgroundGray
											: theme.colors.backgroundDark
									}
								/>
							</TouchableOpacity>
							<OText
								size={12}
								lineHeight={18}
								style={{ minWidth: 40, textAlign: 'center' }}
							>
								{qtyBy?.pieces && productCart.quantity}
								{qtyBy?.weight_unit && productCart.quantity * product?.weight}
							</OText>
							<TouchableOpacity
								onPress={increment}
								disabled={
									maxProductQuantity <= 0 ||
									productCart.quantity >= maxProductQuantity ||
									isSoldOut
								}>
								<OIcon
									src={theme.images.general.plus}
									width={16}
									color={
										maxProductQuantity <= 0 ||
											productCart.quantity >= maxProductQuantity ||
											isSoldOut
											? theme.colors.backgroundGray
											: theme.colors.backgroundDark
									}
								/>
							</TouchableOpacity>
							{isHaveWeight && (
								<WeightUnitSwitch>
									<TouchableOpacity
										onPress={() => handleSwitchQtyUnit('pieces')}
									>
										<WeightUnitItem active={qtyBy?.pieces}>
											<OText
												size={12}
												lineHeight={18}
												color={qtyBy?.pieces ? theme.colors.primary : theme.colors.textNormal}
											>
												{t('PIECES', 'pcs')}
											</OText>
										</WeightUnitItem>
									</TouchableOpacity>
									<View style={{ alignItems: 'flex-start' }}>
										<TouchableOpacity
											onPress={() => handleSwitchQtyUnit('weight_unit')}
										>
											<WeightUnitItem active={qtyBy?.weight_unit}>
												<OText
													size={12}
													lineHeight={18}
													color={qtyBy?.weight_unit ? theme.colors.primary : theme.colors.textNormal}
												>
													{product?.weight_unit}
												</OText>
											</WeightUnitItem>
										</TouchableOpacity>
									</View>
								</WeightUnitSwitch>
							)}
						</View>
					)}
					<View
						style={{
							width: isSoldOut || maxProductQuantity <= 0 ? '60%' : '40%',
						}}>
						{productCart &&
							!isSoldOut &&
							maxProductQuantity > 0 &&
							auth &&
							orderState.options?.address_id && (
								<OButton
									onClick={() => handleSaveProduct()}
									imgRightSrc=""
									text={`${orderState.loading
										? t('LOADING', 'Loading')
										: editMode
											? t('UPDATE', 'Update')
											: t('ADD', 'Add')
										}`}
									textStyle={{
										color: saveErrors ? theme.colors.primary : theme.colors.white,
										fontSize: orderState.loading || editMode ? 10 : 14
									}}
									style={{
										backgroundColor: saveErrors ? theme.colors.lightGray : theme.colors.primary,
										borderColor: saveErrors ? theme.colors.white : theme.colors.primary,
										opacity: saveErrors ? 0.3 : 1,
										borderRadius: 7.6,
										height: 44,
										shadowOpacity: 0,
										borderWidth: 1,
									}}
								/>
							)}
						{auth &&
							!orderState.options?.address_id &&
							(orderState.loading ? (
								<OButton
									isDisabled
									text={t('LOADING', 'Loading')}
									imgRightSrc=""
									textStyle={{ fontSize: 10 }}
								/>
							) : (
								<OButton onClick={navigation.navigate('AddressList')} />
							))}
						{(!auth || isSoldOut || maxProductQuantity <= 0) && (
							<OButton
								isDisabled={isSoldOut || maxProductQuantity <= 0}
								onClick={() => handleRedirectLogin()}
								text={
									isSoldOut || maxProductQuantity <= 0
										? t('SOLD_OUT', 'Sold out')
										: t('LOGIN_SIGNUP', 'Login / Sign Up')
								}
								imgRightSrc=""
								textStyle={{ color: theme.colors.primary, fontSize: 14 }}
								style={{
									height: 44,
									borderColor: theme.colors.primary,
									backgroundColor: theme.colors.white,
								}}
							/>
						)}
					</View>
				</ProductActions>
			)}
		</SafeAreaView>
	);
};


export const ProductForm = (props: any) => {
	const productOptionsProps = {
		...props,
		UIComponent: ProductOptionsUI,
	};

	return <ProductOptions {...productOptionsProps} />;
};
