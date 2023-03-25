import React, { useState } from 'react';
import {
	useLanguage,
	useConfig,
	useOrder,
	useUtils,
	useSession,
	ToastType,
	useToast,
	SingleProductCard as SingleProductCardController
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { SingleProductCardParams } from '../../types';
import { CardInfo, SoldOut, QuantityContainer, PricesContainer, RibbonBox, LogoWrapper, TagsContainer } from './styles';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { InView } from 'react-native-intersection-observer'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { OButton, OIcon, OText } from '../shared';
import FastImage from 'react-native-fast-image'
import { lightenDarkenColor, shape } from '../../utils';
import { LottieAnimation } from '../LottieAnimation';
import { CardAnimation } from '../shared/CardAnimation'

function SingleProductCardPropsAreEqual(prevProps: any, nextProps: any) {
	return JSON.stringify(prevProps.product) === JSON.stringify(nextProps.product) &&
		prevProps.isSoldOut === nextProps.isSoldOut &&
		prevProps.productAddedToCartLength === nextProps.productAddedToCartLength &&
		prevProps.categoryState === nextProps.categoryState
}

const SingleProductCardUI = React.memo((props: SingleProductCardParams) => {
	const {
		product,
		isSoldOut,
		onProductClick,
		productAddedToCartLength,
		style,
		handleFavoriteProduct,
		enableIntersection,
		navigation,
		businessId,
		isPreviously,
		viewString,
		businessSingleId
	} = props;

	const theme = useTheme();
	const hideAddButton = theme?.business_view?.components?.products?.components?.add_to_cart_button?.hidden ?? true
	const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
	const hideProductDescription = theme?.business_view?.components?.products?.components?.product?.components?.description?.hidden
	const hideProductLogo = viewString
		? theme?.[viewString]?.components?.cart?.components?.products?.image?.hidden
		: theme?.business_view?.components?.products?.components?.product?.components?.image?.hidden
	const textSize = isChewLayout ? 12 : 10
	const logoPosition = theme?.business_view?.components?.products?.components?.product?.components?.image?.position

	const styles = StyleSheet.create({
		container: {
			borderWidth: 1,
			borderColor: theme.colors.border,
			marginBottom: 25,
			minHeight: hideAddButton ? 100 : 165,
			flex: 1,
			flexDirection: hideAddButton ? 'row' : 'column',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: 12,
			borderRadius: 10,
			position: 'relative'
		},
		titleWrapper: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		line18: {
			lineHeight: 18,
		},
		line15: {
			lineHeight: 15,
		},
		soldOutBackgroundStyle: {
			backgroundColor: '#B8B8B8',
		},
		soldOutTextStyle: {
			textTransform: 'uppercase',
		},
		productStyle: {
			width: 85,
			height: 85,
			borderRadius: 7.6
		},
		quantityContainer: {
			position: 'absolute',
			right: 0,
			top: 0,
			width: 25,
			height: 25,
			textAlign: 'center',
			borderRadius: 25,
			alignItems: 'center'
		},
		regularPriceStyle: {
			fontSize: 12,
			color: '#808080',
			textDecorationLine: 'line-through',
			marginLeft: 7,
			marginRight: 0
		},
		productTagsStyle: {
			width: 30,
			height: 30,
			marginRight: 5
		}
	});

	const [, t] = useLanguage();
	const [stateConfig] = useConfig();
	const [{ auth }] = useSession()
	const [{ parsePrice, optimizeImage, parseDate }] = useUtils();
	const [orderState] = useOrder()
	const [, { showToast }] = useToast()
	const [isIntersectionObserver, setIsIntersectionObserver] = useState(!enableIntersection)

	const editMode = typeof product?.code !== 'undefined';

	const removeToBalance = editMode ? product?.quantity : 0;
	const cartProducts: any = Object.values(orderState.carts).reduce((products: any, _cart: any) => [...products, ..._cart?.products], [])
	const productBalance = cartProducts.reduce((sum: any, _product: any) => sum + (_product.id === product?.id ? _product.quantity : 0), 0)

	const totalBalance = (productBalance || 0) - removeToBalance

	const maxCartProductConfig =
		(stateConfig.configs.max_product_amount
			? parseInt(stateConfig.configs.max_product_amount)
			: 100) - totalBalance;

	let maxCartProductInventory =
		(product?.inventoried ? product?.quantity : undefined) - totalBalance;
	maxCartProductInventory = !isNaN(maxCartProductInventory)
		? maxCartProductInventory
		: maxCartProductConfig;

	const maxProductQuantity = Math.min(
		maxCartProductConfig,
		maxCartProductInventory,
	);

	const handleChangeFavorite = () => {
		if (auth) {
			handleFavoriteProduct && handleFavoriteProduct(!product?.favorite)
		} else {
			navigation && navigation.navigate('Login');
		}
	}

	const handleChangeIntersection = () => {
		if (enableIntersection) {
			setIsIntersectionObserver(true);
		}
	}

	const handleClickproduct = () => {
		if (productAddedToCartLength && product?.maximum_per_order && productAddedToCartLength >= product?.maximum_per_order) {
			showToast(ToastType.Error, t('PRODUCT_ON_MAXIMUM_ORDER', 'The product is on maximum order'))
			return
		}
		onProductClick?.(product)
	}

	return (
		<InView style={{ minHeight: hideAddButton ? 125 : 190, marginLeft: logoPosition === 'left' ? 12.5 : 0 }} triggerOnce={true} onChange={(inView: boolean) => handleChangeIntersection()}>
			{isIntersectionObserver ? (
				<CardAnimation
					onClick={() => handleClickproduct()}
					style={[
						styles.container,
						(isSoldOut || maxProductQuantity <= 0) && styles.soldOutBackgroundStyle,
						(style && { ...style })
					]}
				>
					<View style={{ flexDirection: logoPosition === 'left' ? 'row-reverse' : 'row' }}>
						{productAddedToCartLength > 0 && (
							<QuantityContainer businessSingleId={businessSingleId} style={[styles.quantityContainer, {
								transform: [{ translateX: logoPosition === 'right' ? 25 : -25 }, { translateY: -25 }],
							}]}>
								<OText size={12} color={theme.colors.white}>{productAddedToCartLength.toString()}</OText>
							</QuantityContainer>
						)}
						<CardInfo>
							<View style={styles.titleWrapper}>
								<OText
									size={textSize + 2}
									weight={'500'}
									numberOfLines={1}
									ellipsizeMode="tail"
									style={{ ...styles.line18, flex: 1 }}>
									{product?.name}
								</OText>
								{!isPreviously && (
									<LottieAnimation
										type='favorite'
										onClick={handleChangeFavorite}
										initialValue={product?.favorite ? 0.5 : 0}
										toValue={product?.favorite ? 0 : 0.5}
										disableAnimation={!auth}
										iconProps={{ color: theme.colors.danger5, size: 18 }}
										isActive={product?.favorite}
									/>
								)}
							</View>
							<PricesContainer>
								{!!product?.price && (
									<OText color={theme.colors.primary}>{parsePrice(product?.price)}</OText>
								)}
								{product?.offer_price !== null && !!product?.in_offer && (
									<OText style={styles.regularPriceStyle}>{product?.offer_price ? parsePrice(product?.offer_price) : ''}</OText>
								)}
								{!isPreviously && product?.tags && product?.tags.length > 0 && (
									<ScrollView
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
										horizontal
										style={{ marginLeft: 10 }}
										contentContainerStyle={{ flexGrow: 1 }}
									>
										{product?.tags.map((tag: any, i: any) => (
											<TouchableWithoutFeedback key={i}>
												<TagsContainer>
													<FastImage
														style={styles.productTagsStyle}
														source={tag.image ? {
															uri: optimizeImage(tag.image, 'h_250,c_limit'),
															priority: FastImage.priority.normal,
														} : theme?.images?.dummies?.product}
														resizeMode={FastImage.resizeMode.cover}
													/>
												</TagsContainer>
											</TouchableWithoutFeedback>
										))}
									</ScrollView>
								)}
							</PricesContainer>
							{!hideProductDescription && (
								<OText
									size={textSize}
									numberOfLines={!isPreviously ? 2 : 1}
									ellipsizeMode="tail"
									color={theme.colors.textSecondary}
									style={styles.line15}>
									{product?.description}
								</OText>
							)}
							{isPreviously && (
								<OText
									size={textSize}
									numberOfLines={1}
									ellipsizeMode="tail"
									color={theme.colors.primary}
									style={styles.line15}>
									{t('LAST_ORDERED_ON', 'Last ordered on')} {parseDate(product?.last_ordered_date, { outputFormat: 'MMM DD, YYYY' })}
								</OText>
							)}
						</CardInfo>
						<LogoWrapper logoPosition={logoPosition}>
							{!!product?.ribbon?.enabled && (
								<RibbonBox
									bgColor={product?.ribbon?.color}
									colorText={lightenDarkenColor(product?.ribbon?.color)}
									borderRibbon={lightenDarkenColor(product?.ribbon?.color)}
									isRoundRect={product?.ribbon?.shape === shape?.rectangleRound}
									isCapsule={product?.ribbon?.shape === shape?.capsuleShape}
								>
									<OText
										size={textSize}
										weight={'400'}
										color={lightenDarkenColor(product?.ribbon?.color) ? theme.colors.black : theme.colors.white}
										numberOfLines={2}
										ellipsizeMode='tail'
										lineHeight={13}
									>
										{product?.ribbon?.text}
									</OText>
								</RibbonBox>
							)}
							{!hideProductLogo && (
								<FastImage
									style={styles.productStyle}
									source={product?.images ? {
										uri: optimizeImage(product?.images, 'h_250,c_limit'),
										priority: FastImage.priority.normal,
									} : theme?.images?.dummies?.product}
									resizeMode={FastImage.resizeMode.cover}
								/>
							)}
						</LogoWrapper>

						{(isSoldOut || maxProductQuantity <= 0) && (
							<SoldOut>
								<OText size={12} weight="bold" color={theme.colors.textSecondary} style={styles.soldOutTextStyle}>
									{t('SOLD_OUT', 'SOLD OUT')}
								</OText>
							</SoldOut>
						)}
					</View>
					{!hideAddButton && (
						<OButton
							onClick={() => handleClickproduct()}
							style={{
								width: '100%',
								borderRadius: 7.6,
								marginTop: 10,
								height: 40

							}}
							bgColor={isSoldOut ? '#B8B8B8' : theme?.colors?.white}
							borderColor={theme?.colors.primary}
							textStyle={{ color: theme.colors.primary }}
							text={t('ADD', 'Add')}
						/>
					)}
				</CardAnimation>
			) : (
				<View style={{ marginBottom: 28, padding: 12, height: hideAddButton ? 125 : 165 }}>
					<Placeholder style={{ padding: 5 }} Animation={Fade}>
						<View style={{ flexDirection: 'row' }}>
							<Placeholder style={{ paddingVertical: 10, flex: 1 }}>
								<PlaceholderLine width={60} style={{ marginBottom: 15 }} />
								<PlaceholderLine width={20} />
							</Placeholder>
							<PlaceholderLine
								width={24}
								height={70}
								style={{ marginLeft: 10, marginBottom: 10 }}
							/>
						</View>
						<PlaceholderLine
							height={52}
						/>
					</Placeholder>
				</View>
			)}
		</InView>
	);
}, SingleProductCardPropsAreEqual);

export const SingleProductCard = (props: SingleProductCardParams) => {
	const singleProductCardProps = {
		...props,
		UIComponent: SingleProductCardUI
	}
	return <SingleProductCardController {...singleProductCardProps} />
}
