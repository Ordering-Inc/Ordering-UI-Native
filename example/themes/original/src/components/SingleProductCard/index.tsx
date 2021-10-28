import React from 'react';
import {
	useLanguage,
	useConfig,
	useOrder,
	useUtils,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { SingleProductCardParams } from '../../types';
import { CardContainer, CardInfo, SoldOut } from './styles';
import { StyleSheet } from 'react-native';
import { OText, OIcon } from '../shared';
import FastImage from 'react-native-fast-image'

export const SingleProductCard = (props: SingleProductCardParams) => {
	const { businessId, product, isSoldOut, onProductClick } = props;

	const theme = useTheme();

	const styles = StyleSheet.create({
		container: {
			borderWidth: 1,
			borderRadius: 7.6,
			borderColor: theme.colors.border,
			marginBottom: 28,
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
			borderRadius: 7.6,
			marginStart: 12
		},
	});


	const [, t] = useLanguage();
	const [stateConfig] = useConfig();
	const [{ parsePrice, optimizeImage }] = useUtils();
	const [orderState] = useOrder();

	const editMode = typeof product?.code !== 'undefined';

	const removeToBalance = editMode ? product?.quantity : 0;
	const cart = orderState.carts[`businessId:${businessId}`];
	const productCart = cart?.products?.find(
		(prod: any) => prod.id === product?.id,
	);
	const totalBalance = (productCart?.quantity || 0) - removeToBalance;

	const maxCartProductConfig =
		(stateConfig.configs.max_product_amount
			? parseInt(stateConfig.configs.max_product_amount)
			: 100) - totalBalance;

	const productBalance =
		(cart?.products?.reduce(
			(sum: any, _product: any) =>
				sum + (product && _product.id === product?.id ? _product.quantity : 0),
			0,
		) || 0) - removeToBalance;
	let maxCartProductInventory =
		(product?.inventoried ? product?.quantity : undefined) - productBalance;
	maxCartProductInventory = !isNaN(maxCartProductInventory)
		? maxCartProductInventory
		: maxCartProductConfig;

	const maxProductQuantity = Math.min(
		maxCartProductConfig,
		maxCartProductInventory,
	);

	return (
		<CardContainer
			style={[
				styles.container,
				(isSoldOut || maxProductQuantity <= 0) && styles.soldOutBackgroundStyle,
			]}
			onPress={() => onProductClick(product)}>
			<CardInfo>
				<OText
					size={12}
					weight={'500'}
					numberOfLines={1}
					ellipsizeMode="tail"
					style={styles.line18}>
					{product?.name}
				</OText>
				<OText size={12} weight={'400'} style={styles.line18} color={theme.colors.textNormal}>
					{parsePrice(product?.price)}
				</OText>
				<OText
					size={10}
					numberOfLines={2}
					ellipsizeMode="tail"
					color={theme.colors.textSecondary}
					style={styles.line15}>
					{product?.description}
				</OText>
			</CardInfo>
			{/* <OIcon
				url={optimizeImage(product?.images, 'h_200,c_limit')}
				style={styles.productStyle}
			/> */}
			<FastImage
				style={styles.productStyle}
				source={{
					uri: optimizeImage(product?.images, 'h_200,c_limit'),
					priority: FastImage.priority.normal,
				}}
				resizeMode={FastImage.resizeMode.cover}
			/>
			{(isSoldOut || maxProductQuantity <= 0) && (
				<SoldOut>
					<OText size={12} weight="bold" color={theme.colors.textSecondary} style={styles.soldOutTextStyle}>
						{t('SOLD_OUT', 'SOLD OUT')}
					</OText>
				</SoldOut>
			)}
		</CardContainer>
	);
};
