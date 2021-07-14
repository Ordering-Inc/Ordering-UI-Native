import React from 'react';
import { View } from 'react-native';
import { useLanguage, useUtils } from 'ordering-components/native';

import { StyledCartItem } from './styles';
import { OButton, OImage, OText } from '../shared';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme.json';
import { Product } from '../../types';
import QuantityControl from '../QuantityControl';
import { LANDSCAPE, useDeviceOrientation } from '../../hooks/device_orientation_hook';

const CartItem = (props: CartItemProps) => {
	const [, t] = useLanguage();
	const [orientationState] = useDeviceOrientation();
	const [{ parsePrice }] = useUtils();

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
						style={{
							maxWidth: orientationState?.orientation === LANDSCAPE
								? orientationState.dimensions.width * 0.2
								: orientationState.dimensions.width * 0.65,
						}}
						numberOfLines={2}
						size={18}
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
					size={18}
					weight="700"
					color={colors.primary}
				>
					{parsePrice(product?.price)}
				</OText>

				<QuantityControl
					val={product?.quantity || 0}
					onDecremet={(product?.quantity||0 > 1)
						? (() => { changeQuantity && changeQuantity(product, (product?.quantity || 0) - 1) })
						: undefined
					}
					onIncrement={changeQuantity && (() => { changeQuantity(product, (product?.quantity || 0) + 1) })}
					onDelete={onDeleteProduct && (() => { onDeleteProduct(product) })}
				/>
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
