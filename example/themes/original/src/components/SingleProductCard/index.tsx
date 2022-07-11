import React from 'react';
import {
	useLanguage,
	useConfig,
	useOrder,
	useUtils,
	SingleProductCard as SingleProductCardController
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { SingleProductCardParams } from '../../types';
import { CardContainer, CardInfo, SoldOut, QuantityContainer, PricesContainer, RibbonBox, LogoWrapper } from './styles';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { OText, OIcon } from '../shared';
import FastImage from 'react-native-fast-image'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { shape } from '../../utils';

function SingleProductCardPropsAreEqual(prevProps : any, nextProps : any) {
	return JSON.stringify(prevProps.product) === JSON.stringify(nextProps.product) && 
	prevProps.isSoldOut === nextProps.isSoldOut && 
	prevProps.productAddedToCartLength === nextProps.productAddedToCartLength
}

const SinguleProductCardUI = (props: SingleProductCardParams) => {
	const {
		product,
		isSoldOut,
		onProductClick,
		productAddedToCartLength,
		style,
		handleFavoriteProduct
	} = props;

	const theme = useTheme();

	const styles = StyleSheet.create({
		container: {
			borderWidth: 1,
			borderRadius: 7.6,
			borderColor: theme.colors.border,
			marginBottom: 28,
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
			width: 75,
			height: 75,
			borderRadius: 7.6
		},
		quantityContainer: {
			position: 'absolute',
			left: '100%',
			bottom: '100%',
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
			marginRight: 7
		}
	});


	const [, t] = useLanguage();
	const [stateConfig] = useConfig();
	const [{ parsePrice, optimizeImage }] = useUtils();
	const [orderState] = useOrder();

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
		handleFavoriteProduct && handleFavoriteProduct(!product?.favorite)
	}

	return (
		<CardContainer
			style={[
				styles.container,
				(isSoldOut || maxProductQuantity <= 0) && styles.soldOutBackgroundStyle,
				(style && { ...style }),
			]}
			onPress={() => onProductClick?.(product)}>
			{productAddedToCartLength > 0 && (
				<QuantityContainer style={[styles.quantityContainer, {
					transform: [{ translateX: 10 }, { translateY: -10 }],
				}]}>
					<OText size={12} color={theme.colors.white}>{productAddedToCartLength.toString()}</OText>
				</QuantityContainer>
			)}
			<CardInfo>
				<View style={styles.titleWrapper}>
					<OText
						size={12}
						weight={'500'}
						numberOfLines={1}
						ellipsizeMode="tail"
						style={styles.line18}>
						{product?.name}
					</OText>
					<TouchableOpacity
						onPress={handleChangeFavorite}
					>
						<IconAntDesign
							name={product?.favorite ? 'heart' : 'hearto'}
							color={theme.colors.danger5}
							size={18}
						/>
					</TouchableOpacity>
				</View>
				<PricesContainer>
					<OText color={theme.colors.primary}>{product?.price ? parsePrice(product?.price) : ''}</OText>
					{product?.offer_price !== null && product?.in_offer && (
						<OText style={styles.regularPriceStyle}>{product?.offer_price ? parsePrice(product?.offer_price) : ''}</OText>
					)}
				</PricesContainer>
				<OText
					size={10}
					numberOfLines={2}
					ellipsizeMode="tail"
					color={theme.colors.textSecondary}
					style={styles.line15}>
					{product?.description}
				</OText>
			</CardInfo>
			<LogoWrapper>
				{product?.ribbon?.enabled && (
					<RibbonBox
						bgColor={product?.ribbon?.color}
						isRoundRect={product?.ribbon?.shape === shape?.rectangleRound}
						isCapsule={product?.ribbon?.shape === shape?.capsuleShape}
					>
						<OText
							size={10}
							weight={'400'}
							color={theme.colors.white}
							numberOfLines={2}
							ellipsizeMode='tail'
							lineHeight={13}
						>
							{product?.ribbon?.text}
						</OText>
					</RibbonBox>
				)}
				{product?.images ? (
					<FastImage
						style={styles.productStyle}
						source={{
							uri: optimizeImage(product?.images, 'h_250,c_limit'),
							priority: FastImage.priority.normal,
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>
				) : (
					<OIcon
						src={theme?.images?.dummies?.product}
						style={styles.productStyle}
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
		</CardContainer>
	);
}

export const SingleProductCard = React.memo((props: SingleProductCardParams) => {
	const singleProductCardProps = {
		...props,
		UIComponent: SinguleProductCardUI
	}
	return <SingleProductCardController {...singleProductCardProps} />
}, SingleProductCardPropsAreEqual);
