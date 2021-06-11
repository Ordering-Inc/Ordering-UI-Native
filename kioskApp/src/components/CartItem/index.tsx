import React from 'react';
import { Dimensions, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';

import { StyledCartItem } from './styles';
import { OButton, OImage, OText } from '../shared';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme.json';
import { Product } from '../../types';

const _dim = Dimensions.get('window');

const CartItem = (props: CartItemProps) => {
	const [, t] = useLanguage();

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

	return (
		<StyledCartItem>
			<View style={{ flexDirection: 'row' }}>
				<OImage
					source={{ uri: product?.images || '' }}
					height={60}
					width={60}
					resizeMode="cover"
					borderRadius={6}
				/>

				<View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginHorizontal: 15 }}>
					<OText
						size={_dim.width * 0.025}
						weight="700"
					>
						{product?.name || ''}
					</OText>

					<OButton
						bgColor="transparent"
						borderColor="transparent"
						imgLeftSrc={IMAGES.edit}
						text={t('EDIT', 'Edit')}
						style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
						textStyle={{
							color: colors.primary,
							marginLeft: 6,
						}}
						onClick={() => { onEditProduct ? onEditProduct(product) : null }}
					/>
				</View>
			</View>
			
			<View style={{ alignItems: "flex-end" }} >
				<OText
					size={_dim.width * 0.025}
					weight="700"
					color={colors.primary}
				>
					{`$${product?.price}`}
				</OText>

				<OText
					size={_dim.width * 0.023}
					weight="500"
				>
					{`${product?.quantity.toString()}`}
				</OText>
			</View>
		</StyledCartItem>
	);
}

interface CartItemProps {
	isCartPending?: boolean,
  isCartProduct?: boolean,
  product?: Product,
  getProductMax?: any,
  changeQuantity?: (product: any, quantity: number) => {},
  onDeleteProduct?: (product: any) => void,
  onEditProduct?: (product: any) => void,
  offsetDisabled?: any,
  isFromCheckout?: any
}

export default CartItem;
