import React, { useState} from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Cart as CartController,
	useLanguage,
	useOrder,
	useUtils,
} from 'ordering-components/native';

import {
	StyledBottomContent,
	StyledContainer,
	StyledContent,
	StyledTopBar,
} from './styles';
import { OButton, OModal, OText } from '../shared';
import CartItem from '../CartItem';
import { colors } from '../../theme.json';
import { Cart as TypeCart } from '../../types';
import { ProductForm } from '../ProductForm';
import { UpsellingProducts } from '../UpsellingProducts';
import { PORTRAIT, useDeviceOrientation } from '../../hooks/device_orientation_hook';

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
  const [orientationState] = useDeviceOrientation();

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

  const onCloseUpselling = () => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
  }

  const handleUpsellingPage = () => {
    onCloseUpselling()
    navigation?.navigate('Cart', { businessId: cart?.business_id })
  }

	if (!props?.visible) return null;

	return (
    <StyledContainer
      nestedScrollEnabled
      height={props.height}
    >
      <StyledContent
        nestedScrollEnabled
        minHeight={props.height * (orientationState.orientation === PORTRAIT ? 0.75 : 0.8)}
        maxHeight={props.height * (orientationState.orientation === PORTRAIT ? 0.75 : 0.8)}
        style={{
          marginVertical: props.height * 0.025,
        }}
      >
        <TopBar
          {...props}
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

      <StyledBottomContent
        minHeight={props.height * 0.1}
      >
        <OButton
          text={(cart?.subtotal >= cart?.minimum || !cart?.minimum) && cart?.valid_address ? (
            !openUpselling !== canOpenUpselling ? `${t('CONFIRM_THIS', 'Confirm this')} ${parsePrice(cart?.total)} ${t('ORDER', 'order')}`: t('LOADING', 'Loading')
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

      <OModal
        open={openProduct}
        entireModal
        customClose
        onClose={() => setModalIsOpen(false)}
      >
        <ProductForm
          productCart={curProduct}
          businessSlug={cart?.business?.slug}
          businessId={curProduct?.business_id}
          categoryId={curProduct?.category_id}
          productId={curProduct?.id}
          onSave={handlerProductAction}
          onClose={() => setModalIsOpen(false)}
        />

      </OModal>

      {openUpselling && (
        <UpsellingProducts
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          businessId={cart?.business_id}
          business={cart?.business}
          cartProducts={cart?.products}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
          onClose={onCloseUpselling}
        />
      )}
    </StyledContainer>
	);
}

const TopBar = (props:any) => {
	const [, t] = useLanguage();

	return (
		<StyledTopBar>
			<View>
				<OText
					size={20}
					weight="700"
					mBottom={4}
				>
					{t('YOUR_ORDER', 'your order')}
				</OText>
				<OText
					size={20}
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
						size={20}
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

interface CartBottomSheetUIProps {
	visible: boolean;
	height: number;
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
