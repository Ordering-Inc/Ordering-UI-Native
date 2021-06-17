import React, { useState} from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import {
  Cart as CartController,
	useLanguage,
	useOrder,
	useConfig,
	useValidationFields,
	useUtils,
} from 'ordering-components/native';

import {
	StyledBottomContent,
	StyledContainer,
	StyledContent,
	StyledTopBar,
} from './styles';
import { OButton, OText } from '../shared';
import CartItem from '../CartItem';
import { colors } from '../../theme.json';
import { Cart as TypeCart } from '../../types';

const CartBottomSheetUI = (props: CartBottomSheetUIProps): React.ReactElement | null => {
	const {
    cart,
    clearCart,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    setIsCartsLoading,
		isFromCart,
		navigation,
	}  = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ parsePrice }] = useUtils()

  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState<any>(null)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)

  const selectedOrderType = orderState?.options?.type;

	const isCartPending = cart?.status === 2

  const handleDeleteClick = (product: any) => {
    removeProduct(product)
  }

  const handleEditProduct = (product: any) => {
    setCurProduct(product)
    setModalIsOpen(true)
  }

  const handlerProductAction = (product: any) => {
    if (Object.keys(product).length) {
      setModalIsOpen(false)
    }
  }

  const handleClearProducts = async () => {
    try {
      setIsCartsLoading && setIsCartsLoading(true)
      const result = await clearCart(cart?.uuid)
			setIsCartsLoading && setIsCartsLoading(false)
    } catch (error) {
      setIsCartsLoading && setIsCartsLoading(false)
    }
  }

  const handleChangeOrderType = () => {
    navigation.push('DeliveryType', {
      callback : () => {navigation.pop(1)},
      goBack: () => {navigation.pop(1)},
    });
  }

  const handleUpsellingPage = () => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    props.onNavigationRedirect('CheckoutNavigator', { screen: 'CheckoutPage', cartUuid: cart?.uuid })
  }

	if (!props?.visible) return null;

	return (
		<StyledContainer
			nestedScrollEnabled
			style={{
				height: props.height,
			}}
		>
			<StyledContent nestedScrollEnabled>
				<TopBar
					handleClearProducts={handleClearProducts}
					selectedOrderType={selectedOrderType}
				/>

				{cart?.products?.length > 0 && cart?.products.map((product: any) => (
          <CartItem
            key={product.code}
            isCartPending={isCartPending}
            isCartProduct
            product={product}
            changeQuantity={changeQuantity}
            getProductMax={getProductMax}
            offsetDisabled={offsetDisabled}
            onDeleteProduct={handleDeleteClick}
            onEditProduct={handleEditProduct}
          />
        ))}

			</StyledContent>

			<StyledBottomContent>
				<OButton
					text={(cart?.subtotal >= cart?.minimum || !cart?.minimum) && cart?.valid_address ? (
						!openUpselling !== canOpenUpselling ? `${t('CONFIRM_THIS', 'Confirm this')} $${cart?.total} ${t('ORDER', 'order')}`: t('LOADING', 'Loading')
					) : !cart?.valid_address ? (
						`${t('OUT_OF_COVERAGE', 'Out of Coverage')}`
					) : (
						`${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
					)}
					bgColor={(cart?.subtotal < cart?.minimum || !cart?.valid_address) ? colors.secundary : colors.primary}
					isDisabled={(openUpselling && !canOpenUpselling) || cart?.subtotal < cart?.minimum || !cart?.valid_address}
					borderColor={colors.primary}
					imgRightSrc={null}
					textStyle={{ color: 'white', textAlign: 'center', flex: 1 }}
					onClick={() => setOpenUpselling(true)}
					style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}
				/>
			</StyledBottomContent>
		</StyledContainer>
	);
}

const TopBar = (props:any) => {
	const [, t] = useLanguage();

	return (
		<StyledTopBar>
			<View>
				<OText
					size={_dim.width * 0.026}
					weight="700"
					mBottom={4}
				>
					{t('YOUR_ORDER', 'your order')}
				</OText>
				<OText
					size={_dim.width * 0.023}
					weight="500"
					color={colors.mediumGray}
				>
					{props?.selectedOrderType === 2 && t('TAKE_OUT', 'Take out')}
          {props?.selectedOrderType === 3 && t('EAT_IN', 'Eat in')}
				</OText>
			</View>

			<TouchableOpacity
				onPress={props?.handleClearProducts}
			>
				<View>
					<OText
						size={_dim.width * 0.024}
						weight="500"
						color={colors.primary}
					>
						{t('CANCEL_ORDER', 'Cancel order')}
					</OText>
				</View>
			</TouchableOpacity>
		</StyledTopBar>
	);
}

const _dim = Dimensions.get('window');

interface CartBottomSheetUIProps {
	visible: boolean;
	height: number | string;
	cart: TypeCart,
  clearCart: any,
  changeQuantity: any,
  getProductMax: any,
  offsetDisabled: any,
  removeProduct: any,
  setIsCartsLoading: any,
	isFromCart: any,
	navigation: any,
	onNavigationRedirect: any,
}

export const CartBottomSheet = (props: any) => {
  const cartProps = {
    ...props,
    UIComponent: CartBottomSheetUI
  }

  return (
    <CartController {...cartProps} />
  )
}
